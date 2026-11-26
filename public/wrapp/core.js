/* WR · núcleo del recomendador — lógica pura, sin DOM.
 * Lo usan la web (app.js), los scripts de Node (scripts/recommend.mjs) y, más adelante, la app Android
 * (dentro de un WebView). Si cambiás algo acá, cambia en todos lados.
 *
 *   const C = WRCore.create(window.WR_DATA, window.WR_TAGS);
 *   C.setRank("1");               // rango de las estadísticas (1 = Diamante+)
 *   C.recommend(draft)            // picks ordenados para draft.myRole
 *   C.forecast(draft)             // % de victoria y ventaja por línea
 *   C.gamePlan(draft, forecast)   // "Cómo jugar la partida" (HTML corto)
 *
 * draft = { myRole, mode: "team"|"lane", ally: {top,jungle,mid,adc,support}, enemy: {...},
 *           bans: [], first: "ally"|"enemy", order: { ally: [roles], enemy: [roles] } }
 */
(function (root) {
  const ROLES = [
    { k: "top", n: "Barón" },
    { k: "jungle", n: "Jungla" },
    { k: "mid", n: "Mid" },
    { k: "adc", n: "ADC" },
    { k: "support", n: "Soporte" },
  ];
  const ROLE_KEYS = ROLES.map((r) => r.k);
  const ROLE_NAME = Object.fromEntries(ROLES.map((r) => [r.k, r.n]));
  const TIERS = ["S+", "S", "A", "B", "C", "D"];
  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const fmt = (n, d = 1) => (n == null ? "–" : (+n).toFixed(d));
  const normq = (s) => String(s).toLowerCase().normalize("NFD").replace(/[^a-z0-9]/g, "");
  const emptyTeam = () => ({ top: null, jungle: null, mid: null, adc: null, support: null });
  const emptyDraft = () => ({
    myRole: "mid",
    mode: "team",
    ally: emptyTeam(),
    enemy: emptyTeam(),
    bans: [],
    first: "ally", // qué equipo tiene el primer pick
    order: { ally: [...ROLE_KEYS], enemy: [...ROLE_KEYS] },
  });
  // Orden de pick: el que elige primero pickea 1, 4-5, 8-9; el otro 2-3, 6-7, 10
  const PICK_SEQ = { first: [1, 4, 5, 8, 9], second: [2, 3, 6, 7, 10] };
  // Apodos que acepta el buscador de bans
  const NICK = { mf: "missfortune", tf: "twistedfate", ww: "warwick", j4: "jarvaniv", asol: "aurelionsol", mundo: "drmundo", yi: "masteryi", lee: "leesin", kog: "kogmaw", xin: "xinzhao", cait: "caitlyn", nunu: "nunuwillump", voli: "volibear", morde: "mordekaiser", heimer: "heimerdinger", fiddle: "fiddlesticks", blitz: "blitzcrank", trynda: "tryndamere", kha: "khazix", cho: "chogath", vel: "velkoz", ks: "ksante", wu: "wukong", mono: "wukong" };

  function create(D, rawTags) {
    let rank = "1";
    const CH = Object.fromEntries(D.champions.map((c) => [c.key, c]));
    const TAGS = {};
    for (const [k, v] of Object.entries(rawTags || {})) {
      const [dmg, range, front, engage, cc, peel, poke, dive, scale] = v.split(/\s+/);
      TAGS[k] = { dmg, range, front: +front, engage: +engage, cc: +cc, peel: +peel, poke: +poke, dive: +dive, scale };
    }
    const NO_TAG = { dmg: "AD", range: "M", front: 0, engage: 0, cc: 0, peel: 0, poke: 0, dive: 0, scale: "M" };
    const tag = (k) => TAGS[k] || NO_TAG;
    const name = (k) => CH[k]?.name || k;
    const stat = (k, role, rk = rank) => D.stats[rk]?.[role]?.[k];

    // ---------- matchup: ¿cuánto le gana A a B en esta línea? ----------
    // Devuelve puntos ≈ diferencia de winrate (positivo = A favorecido)
    function lane(a, b, role) {
      const sig = [];
      // Seemeta: winrate real del matchup
      const findSM = (x, y) => {
        const byRole = D.matchups[x] || {};
        const lists = byRole[role] ? [byRole[role]] : Object.values(byRole);
        for (const l of lists) {
          const m = [...l.hard, ...l.easy].find((e) => e.vs === y);
          if (m) return m;
        }
        return null;
      };
      let sm = findSM(a, b);
      let wr = null;
      if (sm) wr = sm.wr;
      else if ((sm = findSM(b, a))) wr = 100 - sm.wr;
      if (wr != null) sig.push(wr - 50);

      // WildRiftCore: ventaja cualitativa (-2..+2) con explicación
      const findWRC = (x, y) => {
        const byRole = D.counters[x] || {};
        const lists = byRole[role] ? [byRole[role], ...Object.values(byRole)] : Object.values(byRole);
        for (const l of lists) {
          const m = l.find((e) => e.vs === y);
          if (m) return m;
        }
        return null;
      };
      let edge = null;
      let text = null;
      const own = findWRC(a, b); // desde la ficha de A: edge = ventaja de B
      const other = findWRC(b, a); // desde la ficha de B: edge = ventaja de A
      if (own) {
        edge = -own.edge;
        text = own;
      } else if (other) {
        edge = other.edge;
      }
      if (edge != null) sig.push(edge * 3);
      const score = sig.length ? sig.reduce((s, x) => s + x, 0) / sig.length : null;
      return { score, wr, edge, text, other: own ? null : other, group: own?.group };
    }

    // Soporte contra el ADC rival (no hay datos de ese cruce): estimación por perfil + el porqué
    function supVsAdc(sup, adc) {
      const s = tag(sup);
      const a = tag(adc);
      let v = 0;
      const why = [];
      if (a.dive === 0) {
        v += s.engage * 0.8 + s.cc * 0.3;
        if (s.engage >= 2) why.push(`castiga a ${name(adc)} (sin escape)`);
      } else if (a.dive >= 2) {
        v += s.cc * 0.3 - s.engage * 0.2;
        if (s.cc >= 2) why.push(`frena a ${name(adc)} con control`);
      }
      if (a.scale === "E") {
        v += s.peel * 0.5 + s.poke * 0.3;
        if (s.peel >= 2) why.push(`aguanta el early de ${name(adc)}`);
      }
      if (a.scale === "L" && a.range === "R") {
        v += s.engage * 0.3 + s.poke * 0.3;
        if (s.poke >= 2 && !why.length) why.push(`no deja farmear a ${name(adc)}`);
      }
      return { score: +(v * 0.7 - 1.2).toFixed(2), why: why[0] || "" };
    }

    // Riesgo de pickear a ciegas: cuántos counters duros y jugados tiene en el rol
    const BLIND = new Map();
    function blindRisk(k, role) {
      const id = k + "|" + role + "|" + rank;
      if (!BLIND.has(id)) {
        const hard = opponents(k, role)
          .filter((m) => m.score <= -3 && (stat(m.b, role)?.pr || 0) >= 1)
          .sort((a, b) => a.score - b.score)
          .map((m) => m.b);
        BLIND.set(id, hard);
      }
      return BLIND.get(id);
    }

    // Sin datos del matchup (ej: Lucian mid): estimación por perfil de los dos campeones
    function laneEstimate(a, b) {
      const ta = tag(a);
      const tb = tag(b);
      let s = 0;
      if (ta.range === "R" && tb.range === "M") s += 1.5;
      if (ta.range === "M" && tb.range === "R") s -= 1.5;
      s += (ta.poke - tb.poke) * 0.6;
      if (tb.dive >= 2) s += ta.cc * 0.4;
      if (ta.dive >= 2) s -= tb.cc * 0.4;
      s += (ta.scale === "E" ? 0.8 : ta.scale === "L" ? -0.8 : 0) - (tb.scale === "E" ? 0.8 : tb.scale === "L" ? -0.8 : 0);
      return +(s * 0.8).toFixed(2);
    }

    // ---------- sinergias ----------
    const SYN_PTS = { S: 4, A: 2.5, B: 1.5 };
    // Sinergia según WildRiftCore, en cualquiera de las dos fichas
    function synergy(a, b) {
      const x = (D.synergies?.[a] || []).find((e) => e.with === b);
      const y = (D.synergies?.[b] || []).find((e) => e.with === a);
      const best = [x, y].filter(Boolean).sort((p, q) => SYN_PTS[q.tier] - SYN_PTS[p.tier])[0];
      return best ? { pts: SYN_PTS[best.tier], tier: best.tier, e: best } : null;
    }
    // Sinergia estimada por perfil (cuando no hay dato): ADC + soporte, o cualquier pareja
    function pairProfile(a, b, roleA, roleB) {
      const ta = tag(a);
      const tb = tag(b);
      const duo = (adc, sup) => {
        let s = 0;
        if (adc.scale === "L" || (adc.dive === 0 && adc.peel <= 1)) s += sup.peel * 0.8; // hypercarry -> peel
        if (adc.scale === "E" || adc.dive >= 1) s += sup.engage * 0.7 + sup.cc * 0.2; // agresivo -> engage
        if (adc.poke >= 2) s += sup.poke * 0.4;
        return s * 0.6;
      };
      if (roleA === "adc" && roleB === "support") return duo(ta, tb);
      if (roleA === "support" && roleB === "adc") return duo(tb, ta);
      // genérico: engage de uno + control/seguimiento del otro, y daño mixto
      let s = (ta.engage * tb.cc + tb.engage * ta.cc) * 0.12;
      if (ta.dmg !== tb.dmg && ta.dmg !== "MIX" && tb.dmg !== "MIX") s += 0.6;
      return s;
    }
    const PAIR_W = { "support|adc": 1.6, "adc|support": 1.6, "jungle|mid": 1.1, "mid|jungle": 1.1, "jungle|top": 0.8, "top|jungle": 0.8 };
    const pairWeight = (r1, r2) => PAIR_W[`${r1}|${r2}`] || 0.5;

    // Todos los aliados con dato de sinergia para un campeón
    function synergyList(a) {
      const map = new Map();
      for (const e of D.synergies?.[a] || []) map.set(e.with, { k: e.with, tier: e.tier, role: e.role || mainRole(e.with), e, own: true });
      for (const [k, list] of Object.entries(D.synergies || {})) {
        const e = list.find((x) => x.with === a);
        if (!e || k === a) continue;
        const prev = map.get(k);
        if (!prev || SYN_PTS[e.tier] > SYN_PTS[prev.tier]) map.set(k, { k, tier: e.tier, role: mainRole(k), e, own: false });
      }
      return [...map.values()].sort((x, y) => SYN_PTS[y.tier] - SYN_PTS[x.tier]);
    }

    // Todos los rivales con datos para un campeón en un rol
    function opponents(a, role) {
      const set = new Set();
      const addSM = (byRole, cb) => {
        const l = byRole?.[role];
        if (l) [...l.hard, ...l.easy].forEach(cb);
      };
      addSM(D.matchups[a], (e) => set.add(e.vs));
      for (const [k, byRole] of Object.entries(D.matchups)) addSM(byRole, (e) => e.vs === a && set.add(k));
      const own = D.counters[a]?.[role] || (role === mainRole(a) ? Object.values(D.counters[a] || {})[0] : null);
      (own || []).forEach((e) => set.add(e.vs));
      for (const [k, byRole] of Object.entries(D.counters)) (byRole[role] || []).forEach((e) => e.vs === a && set.add(k));
      set.delete(a);
      return [...set].map((b) => ({ b, ...lane(a, b, role) })).filter((m) => m.score != null);
    }

    // Rol más jugado del campeón (pick rate en Diamante+)
    function mainRole(k) {
      const c = CH[k];
      if (!c) return "mid";
      let best = c.roles[0] || "mid";
      let pr = -1;
      for (const r of ROLES) {
        const s = stat(k, r.k, "1");
        if (s && s.pr > pr) {
          pr = s.pr;
          best = r.k;
        }
      }
      return best;
    }

    // ---------- draft ----------
    function used(d) {
      return new Set([...Object.values(d.ally), ...Object.values(d.enemy), ...d.bans].filter(Boolean));
    }

    // Número de pick de cada lugar y de quién es el turno
    const pickNo = (d, side, i) => (side === d.first ? PICK_SEQ.first : PICK_SEQ.second)[i];
    function draftTurn(d) {
      return (
        ["ally", "enemy"]
          .flatMap((side) => d.order[side].map((r, i) => ({ side, r, n: pickNo(d, side, i) })))
          .filter((x) => !d[x.side][x.r])
          .sort((a, b) => a.n - b.n)[0] || null
      );
    }

    function teamProfile(keys) {
      const p = { ad: 0, ap: 0, front: 0, engage: 0, cc: 0, peel: 0, poke: 0, dive: 0, n: keys.length, late: 0 };
      for (const k of keys) {
        const t = tag(k);
        if (t.dmg === "AD") p.ad += 1;
        else if (t.dmg === "AP") p.ap += 1;
        else (p.ad += 0.5), (p.ap += 0.5);
        for (const f of ["front", "engage", "cc", "peel", "poke", "dive"]) p[f] += t[f];
        p.late += t.scale === "L" ? 1 : t.scale === "E" ? -1 : 0;
      }
      return p;
    }

    // Picks para d.myRole, de mejor a peor. Cada uno: { k, s, total, meta, laneScore, team, syn, reasons }
    // reasons = [[clase, texto]]: "p" = a favor, "n" = en contra, "" = neutro
    function recommend(d) {
      const role = d.myRole;
      const taken = used(d);
      if (d.ally[role]) taken.delete(d.ally[role]);
      const allies = Object.entries(d.ally).filter(([r, k]) => k && r !== role).map(([, k]) => k);
      const enemies = Object.values(d.enemy).filter(Boolean);
      const ap = teamProfile(allies);
      const ep = teamProfile(enemies);
      // [rival, peso, rol del rival]. En bot lane el soporte pelea contra los dos.
      const laneOpp =
        role === "adc"
          ? [[d.enemy.adc, 1, "adc"], [d.enemy.support, 0.5, "support"]]
          : role === "support"
            ? [[d.enemy.support, 1, "support"], [d.enemy.adc, 1, "adc"]]
            : [[d.enemy[role], 1, role]];
      const opps = laneOpp.filter(([k]) => k);
      const blind = !d.enemy[role]; // mi rival directo todavía no pickeó
      const teamMode = d.mode === "team";

      const pool = D.champions.filter((c) => !taken.has(c.key) && (stat(c.key, role) || c.roles.includes(role)));
      const out = pool.map((c) => {
        const k = c.key;
        const t = tag(k);
        const s = stat(k, role);
        const reasons = [];
        // 1) meta
        let meta = s ? (s.adj - 50) * 1.2 + (3 - s.lvl) * 0.5 : -2.5;
        if (!s) reasons.push(["n", "Poco jugado en este rol"]);
        else if (s.lvl <= 1) reasons.push(["p", `Tier ${TIERS[s.lvl]} en ${ROLE_NAME[role]}`]);

        // 2) línea
        let laneScore = 0;
        for (const [o, w, oRole] of opps) {
          if (role === "support" && oRole === "adc") {
            const sv = supVsAdc(k, o);
            laneScore += sv.score * w;
            if (sv.score >= 1 && sv.why) reasons.push(["p", sv.why[0].toUpperCase() + sv.why.slice(1)]);
            else if (sv.score <= -1.5) reasons.push(["n", `Poco impacto contra ${name(o)}`]);
            continue;
          }
          const m = oRole === role ? lane(k, o, role) : { score: null };
          if (m.score == null) {
            const est = laneEstimate(k, o);
            laneScore += est * w;
            if (w === 1)
              reasons.push([est >= 1 ? "p" : est <= -1 ? "n" : "", `vs ${name(o)}: ${est >= 1 ? "favorable" : est <= -1 ? "desfavorable" : "parejo"} (estimado por perfil, sin datos)`]);
            continue;
          }
          laneScore += m.score * w;
          const detail = m.wr != null ? `${fmt(m.wr)}% WR` : m.edge > 0 ? `ventaja +${m.edge}` : m.edge < 0 ? `desventaja ${m.edge}` : "parejo";
          if (m.score >= 1.5) reasons.push(["p", `Le gana a ${name(o)} (${detail})`]);
          else if (m.score <= -1.5) reasons.push(["n", `Pierde vs ${name(o)} (${detail})`]);
          else reasons.push(["", `Parejo vs ${name(o)}`]);
        }

        // 2b) pick a ciegas: si mi rival todavía no eligió, mejor un campeón con pocos counters duros
        if (blind && s) {
          const hard = blindRisk(k, role);
          if (!hard.length) (laneScore += 1.5), reasons.push(["p", "Seguro para pick a ciegas"]);
          else if (hard.length >= 2) {
            laneScore -= Math.min(4, hard.length * 0.9);
            reasons.push(["n", `A ciegas: lo counterean ${hard.slice(0, 3).map(name).join(", ")}`]);
          }
        }

        // 3) equipo
        let team = 0;
        if (teamMode && (allies.length || enemies.length)) {
          const dmgAD = t.dmg === "AD" ? 1 : t.dmg === "MIX" ? 0.5 : 0;
          const dmgAP = 1 - dmgAD;
          if (allies.length >= 2) {
            const apShare = ap.ap / allies.length;
            if (apShare <= 0.25 && dmgAP >= 0.5) (team += 3 * dmgAP), reasons.push(["p", "Tu equipo necesita daño mágico"]);
            else if (apShare >= 0.75 && dmgAD >= 0.5) (team += 3 * dmgAD), reasons.push(["p", "Tu equipo necesita daño físico"]);
            else if (apShare <= 0.25 && dmgAD === 1 && allies.length >= 3) (team -= 2), reasons.push(["n", "Equipo full AD"]);
            else if (apShare >= 0.75 && dmgAP === 1 && allies.length >= 3) (team -= 2), reasons.push(["n", "Equipo full AP"]);
          }
          if (ap.front < 3 && t.front >= 2) (team += t.front * 1.1), reasons.push(["p", "Aporta frontline"]);
          if (ap.engage < 3 && t.engage >= 2) (team += t.engage * 0.8), reasons.push(["p", "Da engage"]);
          if (ap.cc < 5 && t.cc >= 2) (team += t.cc * 0.5), reasons.push(["p", "Suma control (CC)"]);
          const carries = allies.filter((a) => tag(a).range === "R" && tag(a).scale === "L");
          if ((ep.dive >= 5 || carries.length) && t.peel >= 2) {
            team += t.peel * (ep.dive >= 5 ? 1 : 0.6);
            reasons.push(["p", ep.dive >= 5 ? "Peel contra sus divers" : `Protege a ${carries.map(name).join(", ")}`]);
          }
          if (ep.dive >= 6 && t.range === "R" && t.peel === 0 && t.dive === 0 && t.front === 0) (team -= 1.5), reasons.push(["n", "Frágil contra tanto dive"]);
          if (ep.poke >= 5 && (t.engage >= 2 || t.dive >= 2)) (team += 1.5), reasons.push(["p", "Entra sobre su poke"]);
          if (ep.front >= 6 && t.range === "R" && t.scale === "L") (team += 1.5), reasons.push(["p", "Derrite su frontline"]);
          if (ep.late >= 2 && t.scale === "E") (team += 1), reasons.push(["p", "Castiga antes de que escalen"]);
          if (ep.late <= -2 && t.scale === "L") (team -= 1), reasons.push(["n", "Rival fuerte temprano"]);
          if (enemies.length >= 3 && ep.cc >= 9 && t.range === "M" && t.front === 0) (team -= 1), reasons.push(["n", "Mucho CC rival para un melee frágil"]);
        }

        // 4) sinergia con aliados (ADC <-> soporte pesa más; en modo "ganar la línea" solo cuenta el dúo)
        let syn = 0;
        for (const [ar, ak] of Object.entries(d.ally)) {
          if (!ak || ar === role) continue;
          const duo = (role === "support" && ar === "adc") || (role === "adc" && ar === "support");
          if (!teamMode && !duo) continue;
          const w = pairWeight(role, ar);
          const sy = synergy(k, ak);
          if (sy) {
            syn += sy.pts * w;
            reasons.push(["p", `Sinergia ${sy.tier} con ${name(ak)}${sy.e.type ? ` (${sy.e.type})` : ""}`]);
          } else {
            const pp = pairProfile(k, ak, role, ar);
            syn += pp * w * 0.7;
            if (duo && pp >= 1.5) reasons.push(["p", `Combina con ${name(ak)} (perfil)`]);
            else if (duo && pp < 0.6) reasons.push(["n", `Poca sinergia con ${name(ak)}`]);
          }
        }

        const wLane = teamMode ? 1 : 1.6;
        const total = meta * 0.8 + laneScore * wLane + team + syn;
        return { k, s, total, meta, laneScore, team, syn, reasons };
      });
      return out.sort((a, b) => b.total - a.total);
    }

    // ---------- pronóstico: quién tiene ventaja ----------
    // Todo se mide en "puntos de winrate" y se suma; 50 + diferencia/2 = probabilidad de ganar.
    function compPenalty(keys) {
      const out = [];
      if (keys.length < 3) return out;
      const p = teamProfile(keys);
      const apShare = p.ap / (p.ad + p.ap || 1);
      if (keys.length >= 4 && (apShare <= 0.15 || apShare >= 0.85)) out.push([-2.5, apShare <= 0.15 ? "casi todo daño físico" : "casi todo daño mágico"]);
      if (keys.length >= 4 && p.front < 3) out.push([-2, "sin frontline"]);
      if (keys.length >= 4 && p.engage < 3) out.push([-1.5, "sin engage"]);
      if (p.cc >= 10) out.push([1.5, "mucho control"]);
      if (p.engage >= 8) out.push([1, "mucho engage"]);
      return out;
    }

    function forecast(d) {
      const parts = { meta: 0, lanes: 0, syn: 0, comp: 0 };
      const laneRows = [];
      const side = (team) => Object.entries(team).filter(([, k]) => k);
      const metaOf = ([r, k]) => {
        const s = stat(k, r);
        return s ? s.adj - 50 : -1.5; // fuera de su rol: pequeña penalización
      };
      for (const e of side(d.ally)) parts.meta += metaOf(e);
      for (const e of side(d.enemy)) parts.meta -= metaOf(e);

      for (const r of ROLE_KEYS) {
        const a = d.ally[r];
        const b = d.enemy[r];
        if (!a || !b) continue;
        const m = lane(a, b, r);
        const est = m.score == null;
        const sc = est ? laneEstimate(a, b) : m.score;
        laneRows.push({ r, a, b, sc, est });
        parts.lanes += sc * (r === "jungle" ? 0.25 : 0.4); // una línea ganada no es la partida ganada
      }

      const pairSyn = (team) => {
        let s = 0;
        const e = side(team);
        for (let i = 0; i < e.length; i++)
          for (let j = i + 1; j < e.length; j++) {
            const sy = synergy(e[i][1], e[j][1]);
            if (sy) s += sy.pts * 0.35 * (pairWeight(e[i][0], e[j][0]) >= 1 ? 1.3 : 1);
          }
        return s;
      };
      parts.syn = pairSyn(d.ally) - pairSyn(d.enemy);

      const ca = compPenalty(side(d.ally).map(([, k]) => k));
      const ce = compPenalty(side(d.enemy).map(([, k]) => k));
      parts.comp = ca.reduce((s, x) => s + x[0], 0) - ce.reduce((s, x) => s + x[0], 0);

      const diff = parts.meta + parts.lanes + parts.syn + parts.comp;
      const pct = Math.max(25, Math.min(75, 50 + diff / 2));
      return { pct, parts, laneRows, ca, ce, nA: side(d.ally).length, nE: side(d.enemy).length };
    }

    // ---------- plan de juego ----------
    // Lista de consejos en HTML corto (<b>…</b>; los nombres van escapados)
    function gamePlan(d, f) {
      const allies = Object.entries(d.ally).filter(([, k]) => k);
      const enemies = Object.entries(d.enemy).filter(([, k]) => k);
      if (allies.length < 2 || enemies.length < 2) return [];
      const keysA = allies.map(([, k]) => k);
      const keysE = enemies.map(([, k]) => k);
      const ap = teamProfile(keysA);
      const ep = teamProfile(keysE);
      const top = (keys, f, n = 2) => [...keys].sort((x, y) => tag(y)[f] - tag(x)[f]).filter((k) => tag(k)[f] >= 2).slice(0, n);
      const list = (ks) => ks.map((k) => esc(name(k))).join(" y ");
      const tips = [];

      // 1) Win condition según el estilo de la composición
      const style = (p, n) => {
        const per = (v) => v / n;
        const scores = {
          teamfight: per(p.engage) + per(p.cc) * 0.6,
          poke: per(p.poke) * 1.3,
          pick: per(p.dive) * 1.1,
          protect: per(p.peel) * 1.1,
        };
        return Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
      };
      const myStyle = style(ap, keysA.length);
      const carriesA = keysA.filter((k) => tag(k).scale === "L" && (tag(k).range === "R" || tag(k).dmg !== "AD"));
      const mainCarry = carriesA.sort((a, b) => (stat(b, mainRole(b))?.adj || 50) - (stat(a, mainRole(a))?.adj || 50))[0] || d.ally.adc || d.ally.mid;
      const WC = {
        teamfight: () => `<b>Win condition: pelea 5 contra 5 en objetivos.</b> Iniciá con ${list(top(keysA, "engage")) || "tu engage"} y que el resto siga con su control. Forzá las peleas en dragón y Barón, no en la jungla abierta.`,
        poke: () => `<b>Win condition: poke y asedio.</b> Bajales vida con ${list(top(keysA, "poke")) || "tu poke"} antes de cada objetivo y tomá torres sin entrar a pelear de frente. No les des engage gratis.`,
        pick: () => `<b>Win condition: picks y flancos.</b> ${list(top(keysA, "dive")) || "Tus divers"} buscan a jugadores aislados o su backline. Poné visión en la jungla rival y jugá a atrapar a alguien antes del objetivo.`,
        protect: () => `<b>Win condition: proteger a ${esc(name(mainCarry))}.</b> El equipo juega alrededor de tu carry. ${list(top(keysA, "peel")) || "Tu soporte"} se queda a su lado para frenar a los que entren, y ${esc(name(mainCarry))} pega desde atrás.`,
      };
      tips.push(WC[myStyle]());

      // 2) Ritmo: ¿quién escala mejor?
      const lateA = ap.late / keysA.length;
      const lateE = ep.late / keysE.length;
      if (lateA - lateE >= 0.35)
        tips.push(`<b>Escalás mejor que el rival.</b> Aguantá el early, farmeá y evitá peleas parejas antes de tener 2-3 ítems. Cediles algún dragón temprano antes que pelear en desventaja.`);
      else if (lateE - lateA >= 0.35)
        tips.push(`<b>El rival escala mejor.</b> Tu ventana es el early y el mid game: invadí, peleá los primeros dragones y el Heraldo, y cerrá la partida antes del minuto 15-18.`);
      else tips.push(`<b>Escalado parejo.</b> La partida se decide por objetivos: priorizá los dragones y llegá primero a las peleas con la visión puesta.`);

      // 3) Líneas: dónde jugar
      const best = [...f.laneRows].sort((a, b) => b.sc - a.sc)[0];
      const worst = [...f.laneRows].sort((a, b) => a.sc - b.sc)[0];
      if (best && best.sc >= 1.5)
        tips.push(`<b>Tu mejor línea: ${ROLE_NAME[best.r]}</b> (${esc(name(best.a))} vs ${esc(name(best.b))}). ${
          best.r === "jungle" ? "Tu jungla gana el duelo: invadí y robale campamentos." : "El jungla puede gankearla para hacerla crecer y que después rote a ayudar."
        }`);
      if (worst && worst.sc <= -1.5)
        tips.push(`<b>Línea difícil: ${ROLE_NAME[worst.r]}</b> (${esc(name(worst.a))} vs ${esc(name(worst.b))}). Que juegue seguro bajo torre y farmee. El jungla debería cubrirla en vez de forzar ganks del otro lado.`);

      // 4) Amenazas del rival
      const engE = top(keysE, "engage", 1)[0];
      const carryE = keysE.filter((k) => tag(k).scale === "L").sort((a, b) => (stat(b, mainRole(b))?.adj || 50) - (stat(a, mainRole(a))?.adj || 50))[0];
      if (engE) tips.push(`<b>Cuidado con ${esc(name(engE))}:</b> es su fuente de engage. Peleá cuando haya usado su habilidad clave (normalmente la R) o guardá Flash para esquivarla.`);
      if (carryE) tips.push(`<b>Focus en ${esc(name(carryE))}:</b> es su carry de late. ${ap.dive >= 6 ? "Tus divers tienen que saltarle encima en cada pelea." : "Presionalo en su línea temprano para que no escale."}`);
      if (ep.dive >= 6 && ap.peel < 4) tips.push(`<b>El rival tiene mucho dive.</b> Jugá agrupados y no dejes a tus carries solos. Rinden ítems defensivos como Ángel guardián o Reloj de arena.`);

      // 5) Ítems según daño rival
      const share = ep.ad / (ep.ad + ep.ap || 1);
      if (keysE.length >= 3 && share >= 0.75) tips.push(`<b>El rival es casi todo daño físico (${Math.round(share * 100)}%).</b> La armadura rinde mucho: los tanques y bruisers pueden ir con armadura completa.`);
      if (keysE.length >= 3 && share <= 0.25) tips.push(`<b>El rival es casi todo daño mágico (${Math.round((1 - share) * 100)}%).</b> Conviene armar resistencia mágica.`);
      return tips;
    }

    // ---------- roles rivales (en el draft del juego no se ven) ----------
    // Reparto más probable: el que maximiza el pick rate de cada campeón en su rol (Diamante+).
    // Devuelve un equipo { rol: campeón }. Es una estimación: la pantalla de carga la confirma.
    function guessRoles(keys) {
      const ks = keys.filter(Boolean).slice(0, 5);
      let best = {};
      let bs = -Infinity;
      const team = {};
      const go = (i, score) => {
        if (i === ks.length) {
          if (score > bs) (bs = score), (best = { ...team });
          return;
        }
        for (const r of ROLE_KEYS) {
          if (team[r]) continue;
          team[r] = ks[i];
          go(i + 1, score + Math.log((stat(ks[i], r, "1")?.pr || 0) + 0.05));
          delete team[r];
        }
      };
      go(0, 0);
      return Object.assign(emptyTeam(), best);
    }

    // ---------- buscar campeón por texto (bans escritos a mano) ----------
    // Primero los que empiezan igual, después los que lo contienen; a igual coincidencia, el más baneado
    function suggest(text, exclude = new Set()) {
      const q = normq(text);
      if (!q) return [];
      const scored = [];
      if (NICK[q] && CH[NICK[q]] && !exclude.has(NICK[q])) scored.push([-1, CH[NICK[q]]]);
      for (const c of D.champions) {
        if (exclude.has(c.key)) continue;
        const n = normq(c.name);
        const pos = n.startsWith(q) ? 0 : c.key.startsWith(q) ? 1 : n.includes(q) ? 2 : -1;
        if (pos >= 0) scored.push([pos, c]);
      }
      const banRate = (k) => Math.max(0, ...ROLES.map((r) => stat(k, r.k)?.br || 0));
      return scored.sort((a, b) => a[0] - b[0] || banRate(b[1].key) - banRate(a[1].key)).map((x) => x[1]);
    }

    return {
      D, CH, ROLES, ROLE_KEYS, ROLE_NAME, TIERS, PICK_SEQ,
      setRank: (r) => void (rank = String(r)),
      getRank: () => rank,
      tag, name, stat, esc, fmt, normq, emptyTeam, emptyDraft,
      lane, supVsAdc, laneEstimate, blindRisk,
      synergy, pairProfile, pairWeight, synergyList, opponents, mainRole,
      used, pickNo, draftTurn, teamProfile, recommend, compPenalty, forecast, gamePlan, suggest, guessRoles,
    };
  }

  root.WRCore = { create, ROLES, ROLE_KEYS, ROLE_NAME, TIERS, emptyTeam, emptyDraft };
})(typeof window !== "undefined" ? window : globalThis);
