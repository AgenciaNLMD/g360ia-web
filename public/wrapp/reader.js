/* WR · lector de pantallas del draft — lógica pura, sin DOM.
 * Recibe el texto que lee el OCR (ML Kit en el celu; el OCR de Windows en las pruebas) y dice en qué
 * pantalla está el juego y qué se ve: bans, picks, turno, roles, reloj. No sabe nada del recomendador:
 * el seguidor (tracker) junta las lecturas y arma el draft que usa core.js.
 *
 * Formato del OCR (líneas con su caja, en píxeles de la captura):
 *   { width, height, lines: [{ text, x, y, w, h }] }
 *
 *   const R = WRReader.create(window.WR_DATA.champions);
 *   R.read(ocr, { myName: "MiNick" })  -> { screen, ... }
 *   const T = WRReader.tracker(R);  T.update(ocr);  T.toDraft(core)
 *
 * Probado con un cliente en español a 2400×1080 (20:9). Las coordenadas están en esa escala; otros
 * formatos de pantalla se calibran en la beta.
 */
(function (root) {
  const W = 2400;
  const H = 1080;
  const ROLE_KEYS = ["top", "jungle", "mid", "adc", "support"];
  // Etiqueta de rol en la fila de un aliado que todavía no eligió
  const ROLE_LABEL = { "CARRIL CENTRAL": "mid", SOPORTE: "support", "CARRIL DEL DRAGON": "adc", "CARRIL DE BARON": "top", JUNGLA: "jungle" };
  // Centro vertical (aprox.) de las 5 filas de cada lado en el draft
  const ROWS_Y = [178, 322, 464, 608, 753];
  // Tarjetas de la pantalla de carga: orden fijo top, jungla, mid, ADC, soporte. Arriba aliados, abajo rivales.
  // Se recortan y agrandan ×3 antes del OCR (leídas enteras salen mal).
  const LOADING_CARDS = {
    xs: [446, 756, 1064, 1370, 1676],
    w: 276,
    ally: { y: 322, h: 84 },
    enemy: { y: 830, h: 115 },
  };

  const upper = (s) => String(s).toUpperCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const norm = (s) => String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z]/g, "");
  function lev(a, b) {
    const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
    for (let j = 1; j <= b.length; j++) d[0][j] = j;
    for (let i = 1; i <= a.length; i++)
      for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return d[a.length][b.length];
  }

  function create(champions) {
    const list = champions.map((c) => ({ key: c.key, name: c.name, n: norm(c.name) }));

    // Campeón por texto entero (títulos del draft, bans): tolera 1 letra mal cada 5
    function champExact(text) {
      const t = norm(text);
      if (t.length < 3) return null;
      let best = null;
      let bd = 99;
      for (const c of list) {
        const d = lev(t, c.n);
        if (d < bd) (bd = d), (best = c);
      }
      return best && bd <= Math.floor(best.n.length / 5) ? best.key : null;
    }
    // Campeón al principio de "nombre + skin" (pantalla de carga); el OCR a veces se come 1-2 letras iniciales
    function champPrefix(text) {
      const t = norm(text);
      let best = null;
      let bs = 0;
      for (const c of list) {
        for (let cut = 0; cut <= 2; cut++) {
          const part = c.n.slice(cut);
          if (part.length < 3) continue;
          const d = lev(t.slice(0, part.length), part);
          const score = (part.length - d - cut) / c.n.length;
          if (d <= Math.floor(part.length / 5) && score > bs) (bs = score), (best = c.key);
        }
      }
      return best;
    }

    // Pasa las cajas a la escala de referencia 2400×1080
    function scale(ocr) {
      const kx = (ocr.width || W) / W;
      const ky = (ocr.height || H) / H;
      return (ocr.lines || []).map((l) => ({ text: String(l.text || "").trim(), x: l.x / kx, y: l.y / ky, w: (l.w || 0) / kx, h: (l.h || 0) / ky }));
    }

    // ---------- ¿qué pantalla es? ----------
    function classify(L) {
      const head = L.filter((l) => l.y < 60 && l.x > 700 && l.x < 1700).map((l) => upper(l.text)).join(" ");
      const all = upper(L.map((l) => l.text).join(" | "));
      if (/BLOQUEOS DE ALIADOS|BLOQUEOS DE OPONENTES/.test(all)) return "ban-summary";
      if (/FASE DE BLOQUEO/.test(head)) return "ban";
      if (/EL.GE A TU CAMPE|SELECCIONANDO/.test(head)) return "pick";
      if (/FASE DE PREPARACI/.test(head)) return "prep";
      if (clock(L)) return "game";
      if (/RECOMENDADO|ARMADOS DE OBJETOS/.test(all)) return "shop";
      // Carga: sin título; nombres de jugadores en dos filas (aliados arriba, rivales abajo)
      const inBand = (y0, y1) => L.filter((l) => l.y > y0 && l.y < y1 && l.x > 400 && l.x < 2000).length;
      if (!head && inBand(320, 400) >= 4 && inBand(780, 940) >= 4) return "loading";
      return "unknown";
    }

    function clock(L) {
      const t = L.find((l) => /^\d{2}:\d{2}$/.test(l.text) && l.x > 1800 && l.y < 300);
      if (!t) return null;
      const [m, s] = t.text.split(":").map(Number);
      return { text: t.text, seconds: m * 60 + s };
    }

    // Filas de aliados del draft (izquierda): rol si todavía no eligió, campeón si ya eligió, y el jugador
    function allyRows(L, myName) {
      return ROWS_Y.map((y) => {
        const ls = L.filter((l) => l.x < 700 && l.y > y - 25 && l.y < y + 75 && l.text).sort((p, q) => p.y - q.y);
        if (!ls.length) return null;
        const top = ls[0];
        const player = ls[1]?.text ?? null;
        const role = ROLE_LABEL[upper(top.text)] || null;
        const champ = role ? null : champExact(top.text);
        const me = !!(myName && player && lev(norm(player), norm(myName)) <= Math.floor(norm(myName).length / 5));
        return { player, role, champ, me };
      });
    }
    // Filas de rivales (derecha): campeón confirmado o null ("Jugador N" = todavía no eligió)
    function enemyRows(L) {
      return ROWS_Y.map((y) => {
        const t = L.filter((l) => l.x >= 1800 && l.y > y - 25 && l.y < y + 75 && l.text).sort((p, q) => p.y - q.y)[0];
        return t && !/^Jugador/i.test(t.text) ? champExact(t.text) : null;
      });
    }
    // "Primera selección" aparece del lado del equipo que pickea primero
    function firstPick(L) {
      const f = L.find((l) => /PRIMERA SELECCI/.test(upper(l.text)));
      return f ? (f.x < W / 2 ? "ally" : "enemy") : null;
    }

    // ---------- leer una captura ----------
    function read(ocr, opts = {}) {
      const L = scale(ocr);
      const screen = classify(L);
      const out = { screen };
      if (screen === "ban") {
        out.allies = allyRows(L, opts.myName);
        out.first = firstPick(L);
      } else if (screen === "ban-summary") {
        const bans = L.filter((l) => l.x > 700 && l.x < 1700 && l.y > 300).map((l) => ({ k: champExact(l.text), y: l.y })).filter((b) => b.k);
        out.bans = { ally: bans.filter((b) => b.y < 600).map((b) => b.k), enemy: bans.filter((b) => b.y >= 600).map((b) => b.k) };
        out.allies = allyRows(L, opts.myName);
      } else if (screen === "pick") {
        const head = upper(L.filter((l) => l.y < 60 && l.x > 700 && l.x < 1700).map((l) => l.text).join(" "));
        out.turn = /EL.GE/.test(head) ? "me" : /TU EQUIPO/.test(head) ? "ally" : "enemy";
        out.allies = allyRows(L, opts.myName);
        out.enemies = enemyRows(L);
        out.first = firstPick(L);
      } else if (screen === "game") {
        const c = clock(L);
        out.clock = c.text;
        out.seconds = c.seconds;
        out.laneGuide = c.seconds <= 30; // la guía de líneas se muestra de la base a la torre
      }
      return out;
    }

    // Recortes de las 10 tarjetas de la carga, en píxeles de una captura de width×height
    function loadingCrops(width = W, height = H) {
      const kx = width / W;
      const ky = height / H;
      const out = [];
      for (const team of ["ally", "enemy"])
        LOADING_CARDS.xs.forEach((x, i) =>
          out.push({ team, role: ROLE_KEYS[i], x: Math.round(x * kx), y: Math.round(LOADING_CARDS[team].y * ky), w: Math.round(LOADING_CARDS.w * kx), h: Math.round(LOADING_CARDS[team].h * ky) }),
        );
      return out;
    }
    // Campeón de una tarjeta de carga (OCR del recorte). La última línea es el nombre del jugador.
    function readLoadingCard(ocr) {
      const lines = (ocr.lines || []).map((l) => String(l.text || ""));
      const text = lines.slice(0, Math.max(1, lines.length - 1)).join(" ");
      return champPrefix(text);
    }

    return { read, classify: (ocr) => classify(scale(ocr)), loadingCrops, readLoadingCard, champExact, champPrefix };
  }

  // ---------- seguidor: junta las lecturas de una partida ----------
  // Lo que en una pantalla no se ve (el rol de un aliado que ya eligió, los bans durante el draft)
  // se recuerda de las anteriores. Se reinicia con reset() al empezar otra partida.
  function tracker(R, opts = {}) {
    let st;
    const reset = () =>
      (st = {
        screen: null,
        turn: null,
        first: null,
        roleOf: {}, // jugador aliado -> rol (se ve en su fila mientras no eligió)
        allyOrder: [], // roles en orden de pick (orden actual de las filas)
        ally: {}, // rol -> campeón
        myRole: null,
        bans: [],
        enemyPicks: [], // en orden de pick
        loading: null, // { ally: {rol: campeón}, enemy: {rol: campeón} } confirmado en la carga
        clock: null,
      });
    reset();

    // Las filas del draft van en orden de pick y pueden reordenarse (cambios de orden), así que el
    // rol de cada aliado se recuerda por su nombre de jugador. Se ve en su fila mientras no eligió.
    function takeAllies(rows) {
      const roles = rows.map((r) => {
        if (!r) return null;
        if (r.role && r.player) st.roleOf[r.player] = r.role;
        return r.role || (r.player && st.roleOf[r.player]) || null;
      });
      // Un solo aliado sin rol (ej: el OCR no leyó su nombre) y un solo rol libre: sale por descarte
      const free = ROLE_KEYS.filter((k) => !roles.includes(k));
      const unknown = roles.map((x, i) => (!x && rows[i] ? i : -1)).filter((i) => i >= 0);
      if (free.length === 1 && unknown.length === 1) roles[unknown[0]] = free[0];
      rows.forEach((r, i) => {
        if (!r || !roles[i]) return;
        if (r.champ) st.ally[roles[i]] = r.champ;
        if (r.me) st.myRole = roles[i];
      });
      if (roles.every(Boolean) && new Set(roles).size === 5) st.allyOrder = roles;
    }

    function update(ocr) {
      const r = R.read(ocr, { myName: opts.myName });
      st.screen = r.screen;
      if (r.first) st.first = r.first;
      if (r.allies) takeAllies(r.allies);
      if (r.bans) st.bans = [...new Set([...r.bans.ally, ...r.bans.enemy])];
      if (r.turn) st.turn = r.turn;
      if (r.enemies) for (const k of r.enemies) if (k && !st.enemyPicks.includes(k)) st.enemyPicks.push(k);
      if (r.screen === "game") st.clock = r.seconds;
      return r;
    }

    // Carga: cards = { ally: [5 campeones|null], enemy: [...] } en orden top..soporte.
    // Si falta uno solo de un lado, sale por descarte contra lo que se vio en el draft.
    function applyLoading(cards) {
      const out = { ally: {}, enemy: {} };
      const seen = { ally: Object.values(st.ally), enemy: st.enemyPicks };
      for (const team of ["ally", "enemy"]) {
        const got = cards[team].slice();
        const miss = got.map((k, i) => (k ? -1 : i)).filter((i) => i >= 0);
        const left = seen[team].filter((k) => !got.includes(k));
        if (miss.length === 1 && left.length === 1) got[miss[0]] = left[0];
        ROLE_KEYS.forEach((r, i) => (out[team][r] = got[i] || null));
      }
      st.loading = out;
      return out;
    }

    // Draft en el formato de core.js. Roles rivales: confirmados en la carga o estimados (guessRoles)
    function toDraft(core) {
      const d = core.emptyDraft();
      const L = st.loading;
      for (const r of ROLE_KEYS) d.ally[r] = (L && L.ally[r]) || st.ally[r] || null;
      let enemyGuessed = false;
      if (L && ROLE_KEYS.some((r) => L.enemy[r])) Object.assign(d.enemy, L.enemy);
      else if (st.enemyPicks.length) (d.enemy = core.guessRoles(st.enemyPicks)), (enemyGuessed = true);
      d.bans = st.bans.slice();
      if (st.myRole) d.myRole = st.myRole;
      if (st.first) d.first = st.first;
      if (st.allyOrder.length === 5) d.order.ally = st.allyOrder.slice();
      if (enemyGuessed) {
        // las filas rivales también van en orden de pick: los que ya eligieron, primero
        const picked = ROLE_KEYS.filter((r) => d.enemy[r]).sort((a, b) => st.enemyPicks.indexOf(d.enemy[a]) - st.enemyPicks.indexOf(d.enemy[b]));
        d.order.enemy = [...picked, ...ROLE_KEYS.filter((r) => !d.enemy[r])];
      }
      return { draft: d, enemyGuessed };
    }

    return { update, applyLoading, toDraft, reset, get state() { return st; } };
  }

  root.WRReader = { create, tracker, LOADING_CARDS, ROWS_Y };
})(typeof window !== "undefined" ? window : globalThis);
