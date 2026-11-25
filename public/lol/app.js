/* WR · Counters & Draft — sin dependencias */
(() => {
  const D = window.WR_DATA;
  if (!D) {
    document.getElementById("app").innerHTML =
      '<p class="empty">Faltan los datos. Corré <code>npm run update</code> en la carpeta del proyecto.</p>';
    return;
  }

  // ---------- constantes ----------
  const ROLES = [
    { k: "top", n: "Barón" },
    { k: "jungle", n: "Jungla" },
    { k: "mid", n: "Mid" },
    { k: "adc", n: "ADC" },
    { k: "support", n: "Soporte" },
  ];
  const ROLE_NAME = Object.fromEntries(ROLES.map((r) => [r.k, r.n]));
  const TIERS = ["S+", "S", "A", "B", "C", "D"];
  const GROUP_NAME = { hard: "Counter duro", unfavorable: "Desfavorable", skillMatchups: "Parejo", favorable: "Favorable" };
  const CH = Object.fromEntries(D.champions.map((c) => [c.key, c]));
  const TAGS = {};
  for (const [k, v] of Object.entries(window.WR_TAGS || {})) {
    const [dmg, range, front, engage, cc, peel, poke, dive, scale] = v.split(/\s+/);
    TAGS[k] = { dmg, range, front: +front, engage: +engage, cc: +cc, peel: +peel, poke: +poke, dive: +dive, scale };
  }
  const NO_TAG = { dmg: "AD", range: "M", front: 0, engage: 0, cc: 0, peel: 0, poke: 0, dive: 0, scale: "M" };
  const tag = (k) => TAGS[k] || NO_TAG;

  // ---------- estado ----------
  const saved = JSON.parse(localStorage.getItem("wr-state") || "{}");
  const emptyTeam = () => ({ top: null, jungle: null, mid: null, adc: null, support: null });
  const S = {
    view: saved.view || "champs",
    rank: saved.rank || "1",
    role: saved.role || "mid",
    search: "",
    draft: Object.assign(
      {
        myRole: "mid",
        mode: "team",
        ally: emptyTeam(),
        enemy: emptyTeam(),
        bans: [],
        first: "ally", // qué equipo tiene el primer pick
        order: { ally: ["top", "jungle", "mid", "adc", "support"], enemy: ["top", "jungle", "mid", "adc", "support"] },
      },
      saved.draft || {},
    ),
  };
  const save = () =>
    localStorage.setItem("wr-state", JSON.stringify({ view: S.view, rank: S.rank, role: S.role, draft: S.draft }));

  // ---------- helpers ----------
  const $ = (sel, el = document) => el.querySelector(sel);
  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const img = (k, cls = "") => {
    const c = CH[k];
    return `<img class="${cls}" src="${esc(c?.avatar || "")}" alt="" loading="lazy" referrerpolicy="no-referrer">`;
  };
  const name = (k) => CH[k]?.name || k;
  const stat = (k, role, rank = S.rank) => D.stats[rank]?.[role]?.[k];
  const fmt = (n, d = 1) => (n == null ? "–" : (+n).toFixed(d));
  const sign = (n, d = 1) => (n > 0 ? "+" : "") + fmt(n, d);
  const wrClass = (wr) => (wr >= 51 ? "wr-good" : wr <= 49 ? "wr-bad" : "");

  // ---------- matchup: ¿cuánto le gana A a B en esta línea? ----------
  // Devuelve puntos ≈ diferencia de winrate (positivo = A favorecido)
  function lane(a, b, role) {
    const sig = [];
    const notes = [];
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

  // Sin datos del matchup (ej: Lucian mid): estimación por perfil de los dos campeones
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
    const id = k + "|" + role + "|" + S.rank;
    if (!BLIND.has(id)) {
      const hard = opponents(k, role)
        .filter((m) => m.score <= -3 && (stat(m.b, role)?.pr || 0) >= 1)
        .sort((a, b) => a.score - b.score)
        .map((m) => m.b);
      BLIND.set(id, hard);
    }
    return BLIND.get(id);
  }

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

  // ---------- render raíz ----------
  function render() {
    document.querySelectorAll(".tab").forEach((t) => t.classList.toggle("on", t.dataset.view === S.view));
    if (S.view === "champs") renderChamps();
    else renderDraft();
    save();
  }

  function renderRankSelect() {
    const sel = $("#rank");
    sel.innerHTML = Object.entries(D.ranks)
      .map(([k, n]) => `<option value="${k}" ${k === S.rank ? "selected" : ""}>${esc(n)}</option>`)
      .join("");
    sel.onchange = () => {
      S.rank = sel.value;
      render();
    };
  }

  // ---------- vista: campeones ----------
  function renderChamps() {
    const role = S.role;
    const q = S.search.trim().toLowerCase();
    const list = D.champions
      .filter((c) => c.roles.includes(role) || stat(c.key, role))
      .filter((c) => !q || c.name.toLowerCase().includes(q))
      .map((c) => ({ c, s: stat(c.key, role) }))
      .sort((x, y) => (x.s ? 0 : 1) - (y.s ? 0 : 1) || (y.s?.adj ?? 0) - (x.s?.adj ?? 0));

    $("#app").innerHTML = `
      <div class="toolbar">
        <div class="chips">${ROLES.map((r) => `<button class="chip ${r.k === role ? "on" : ""}" data-role="${r.k}">${r.n}</button>`).join("")}</div>
        <input type="search" id="q" placeholder="Buscar campeón…" value="${esc(S.search)}">
      </div>
      <p class="hint">${list.length} campeones en <b>${ROLE_NAME[role]}</b> · ordenados por winrate ajustado a la cantidad de partidas (${esc(D.ranks[S.rank])}). Tocá uno para ver sinergias y counters.</p>
      <div class="grid">
        ${list
          .map(
            ({ c, s }) => `
          <button class="card ${s ? "" : "nodata"}" data-champ="${c.key}">
            ${s ? `<span class="tier t${s.lvl}">${TIERS[s.lvl] ?? "?"}</span>` : ""}
            ${img(c.key)}
            <div class="name">${esc(c.name)}</div>
            <div class="meta">${s ? `<span class="${wrClass(s.wr)}">${fmt(s.wr)}%</span> · ${fmt(s.pr)}% pick` : "sin datos en este rol"}</div>
          </button>`,
          )
          .join("")}
      </div>`;

    $("#app").querySelectorAll("[data-role]").forEach((b) => (b.onclick = () => ((S.role = b.dataset.role), render())));
    const qi = $("#q");
    qi.oninput = () => {
      S.search = qi.value;
      renderChamps();
      const n = $("#q");
      n.focus();
      n.setSelectionRange(n.value.length, n.value.length);
    };
    $("#app").querySelectorAll("[data-champ]").forEach((b) => (b.onclick = () => openChamp(b.dataset.champ, role)));
  }

  function openChamp(k, role) {
    const c = CH[k];
    if (!c.roles.includes(role) && !stat(k, role)) role = mainRole(k);
    const roles = ROLES.filter((r) => c.roles.includes(r.k) || stat(k, r.k));
    const s = stat(k, role);
    const ops = opponents(k, role).sort((x, y) => x.score - y.score);
    const weak = ops.filter((m) => m.score <= -1.5);
    const strong = ops.filter((m) => m.score >= 1.5).reverse();
    const even = ops.filter((m) => m.score > -1.5 && m.score < 1.5);

    const row = (m) => {
      const badge = m.score >= 1.5 ? "good" : m.score <= -1.5 ? "bad" : "even";
      const parts = [];
      if (m.wr != null) parts.push(`WR de ${esc(c.name)}: ${fmt(m.wr)}%`);
      if (m.edge != null) parts.push(m.edge > 0 ? `ventaja +${m.edge}` : m.edge < 0 ? `desventaja ${m.edge}` : "parejo");
      const t = m.text;
      const body = t
        ? `${t.summary ? `<p>${esc(t.summary)}</p>` : ""}${t.adapt ? `<p><span class="lbl">Cómo jugarlo:</span> ${esc(t.adapt)}</p>` : ""}`
        : m.other?.summary
          ? `<p><span class="lbl">Desde el lado de ${esc(name(m.b))}:</span> ${esc(m.other.summary)}</p>`
          : `<p>Solo hay datos estadísticos de este matchup.</p>`;
      return `<details class="mu"><summary>${img(m.b)}<div class="who"><b>${esc(name(m.b))}</b><span>${parts.join(" · ")}</span></div><span class="badge ${badge}">${sign(m.score)}</span></summary><div class="txt">${body}</div></details>`;
    };
    const col = (cls, title, sub, arr) =>
      `<div class="col ${cls}"><h3>${title} <span class="badge ${cls === "weak" ? "bad" : cls === "strong" ? "good" : "even"}">${arr.length}</span></h3><p class="sub">${sub}</p>${arr.length ? arr.map(row).join("") : '<p class="empty">Sin datos.</p>'}</div>`;

    // ---- sinergias ----
    const TARGET = { adc: ["support"], support: ["adc"], jungle: ["mid", "top"], mid: ["jungle"], top: ["jungle"] }[role];
    const TITLE = { adc: "Mejores soportes", support: "Mejores ADC", jungle: "Mejores aliados (mid y barón)", mid: "Mejores junglas", top: "Mejores junglas" }[role];
    const syns = synergyList(k);
    const main = syns.filter((x) => TARGET.includes(x.role));
    const others = syns.filter((x) => !TARGET.includes(x.role));
    const inData = new Set(syns.map((x) => x.k));
    const byProfile = D.champions
      .filter((o) => o.key !== k && !inData.has(o.key))
      .flatMap((o) =>
        TARGET.map((tr) => {
          const st = stat(o.key, tr);
          if (!st || st.pr < 0.5) return null;
          return { k: o.key, role: tr, st, score: pairProfile(k, o.key, role, tr) + (st.adj - 50) * 0.5 };
        }),
      )
      .filter(Boolean)
      .sort((x, y) => y.score - x.score)
      .slice(0, 6);
    const comboTxt = (e) => (e.combo || []).map((c) => `${esc(name(c.champ))} ${c.slot}`).join(" → ");
    const synRow = (x) => `
      <details class="mu"><summary>${img(x.k)}<div class="who"><b>${esc(name(x.k))}</b><span>${ROLE_NAME[x.role] || ""}${x.e.type ? " · " + esc(x.e.type) : ""}${
        x.e.combo?.length ? " · combo: " + comboTxt(x.e) : ""
      }</span></div><span class="badge ${x.tier === "S" ? "good" : x.tier === "A" ? "even" : ""}">Sinergia ${x.tier}</span></summary>
      <div class="txt">${x.e.note ? `<p><span class="lbl">Por qué (nota en inglés):</span> ${esc(x.e.note)}</p>` : "<p>Sin nota.</p>"}</div></details>`;
    const profRow = (x) => `
      <div class="mu"><summary style="cursor:default">${img(x.k)}<div class="who"><b>${esc(name(x.k))}</b><span>${ROLE_NAME[x.role]} · Tier ${TIERS[x.st.lvl]} · ${fmt(x.st.wr)}% WR</span></div><span class="badge even">perfil</span></summary></div>`;
    const synHtml = `
      <div class="cols syn-cols">
        <div class="col strong"><h3>${TITLE} para ${esc(c.name)} <span class="badge good">${main.length}</span></h3>
          <p class="sub">Según WildRiftCore. Tocá uno para ver por qué combinan.</p>
          ${main.length ? main.map(synRow).join("") : '<p class="empty">Sin datos directos: mirá la lista por perfil.</p>'}</div>
        <div class="col even"><h3>También combinan (por perfil y meta)</h3>
          <p class="sub">Estimado por el estilo de ${esc(c.name)} y el winrate de cada uno.</p>
          ${byProfile.map(profRow).join("")}</div>
        <div class="col"><h3>Otros aliados <span class="badge">${others.length}</span></h3>
          <p class="sub">Sinergias con otros roles.</p>
          ${others.length ? others.map(synRow).join("") : '<p class="empty">Sin datos.</p>'}</div>
      </div>`;

    openModal(`
      <div class="detail-head">
        ${img(k)}
        <div>
          <h2>${esc(c.name)}</h2>
          <div class="chips">${roles.map((r) => `<button class="chip ${r.k === role ? "on" : ""}" data-r="${r.k}">${r.n}</button>`).join("")}</div>
        </div>
        <div class="stats" style="margin-left:auto">
          ${s ? `<div title="Por winrate ajustado según cantidad de partidas">Tier<br><b>${TIERS[s.lvl]}</b></div><div>Winrate<br><b class="${wrClass(s.wr)}">${fmt(s.wr, 2)}%</b></div><div>Pick<br><b>${fmt(s.pr)}%</b></div><div>Ban<br><b>${fmt(s.br)}%</b></div><div title="El ranking oficial de Tencent pesa mucho el ban rate">Oficial<br><b>${TIERS[s.off] ?? "–"}</b></div>` : "<div>Sin estadísticas en este rol</div>"}
        </div>
      </div>
      <h3 class="sec">Sinergias</h3>
      ${synHtml}
      <h3 class="sec">Counters en ${ROLE_NAME[role]}</h3>
      <p class="hint">El número de cada matchup es la ventaja estimada de ${esc(c.name)} en puntos de winrate. Combina el winrate real del matchup (Seemeta) con el análisis de WildRiftCore. Tocá un campeón para ver la explicación.</p>
      <div class="cols">
        ${col("weak", "Débil contra", `Sus counters: evitá ${esc(c.name)} si pickean estos.`, weak)}
        ${col("strong", "Fuerte contra", `${esc(c.name)} castiga a estos campeones.`, strong)}
        ${col("even", "Parejos", "Depende de quién juegue mejor.", even)}
      </div>`);
    $("#modal-body").querySelectorAll("[data-r]").forEach((b) => (b.onclick = () => openChamp(k, b.dataset.r)));
  }

  // ---------- vista: draft ----------
  function used() {
    const d = S.draft;
    return new Set([...Object.values(d.ally), ...Object.values(d.enemy), ...d.bans].filter(Boolean));
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

  function recommend() {
    const d = S.draft;
    const role = d.myRole;
    const taken = used();
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
      let laneKnown = false;
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
        laneKnown = true;
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

  function forecast() {
    const d = S.draft;
    const parts = { meta: 0, lanes: 0, syn: 0, comp: 0 };
    const laneRows = [];
    const side = (team) => Object.entries(team).filter(([, k]) => k);
    const metaOf = ([r, k]) => {
      const s = stat(k, r);
      return s ? s.adj - 50 : -1.5; // fuera de su rol: pequeña penalización
    };
    for (const e of side(d.ally)) parts.meta += metaOf(e);
    for (const e of side(d.enemy)) parts.meta -= metaOf(e);

    for (const r of ROLES.map((x) => x.k)) {
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
  function gamePlan(f) {
    const d = S.draft;
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

  function forecastHtml() {
    const f = forecast();
    if (!f.nA && !f.nE) return "";
    const p = Math.round(f.pct);
    const chip = (lbl, v) => `<li class="${v >= 0.5 ? "p" : v <= -0.5 ? "n" : ""}">${lbl} ${sign(v / 2)}%</li>`;
    const lanes = f.laneRows
      .map(
        (l) => `<div class="lane-row"><span class="lr-role">${ROLE_NAME[l.r]}</span>${img(l.a)}<b>${esc(name(l.a))}</b><span class="badge ${
          l.sc >= 1.5 ? "good" : l.sc <= -1.5 ? "bad" : "even"
        }">${sign(l.sc)}${l.est ? "*" : ""}</span><b class="r">${esc(name(l.b))}</b>${img(l.b)}</div>`,
      )
      .join("");
    const plan = gamePlan(f);
    // [texto, es bueno para mí]
    const notes = [...f.ca.map((x) => [`Tu equipo: ${x[1]}`, x[0] > 0]), ...f.ce.map((x) => [`Rival: ${x[1]}`, x[0] < 0])];
    return `
      <section class="forecast">
        <div class="fc-head">
          <div><small>Mi equipo</small><b class="${p >= 50 ? "wr-good" : "wr-bad"}">${p}%</b></div>
          <div class="fc-bar"><i style="width:${p}%"></i></div>
          <div class="r"><small>Rival</small><b class="${p < 50 ? "wr-good" : "wr-bad"}">${100 - p}%</b></div>
        </div>
        <p class="hint">Probabilidad estimada de ganar con ${f.nA}/5 vs ${f.nE}/5 picks. Suma el winrate de cada campeón en su rol, los matchups de línea, las sinergias y la composición.</p>
        <ul class="reasons">${chip("Meta de los picks", f.parts.meta)}${chip("Líneas", f.parts.lanes)}${chip("Sinergias", f.parts.syn)}${chip("Composición", f.parts.comp)}${notes
          .map(([t, good]) => `<li class="${good ? "p" : "n"}">${esc(t)}</li>`)
          .join("")}</ul>
        ${lanes ? `<div class="lanes">${lanes}</div><p class="hint">Ventaja de tu campeón en cada línea, en puntos de winrate${f.laneRows.some((l) => l.est) ? " (* = estimado por perfil, sin datos del matchup)" : ""}.</p>` : ""}
        ${plan.length ? `<h3 class="sec">Cómo jugar la partida</h3><ul class="plan">${plan.map((t) => `<li>${t}</li>`).join("")}</ul>` : `<p class="hint">Cargá al menos 2 picks por lado para ver el plan de juego.</p>`}
      </section>`;
  }

  function renderDraft() {
    const d = S.draft;
    const allRecs = recommend();
    // Orden de pick: el que elige primero pickea 1, 4-5, 8-9; el otro 2-3, 6-7, 10
    const SEQ = { first: [1, 4, 5, 8, 9], second: [2, 3, 6, 7, 10] };
    const pickNo = (side, i) => (side === d.first ? SEQ.first : SEQ.second)[i];
    const turn = ["ally", "enemy"]
      .flatMap((side) => d.order[side].map((r, i) => ({ side, r, n: pickNo(side, i) })))
      .filter((x) => !d[x.side][x.r])
      .sort((a, b) => a.n - b.n)[0];
    const slot = (side, r, i) => {
      const k = d[side][r];
      const me = side === "ally" && r === d.myRole;
      const n = pickNo(side, i);
      const isTurn = turn && turn.side === side && turn.r === r;
      const quick =
        me && !k
          ? `<span class="quick">${allRecs
              .slice(0, 3)
              .map((x) => `<button type="button" class="qk" data-quick="${x.k}" title="Pickear ${esc(name(x.k))}">${img(x.k)}<span>${esc(name(x.k))}</span></button>`)
              .join("")}</span>`
          : "";
      return `<div class="slot-row" data-row="${side}:${r}">
        <span class="ord" draggable="true" data-ord="${side}:${r}" title="Arrastrá para cambiar el orden de pick">
          <b>${n}</b><span class="arr"><button type="button" data-up="${side}:${r}" aria-label="Subir">▲</button><button type="button" data-down="${side}:${r}" aria-label="Bajar">▼</button></span>
        </span>
        <div class="slot ${k ? "filled" : ""} ${me ? "me" : ""} ${isTurn ? "turn" : ""}" data-slot="${side}:${r}" role="button" tabindex="0">
          ${k ? img(k) : `<span class="ph">+</span>`}
          <span class="sl"><small>${ROLE_NAME[r]} ${me ? '<span class="you">TÚ</span>' : ""} ${isTurn ? '<span class="tn">TURNO</span>' : ""}</small><b>${k ? esc(name(k)) : me ? "Tu pick" : "Elegir"}</b></span>
          ${quick}
          ${k ? `<span class="clr" data-clear="${side}:${r}" title="Quitar">×</span>` : ""}
        </div>
      </div>`;
    };
    const ap = teamProfile(Object.values(d.ally).filter(Boolean));
    const ep = teamProfile(Object.values(d.enemy).filter(Boolean));
    const prof = (title, p, cls) => {
      const tot = p.ad + p.ap || 1;
      const bar = (lbl, v, max) => `<div class="bar-row"><span>${lbl}</span><div class="bar"><i style="width:${Math.min(100, (v / max) * 100)}%"></i></div><b>${v}</b></div>`;
      return `<div class="prof ${cls}"><h4>${title}</h4>
        <div class="legend"><span>AD ${Math.round((p.ad / tot) * 100)}%</span><span>AP ${Math.round((p.ap / tot) * 100)}%</span></div>
        <div class="dmg"><span class="ad" style="width:${(p.ad / tot) * 100}%"></span><span class="ap" style="width:${(p.ap / tot) * 100}%"></span></div>
        ${bar("Frontline", p.front, 10)}${bar("Engage", p.engage, 10)}${bar("Control", p.cc, 12)}${bar("Peel", p.peel, 10)}${bar("Poke", p.poke, 10)}${bar("Dive", p.dive, 12)}
      </div>`;
    };

    const recs = allRecs.slice(0, 8);
    const laneTxt =
      d.myRole === "adc" || d.myRole === "support"
        ? [d.enemy.adc, d.enemy.support].filter(Boolean).map(name).join(" + ")
        : d.enemy[d.myRole] && name(d.enemy[d.myRole]);

    $("#app").innerHTML = `
      <div class="draft-controls">
        <div class="ctrl"><span>Mi rol</span><div class="chips">${ROLES.map((r) => `<button class="chip ${r.k === d.myRole ? "on" : ""}" data-my="${r.k}">${r.n}</button>`).join("")}</div></div>
        <div class="ctrl"><span>Priorizar</span><div class="chips">
          <button class="chip ${d.mode === "lane" ? "on" : ""}" data-mode="lane">Ganar la línea</button>
          <button class="chip ${d.mode === "team" ? "on" : ""}" data-mode="team">Línea + equipo</button>
        </div>
        <button class="btn" id="reset" style="margin-left:auto">Limpiar draft</button></div>
        <div class="ctrl"><span>1er pick</span><div class="chips">
          <button class="chip ${d.first === "ally" ? "on" : ""}" data-first="ally">Mi equipo</button>
          <button class="chip ${d.first === "enemy" ? "on" : ""}" data-first="enemy">Rival</button>
        </div>${turn ? `<span class="turn-txt">Pick ${turn.n}: ${turn.side === "ally" ? "tu equipo" : "rival"} · ${ROLE_NAME[turn.r]}</span>` : ""}</div>
      </div>
      <div class="board">
        <div class="team ally"><h3>Mi equipo <small>orden de pick ↕</small></h3>${d.order.ally.map((r, i) => slot("ally", r, i)).join("")}</div>
        <div class="team enemy"><h3>Rival <small>orden de pick ↕</small></h3>${d.order.enemy.map((r, i) => slot("enemy", r, i)).join("")}</div>
      </div>
      <div class="bans">Bans:
        ${d.bans.map((k, i) => `<span class="ban">${img(k)}${esc(name(k))}<button data-unban="${i}" title="Quitar">×</button></span>`).join("")}
        ${
          d.bans.length < MAX_BANS
            ? `<span class="ban-box"><input id="ban-in" type="text" autocomplete="off" autocapitalize="off" spellcheck="false"
                 placeholder="${d.bans.length ? "seguí escribiendo…" : "Escribí los bans separados por coma: zed, yasuo, …"}">
                 <span class="ban-sug" id="ban-sug" hidden></span></span>
               <button class="btn" id="addban" title="Elegir de la lista">+</button>`
            : ""
        }
      </div>
      ${forecastHtml()}
      <div class="profile">${prof("Perfil de mi equipo", ap, "ally")}${prof("Perfil rival", ep, "enemy")}</div>
      <section class="recs">
        <h2>Mejores picks para ${ROLE_NAME[d.myRole]}</h2>
        <p class="hint">${laneTxt ? `Contra <b>${esc(laneTxt)}</b> en línea` : "Todavía no hay rival en tu línea: se priorizan meta y equipo"} · modo <b>${d.mode === "lane" ? "ganar la línea" : "línea + equipo"}</b>. Tocá uno para pickearlo.</p>
        ${recs
          .map(
            (r, i) => `
          <div class="rec">
            <div class="pos">${i + 1}</div>
            ${img(r.k)}
            <div>
              <div class="rn">${esc(name(r.k))}<small>${r.s ? `Tier ${TIERS[r.s.lvl]} · ${fmt(r.s.wr)}% WR` : "sin estadísticas"}</small></div>
              <ul class="reasons">${r.reasons.slice(0, 7).map(([c, t]) => `<li class="${c}">${esc(t)}</li>`).join("")}</ul>
            </div>
            <div class="score"><b>${sign(r.total)}</b><small>línea ${sign(r.laneScore)} · equipo ${sign(r.team)} · sinergia ${sign(r.syn)}</small>
              <div><button class="btn primary pick" data-pick="${r.k}">Pickear</button></div>
              <div><button class="btn pick" data-info="${r.k}">Counters</button></div>
            </div>
          </div>`,
          )
          .join("")}
      </section>`;

    const app = $("#app");
    app.querySelectorAll("[data-my]").forEach((b) => (b.onclick = () => ((d.myRole = b.dataset.my), render())));
    app.querySelectorAll("[data-mode]").forEach((b) => (b.onclick = () => ((d.mode = b.dataset.mode), render())));
    $("#reset").onclick = () => {
      d.ally = emptyTeam();
      d.enemy = emptyTeam();
      d.bans = [];
      render();
    };
    app.querySelectorAll("[data-first]").forEach((b) => (b.onclick = () => ((d.first = b.dataset.first), render())));
    // Orden de pick: ▲▼ (celular y PC) y arrastrar el número (PC)
    const moveOrder = (side, r, to) => {
      const o = d.order[side];
      const from = o.indexOf(r);
      if (from < 0 || to < 0 || to >= o.length) return;
      o.splice(from, 1);
      o.splice(to, 0, r);
      render();
    };
    app.querySelectorAll("[data-up],[data-down]").forEach(
      (b) =>
        (b.onclick = (e) => {
          e.stopPropagation();
          const [side, r] = (b.dataset.up || b.dataset.down).split(":");
          moveOrder(side, r, d.order[side].indexOf(r) + (b.dataset.up ? -1 : 1));
        }),
    );
    app.querySelectorAll("[data-ord]").forEach((h) => {
      h.ondragstart = (e) => {
        e.stopPropagation();
        e.dataTransfer.setData("text/x-order", h.dataset.ord);
        h.closest(".slot-row").classList.add("dragging");
      };
      h.ondragend = () => h.closest(".slot-row")?.classList.remove("dragging");
    });
    app.querySelectorAll("[data-slot]").forEach(
      (b) =>
        (b.onclick = (e) => {
          const [side, r] = b.dataset.slot.split(":");
          const q = e.target.closest("[data-quick]");
          if (q) {
            d[side][r] = q.dataset.quick;
            return render();
          }
          if (e.target.dataset.clear) {
            d[side][r] = null;
            return render();
          }
          openPicker(
            r,
            `${side === "ally" ? "Mi equipo" : "Rival"} · ${ROLE_NAME[r]}`,
            (k) => {
              // El orden de pick sigue el orden en que vas cargando: el campeón nuevo toma el primer
              // lugar libre. Tu propio lugar (TÚ) no se mueve: ese lo ubicás vos con ▲▼.
              if (!d[side][r] && !(side === "ally" && r === d.myRole)) {
                const o = d.order[side];
                const j = o.findIndex((x) => !d[side][x] && x !== r && !(side === "ally" && x === d.myRole));
                const i = o.indexOf(r);
                if (j >= 0 && j < i) [o[i], o[j]] = [o[j], o[i]];
              }
              d[side][r] = k;
              render();
            },
            d[side][r] ? { side, r } : null,
          );
        }),
    );
    // Arrastrar y soltar (PC): mover/intercambiar campeones entre lugares
    app.querySelectorAll(".slot.filled").forEach((b) => {
      b.draggable = true;
      b.ondragstart = (e) => {
        e.dataTransfer.setData("text/plain", b.dataset.slot);
        b.classList.add("dragging");
      };
      b.ondragend = () => b.classList.remove("dragging");
    });
    app.querySelectorAll("[data-slot]").forEach((b) => {
      b.ondragover = (e) => (e.preventDefault(), b.classList.add("drop"));
      b.ondragleave = () => b.classList.remove("drop");
      b.ondrop = (e) => {
        e.preventDefault();
        b.classList.remove("drop");
        const ord = e.dataTransfer.getData("text/x-order");
        if (ord) {
          // soltar el número de pick sobre otra fila del mismo equipo = reordenar
          const [side, r] = ord.split(":");
          const [tside, tr] = b.dataset.slot.split(":");
          if (side === tside && r !== tr) moveOrder(side, r, d.order[side].indexOf(tr));
          return;
        }
        const from = e.dataTransfer.getData("text/plain");
        if (from && from !== b.dataset.slot) swapSlots(from, b.dataset.slot);
      };
    });
    app.querySelectorAll("[data-unban]").forEach((b) => (b.onclick = () => (d.bans.splice(+b.dataset.unban, 1), render())));
    const ab = $("#addban");
    if (ab) ab.onclick = () => openPicker(null, "Agregar ban", (k) => (d.bans.push(k), render()));
    setupBanInput();
    app.querySelectorAll("[data-pick]").forEach((b) => (b.onclick = () => ((d.ally[d.myRole] = b.dataset.pick), render())));
    app.querySelectorAll("[data-info]").forEach((b) => (b.onclick = () => openChamp(b.dataset.info, d.myRole)));
  }

  // ---------- bans escribiendo: "zed, yasuo, ..." con autocompletado ----------
  const MAX_BANS = 10;
  let banFocus = false;

  // Campeones que coinciden con lo escrito: primero los que empiezan igual, después los que lo contienen
  const NICK = { mf: "missfortune", tf: "twistedfate", ww: "warwick", j4: "jarvaniv", asol: "aurelionsol", mundo: "drmundo", yi: "masteryi", lee: "leesin", kog: "kogmaw", xin: "xinzhao", cait: "caitlyn", nunu: "nunuwillump", voli: "volibear", morde: "mordekaiser", heimer: "heimerdinger", fiddle: "fiddlesticks", blitz: "blitzcrank", trynda: "tryndamere", kha: "khazix", cho: "chogath", vel: "velkoz", ks: "ksante", wu: "wukong", mono: "wukong" };
  function suggest(text, exclude) {
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
    // a igual coincidencia, primero el más baneado
    const banRate = (k) => Math.max(0, ...ROLES.map((r) => stat(k, r.k)?.br || 0));
    return scored.sort((a, b) => a[0] - b[0] || banRate(b[1].key) - banRate(a[1].key)).map((x) => x[1]);
  }

  function setupBanInput() {
    const inp = $("#ban-in");
    if (!inp) return;
    const box = $("#ban-sug");
    const d = S.draft;
    let sel = 0;
    let items = [];

    const add = (k) => {
      if (!k || d.bans.includes(k) || d.bans.length >= MAX_BANS) return false;
      d.bans.push(k);
      return true;
    };
    const commit = (keep = "") => {
      banFocus = true;
      render();
      const n = $("#ban-in");
      if (n) {
        n.value = keep;
        n.dispatchEvent(new Event("input"));
      }
    };
    const draw = () => {
      const token = inp.value.split(",").pop().trim();
      items = suggest(token, used()).slice(0, 6);
      sel = Math.min(sel, Math.max(0, items.length - 1));
      if (!token || !items.length) {
        box.hidden = true;
        box.innerHTML = token ? '<span class="empty">Sin coincidencias</span>' : "";
        if (token) box.hidden = false;
        return;
      }
      box.hidden = false;
      box.innerHTML = items
        .map((c, i) => `<button type="button" class="sug ${i === sel ? "on" : ""}" data-i="${i}">${img(c.key)}<span>${esc(c.name)}</span></button>`)
        .join("") + `<small class="sug-help">Enter / Tab / coma para elegir · ↑↓ para moverte</small>`;
      box.querySelectorAll(".sug").forEach((b) => (b.onmousedown = (e) => (e.preventDefault(), add(items[+b.dataset.i].key), commit())));
    };

    inp.oninput = () => {
      if (/^\s/.test(inp.value)) inp.value = inp.value.trimStart();
      const parts = inp.value.split(",");
      if (parts.length > 1) {
        // cada parte cerrada con coma se convierte en ban (la mejor coincidencia)
        let changed = false;
        for (const p of parts.slice(0, -1)) {
          const best = suggest(p.trim(), new Set([...used()]))[0];
          if (best && add(best.key)) changed = true;
        }
        if (changed) return commit(parts.at(-1).trimStart());
        inp.value = parts.at(-1).trimStart();
      }
      sel = 0;
      draw();
    };
    inp.onkeydown = (e) => {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        if (items.length) sel = (sel + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
        draw();
      } else if ((e.key === "Enter" || e.key === "Tab") && items.length && inp.value.trim()) {
        e.preventDefault();
        add(items[sel].key);
        commit();
      } else if (e.key === "Backspace" && !inp.value && d.bans.length) {
        d.bans.pop();
        commit();
      } else if (e.key === "Escape") {
        box.hidden = true;
      }
    };
    inp.onblur = () => setTimeout(() => (box.hidden = true), 150);
    inp.onfocus = () => draw();
    if (banFocus) {
      banFocus = false;
      inp.focus();
    }
  }

  // Intercambia dos lugares del draft ("ally:top" <-> "ally:jungle"); si el destino está vacío, lo mueve
  function swapSlots(a, b) {
    const d = S.draft;
    const [sa, ra] = a.split(":");
    const [sb, rb] = b.split(":");
    [d[sa][ra], d[sb][rb]] = [d[sb][rb], d[sa][ra]];
    render();
  }

  const normq = (s) => String(s).toLowerCase().normalize("NFD").replace(/[^a-z0-9]/g, "");

  function openPicker(role, title, onPick, move = null) {
    let r = role;
    let q = "";
    const taken = used();
    const draw = () => {
      const list = D.champions
        .filter((c) => q || !r || c.roles.includes(r) || stat(c.key, r)) // al buscar, busca en todos los roles
        .filter((c) => !q || normq(c.name).includes(q) || c.key.includes(q))
        .sort((a, b) => (r ? (stat(b.key, r)?.pr || 0) - (stat(a.key, r)?.pr || 0) : a.name.localeCompare(b.name)));
      $("#pk-grid").innerHTML = list
        .map(
          (c) =>
            `<button class="pk" data-k="${c.key}" ${taken.has(c.key) ? "disabled" : ""}>${img(c.key)}<span>${esc(c.name)}</span>${
              r && stat(c.key, r) ? `<small>${fmt(stat(c.key, r).pr)}% pick</small>` : ""
            }</button>`,
        )
        .join("");
      $("#pk-grid").querySelectorAll(".pk:not([disabled])").forEach((b) => (b.onclick = () => (closeModal(), onPick(b.dataset.k))));
      $("#modal-body").querySelectorAll("[data-pr]").forEach((b) => b.classList.toggle("on", (b.dataset.pr || null) === (r || null) || (!r && !b.dataset.pr)));
    };
    const cur = move && S.draft[move.side][move.r];
    openModal(`
      <h3 style="margin:0 0 10px">${esc(title)}</h3>
      ${
        cur
          ? `<div class="move-row">${img(cur)}<span>Mover <b>${esc(name(cur))}</b> a:</span>
              ${ROLES.filter((x) => x.k !== move.r)
                .map((x) => {
                  const there = S.draft[move.side][x.k];
                  return `<button class="chip" data-move="${x.k}">${x.n}${there ? ` <small>(cambia con ${esc(name(there))})</small>` : ""}</button>`;
                })
                .join("")}
            </div><p class="hint" style="margin-top:8px">…o elegí otro campeón para este lugar:</p>`
          : ""
      }
      <div class="toolbar" style="margin:0">
        <div class="chips"><button class="chip" data-pr="">Todos</button>${ROLES.map((x) => `<button class="chip" data-pr="${x.k}">${x.n}</button>`).join("")}</div>
        <input type="search" id="pk-q" placeholder="Buscar…" autocomplete="off">
      </div>
      <div class="picker-grid" id="pk-grid"></div>`);
    $("#modal-body").querySelectorAll("[data-pr]").forEach((b) => (b.onclick = () => ((r = b.dataset.pr || null), draw())));
    $("#modal-body").querySelectorAll("[data-move]").forEach(
      (b) => (b.onclick = () => (closeModal(), swapSlots(`${move.side}:${move.r}`, `${move.side}:${b.dataset.move}`))),
    );
    const qi = $("#pk-q");
    qi.oninput = () => ((q = normq(qi.value)), draw());
    // Enter = elegir el primer resultado
    qi.onkeydown = (e) => {
      if (e.key !== "Enter") return;
      const first = $("#pk-grid .pk:not([disabled])");
      if (first) first.click();
    };
    draw();
    if (matchMedia("(pointer:fine)").matches) qi.focus();
  }

  // ---------- modal ----------
  function openModal(html) {
    $("#modal-body").innerHTML = html;
    $("#modal").hidden = false;
    document.body.style.overflow = "hidden";
  }
  function closeModal() {
    $("#modal").hidden = true;
    document.body.style.overflow = "";
  }
  document.querySelectorAll("[data-close]").forEach((el) => (el.onclick = closeModal));
  document.addEventListener("keydown", (e) => e.key === "Escape" && closeModal());

  // ---------- init ----------
  document.querySelectorAll(".tab").forEach((t) => (t.onclick = () => ((S.view = t.dataset.view), render())));
  renderRankSelect();
  $("#foot").innerHTML = `Parche ${esc(D.patch || "?")} · estadísticas del ${esc(D.statDate)} · actualizado ${esc(new Date(D.updated).toLocaleString("es-AR"))}<br>
    Fuentes: ${esc(D.sources.stats)} · ${esc(D.sources.matchups)} · ${esc(D.sources.counters)}<br>
    Proyecto de fans sin relación con Riot Games ni Tencent.`;
  render();
})();
