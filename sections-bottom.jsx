import React, { useState as useStateB, useEffect as useEffectB } from 'react';
import { Icon, PROCESS, CASES, CLIENT_LOGOS, SERVICES } from './data.jsx';

/* ===================== PROCESS ===================== */
function Process() {
  return (
    <section id="proceso" className="section" style={{padding: "60px 0"}}>
      <div className="process">
        <div className="container" style={{padding: "96px 64px"}}>
          <div className="section-head" style={{marginBottom: 0}}>
            <div>
              <span className="eyebrow reveal">Proceso</span>
              <h2 className="h-display h2 reveal" style={{"--delay": "60ms"}}>
                Cómo trabajamos
              </h2>
            </div>
            <p className="lead reveal" style={{"--delay": "140ms"}}>
              Un método claro, sin sorpresas, pensado para que veas resultados desde la primera etapa.
            </p>
          </div>

          <div className="steps reveal" style={{"--delay": "180ms"}}>
            {PROCESS.map((p, i) => (
              <div key={p.num} className="step">
                <div className="step-num">
                  <span>{p.num} / 04</span>
                  <span className="arrow-r"></span>
                </div>
                <h3>{p.name}</h3>
                <p>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ===================== CASES ===================== */
function Cases() {
  return (
    <section id="casos" className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow reveal">Casos</span>
            <h2 className="h-display h2 reveal" style={{"--delay": "60ms"}}>
              Empresas que ya están <em>creciendo</em><br/> con nosotros
            </h2>
          </div>
          <p className="lead reveal" style={{"--delay": "140ms"}}>
            Resultados medibles en empresas reales. Cada proyecto empieza con un diagnóstico
            sin costo para entender qué tiene sentido implementar primero.
          </p>
        </div>

        <div className="cases-grid">
          {CASES.map((c, i) => (
            <article key={c.name} className="case-card reveal" style={{"--delay": `${80 + i * 80}ms`}}>
              <div className="case-metric">
                {c.metric}<span className="unit">{c.unit}</span>
              </div>
              <div className="case-metric-label">{c.label}</div>
              <p className="case-quote">"{c.quote}"</p>
              <div className="case-author">
                <div className="avatar">{c.initials}</div>
                <div>
                  <div className="name">{c.name}</div>
                  <div className="role">{c.role}</div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===================== WORLD MAP ===================== */
function WorldMap() {
  const OX = 252, OY = 290; /* Argentina */

  const dests = [
    { id:'wm1', x:220,  y:108, dur:'6s',   delay:'0s'   }, /* Nueva York  */
    { id:'wm2', x:396,  y:86,  dur:'8.5s', delay:'1.3s' }, /* Londres     */
    { id:'wm3', x:387,  y:108, dur:'7.5s', delay:'2.2s' }, /* Madrid      */
    { id:'wm4', x:183,  y:158, dur:'5s',   delay:'0.7s' }, /* México      */
    { id:'wm5', x:714,  y:118, dur:'12s',  delay:'3.1s' }, /* Tokio       */
    { id:'wm6', x:527,  y:140, dur:'9s',   delay:'1.9s' }, /* Dubai       */
    { id:'wm7', x:736,  y:272, dur:'10.5s',delay:'2.7s' }, /* Sídney      */
  ];

  const arc = ([x, y]) => {
    const dx = x - OX, dy = y - OY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const elev = Math.min(dist * 0.30, 165);
    return `M ${OX},${OY} Q ${OX + dx / 2},${OY + dy / 2 - elev} ${x},${y}`;
  };

  const GY = [70, 140, 210, 280, 350];
  const GX = [67, 133, 200, 267, 333, 400, 467, 533, 600, 667, 733];

  return (
    <svg viewBox="0 0 800 420" className="wmap" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
      <defs>
        <radialGradient id="wmHalo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#e6a532" stopOpacity="0.55"/>
          <stop offset="100%" stopColor="#e6a532" stopOpacity="0"/>
        </radialGradient>
        <filter id="wmGlow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="2.5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="wmNodeGlow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="1.8" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Lat/lon grid */}
      {GY.map(y => (
        <line key={'gy'+y} x1="0" y1={y} x2="800" y2={y}
          stroke={y===210 ? "rgba(126,200,227,0.20)" : "rgba(126,200,227,0.06)"}
          strokeWidth={y===210 ? 0.9 : 0.5}
          strokeDasharray={y===210 ? "5,9" : undefined}/>
      ))}
      {GX.map(x => (
        <line key={'gx'+x} x1={x} y1="0" x2={x} y2="420"
          stroke="rgba(126,200,227,0.06)" strokeWidth="0.5"/>
      ))}

      {/* Continents */}
      <path className="wm-cont" d="M 88,72 L 125,52 L 162,48 L 210,62 L 245,88 L 248,115 L 232,142 L 208,162 L 188,178 L 160,186 L 130,184 L 108,170 L 95,148 L 80,124 L 78,100 Z"/>
      <path className="wm-cont" d="M 178,178 L 210,168 L 242,172 L 262,192 L 268,222 L 264,255 L 250,284 L 232,308 L 215,320 L 198,308 L 186,282 L 180,255 L 178,225 Z"/>
      <path className="wm-cont" d="M 352,58 L 382,50 L 408,50 L 432,58 L 448,72 L 445,90 L 428,98 L 408,102 L 390,108 L 375,100 L 360,90 L 350,74 Z"/>
      <path className="wm-cont" d="M 358,115 L 395,100 L 428,100 L 458,108 L 478,128 L 480,158 L 472,190 L 455,218 L 436,240 L 412,252 L 390,248 L 370,228 L 355,198 L 350,165 L 354,135 Z"/>
      <path className="wm-cont" d="M 448,72 L 485,62 L 535,50 L 592,48 L 648,54 L 698,68 L 722,85 L 725,110 L 710,130 L 668,142 L 625,150 L 588,158 L 555,152 L 518,140 L 490,122 L 468,105 Z"/>
      <path className="wm-cont" d="M 658,238 L 695,228 L 735,235 L 758,260 L 752,292 L 726,304 L 695,296 L 668,280 L 656,260 Z"/>

      {/* Arc paths */}
      {dests.map(d => (
        <path key={d.id} id={d.id} className="wm-arc" d={arc([d.x,d.y])}
          pathLength="1" style={{animationDelay: d.delay}}/>
      ))}

      {/* Traveling dots */}
      {dests.map(d => (
        <circle key={'td'+d.id} r="3.5" className="wm-traveler" filter="url(#wmGlow)">
          <animateMotion dur={d.dur} repeatCount="indefinite"
            keyPoints="0;1;0" keyTimes="0;0.5;1" calcMode="linear">
            <mpath href={'#'+d.id}/>
          </animateMotion>
        </circle>
      ))}

      {/* Destination nodes */}
      {dests.map(d => (
        <circle key={'dn'+d.id} cx={d.x} cy={d.y} r="3"
          className="wm-dest" filter="url(#wmNodeGlow)"
          style={{animationDelay: d.delay}}/>
      ))}

      {/* Argentina origin */}
      <circle cx={OX} cy={OY} r="26" fill="url(#wmHalo)"/>
      <circle cx={OX} cy={OY} r="8"  className="wm-origin-ring"/>
      <circle cx={OX} cy={OY} r="3.5" fill="#e6a532"/>
      <text x={OX+14} y={OY-8} className="wm-label">Buenos Aires</text>
    </svg>
  );
}

/* ===================== CONTACT ===================== */
function Contact({ presetService, onClearPreset }) {
  const [form, setForm] = useStateB({ name:"", email:"", company:"", phone:"", message:"" });
  const [picked, setPicked]   = useStateB(new Set());
  const [errors, setErrors]   = useStateB({});
  const [sent, setSent]       = useStateB(false);
  const [active, setActive]   = useStateB('form'); /* 'form' | 'map' */

  useEffectB(() => {
    if (presetService) {
      setPicked(prev => { const n = new Set(prev); n.add(presetService); return n; });
      onClearPreset && onClearPreset();
    }
  }, [presetService]);

  const togglePick = id => setPicked(prev => {
    const n = new Set(prev);
    n.has(id) ? n.delete(id) : n.add(id);
    return n;
  });

  const update = key => e => {
    setForm(f => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors(er => ({ ...er, [key]: null }));
  };

  const submit = e => {
    e.preventDefault();
    const er = {};
    if (!form.name.trim()) er.name = true;
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) er.email = true;
    if (!form.message.trim()) er.message = true;
    setErrors(er);
    if (Object.keys(er).length) return;
    setSent(true);
  };

  const errStyle = ok => ok ? {} : { borderColor:"#c87158" };

  return (
    <section id="contacto" className="contact-split">

      {/* ── Left half: Form ── */}
      <div
        className={`cs-half cs-half--form${active==='form' ? ' is-clear' : ''}`}
        onMouseEnter={() => setActive('form')}
      >
        <div className="cs-frost"/>
        <div className="cs-content">

          <span className="eyebrow">Contacto</span>
          <h2 className="cs-heading">Hablemos de <em>tu proyecto</em></h2>
          <p className="cs-lead">Contanos qué necesitás y te respondemos en menos de 24hs.</p>

          <form className={`form cs-form${sent ? ' is-sent' : ''}`} onSubmit={submit} noValidate>
            <div className="form-inner">
              <div className="form-row">
                <div className="field">
                  <label>Nombre</label>
                  <input type="text" placeholder="Tu nombre"
                    value={form.name} onChange={update("name")} style={errStyle(!errors.name)}/>
                </div>
                <div className="field">
                  <label>Email</label>
                  <input type="email" placeholder="vos@empresa.com"
                    value={form.email} onChange={update("email")} style={errStyle(!errors.email)}/>
                </div>
              </div>
              <div className="form-row">
                <div className="field">
                  <label>Empresa</label>
                  <input type="text" placeholder="Nombre de tu empresa"
                    value={form.company} onChange={update("company")}/>
                </div>
                <div className="field">
                  <label>Teléfono / WhatsApp</label>
                  <input type="tel" placeholder="+54 9 11..."
                    value={form.phone} onChange={update("phone")}/>
                </div>
              </div>

              <div className="field">
                <label>Servicios de interés</label>
                <div className="services-pick">
                  {SERVICES.map(s => (
                    <button type="button" key={s.id}
                      className={`pill${picked.has(s.id) ? ' is-on' : ''}`}
                      onClick={() => togglePick(s.id)}>
                      {picked.has(s.id) && <Icon.check/>}
                      {s.name.replace(" con alta y alojamiento","")}
                    </button>
                  ))}
                </div>
              </div>

              <div className="field">
                <label>Contanos sobre tu proyecto</label>
                <textarea rows="3" placeholder="¿Qué problema querés resolver?"
                  value={form.message} onChange={update("message")}
                  style={errStyle(!errors.message)}/>
              </div>

              <div className="form-foot">
                <span className="form-note">Respondemos en menos de 24hs hábiles.</span>
                <button type="submit" className="btn btn-primary">
                  Enviar consulta <Icon.arrow/>
                </button>
              </div>
            </div>

            <div className="form-sent">
              <div className="check-circle">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12l5 5L20 7"/>
                </svg>
              </div>
              <h4>Listo, {form.name.split(" ")[0] || "gracias"}.</h4>
              <p>Recibimos tu consulta y te respondemos antes de 24hs hábiles.</p>
            </div>
          </form>

        </div>
      </div>

      {/* ── Right half: Map ── */}
      <div
        className={`cs-half cs-half--map${active==='map' ? ' is-clear' : ''}`}
        onMouseEnter={() => setActive('map')}
      >
        <div className="cs-frost"/>
        <div className="cs-content cs-content--map">
          <p className="wm-tagline">Trabajamos con toda LATAM y el mundo</p>
          <WorldMap/>
        </div>

        {/* Social sidebar */}
        <nav className="cs-social" aria-label="Redes sociales">
          <a href="https://instagram.com" target="_blank" rel="noopener" aria-label="Instagram">
            <Icon.ig/>
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener" aria-label="LinkedIn">
            <Icon.li/>
          </a>
          <a href="mailto:consultora@g360ia.com.ar" aria-label="Email">
            <Icon.mail/>
          </a>
          <a href="https://wa.me/5491125526561" target="_blank" rel="noopener" aria-label="WhatsApp">
            <Icon.whatsapp/>
          </a>
        </nav>
      </div>

    </section>
  );
}

/* ===================== FOOTER ===================== */
function Footer({ onNav }) {
  const year = 2025;
  const go = (e, id) => { e.preventDefault(); onNav(id); };
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <a href="#hero" className="logo" onClick={(e) => go(e, "hero")}>
              <img src="logo.png" alt="Gestión 360 IA" className="logo-img" />
              <span className="logo-name">
                Gestion<span className="num">360</span><span className="ia">.iA</span>
              </span>
            </a>
            <p className="footer-tag">Consultora de IA. Ayudamos a empresas a crecer con automatización, datos y producto.</p>
          </div>
          <div>
            <h5>Navegación</h5>
            <ul>
              <li><a href="#servicios" onClick={(e) => go(e, "servicios")}>Servicios</a></li>
            </ul>
          </div>
          <div>
            <h5>Servicios</h5>
            <ul>
              {SERVICES.map(s => (
                <li key={s.id}>
                  <a href={s.page || '#'}>{s.name}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h5>Contacto</h5>
            <ul>
              <li><a href="mailto:consultora@g360ia.com.ar">consultora@g360ia.com.ar</a></li>
              <li><a href="https://wa.me/5491125526561">+54 9 11 2552-6561</a></li>
              <li><a href="#">Buenos Aires, AR</a></li>
            </ul>
          </div>
          <div>
            <h5>Seguinos</h5>
            <ul>
              <li><a href="#">Instagram</a></li>
              <li><a href="#">LinkedIn</a></li>
              <li><a href="#">X / Twitter</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {year} Gestion360ia · Todos los derechos reservados</span>
          <span><a href="/legal/aviso-legal" style={{marginRight: 16}}>Aviso legal</a><a href="/legal/privacidad">Política de privacidad</a></span>
        </div>
      </div>
    </footer>
  );
}

export { Process, Cases, Contact, Footer };
