/* WR · Counters & Draft — sin dependencias */
(() => {
  const D = window.WR_DATA;
  if (!D) {
    document.getElementById("app").innerHTML =
      '<p class="empty">Faltan los datos. Corré <code>npm run update</code> en la carpeta del proyecto.</p>';
    return;
  }

  // ---------- núcleo (core.js): datos, matchups, sinergias, recomendador, pronóstico ----------
  const C = window.WRCore.create(D, window.WR_TAGS);
  const { ROLES, ROLE_NAME, TIERS, CH, tag, name, esc, fmt, emptyTeam, lane, synergyList, opponents, mainRole, pairProfile, teamProfile } = C;

  // ---------- estado ----------
  const saved = JSON.parse(localStorage.getItem("wr-state") || "{}");
  const S = {
    view: saved.view || "champs",
    rank: saved.rank || "1",
    role: saved.role || "mid",
    search: "",
    draft: Object.assign(C.emptyDraft(), saved.draft || {}),
  };
  const save = () =>
    localStorage.setItem("wr-state", JSON.stringify({ view: S.view, rank: S.rank, role: S.role, draft: S.draft }));

  // ---------- helpers ----------
  const $ = (sel, el = document) => el.querySelector(sel);
  const img = (k, cls = "") => {
    const c = CH[k];
    return `<img class="${cls}" src="${esc(c?.avatar || "")}" alt="" loading="lazy" referrerpolicy="no-referrer">`;
  };
  const stat = (k, role, rank = S.rank) => D.stats[rank]?.[role]?.[k];
  const sign = (n, d = 1) => (n > 0 ? "+" : "") + fmt(n, d);
  const wrClass = (wr) => (wr >= 51 ? "wr-good" : wr <= 49 ? "wr-bad" : "");

  // ---------- render raíz ----------
  function render() {
    C.setRank(S.rank);
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
  const used = () => C.used(S.draft);
  const recommend = () => C.recommend(S.draft);
  const forecast = () => C.forecast(S.draft);
  const gamePlan = (f) => C.gamePlan(S.draft, f);

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
    const pickNo = (side, i) => C.pickNo(d, side, i);
    const turn = C.draftTurn(d);
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

  const suggest = (text, exclude) => C.suggest(text, exclude);


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

  const normq = C.normq;

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
