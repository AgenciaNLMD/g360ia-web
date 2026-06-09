import React from 'react';
import { Icon, PROCESS, CASES, SERVICES } from './data.jsx';

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

/* WorldMap — delegated to WorldMapGL component */

/* ===================== TOOLS CAROUSEL ===================== */
const TOOLS = [
  {
    name: 'HTML5',
    color: '#e34f26',
    icon: (
      <svg viewBox="0 0 32 32" fill="none"><path d="M4 2l2.4 27L16 31l9.6-2L28 2H4z" fill="#e34f26"/><path d="M16 28.6l7.8-2.16L25.6 8H16v20.6z" fill="#ef652a"/><path d="M16 13.6h4.2l-.3 3.4-3.9.96v3.56l3.9-.96 3.1-.76.56-6.2H16v-3.6h8.56l-.1 1.6-.88 9.56L16 23.6v-3.56l3.9-.96.1-1.4H16v-4.04z" fill="#fff"/><path d="M16 13.6v4.04H12.1l-.1 1.4 3.9.96v3.56l-7.7-2.14-.56-6.2 3.1.76 3.9.96V13.6H16zM16 10H7.44l.1-1.6L16 10z" fill="#ebebeb"/></svg>
    ),
  },
  {
    name: 'CSS3',
    color: '#264de4',
    icon: (
      <svg viewBox="0 0 32 32" fill="none"><path d="M4 2l2.4 27L16 31l9.6-2L28 2H4z" fill="#264de4"/><path d="M16 28.6l7.8-2.16L25.6 8H16v20.6z" fill="#2965f1"/><path d="M16 13.6h4.5l-.15 2.4-4.35 1.2v3.56l4.05-1.12 3.45-.96.4-4.8.1-1.6.3-3.68H16v4.0z" fill="#fff"/><path d="M16 13.6H11.5l.3 3.4 4.2-.84v-2.56zM16 19.8l-.06.02-2.14-.54-.14-1.56H10.1l.26 3.44 5.64 1.56V19.8z" fill="#ebebeb"/></svg>
    ),
  },
  {
    name: 'React',
    color: '#61dafb',
    icon: (
      <svg viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="2.8" fill="#61dafb"/><ellipse cx="16" cy="16" rx="12" ry="4.5" stroke="#61dafb" strokeWidth="1.5" fill="none"/><ellipse cx="16" cy="16" rx="12" ry="4.5" stroke="#61dafb" strokeWidth="1.5" fill="none" transform="rotate(60 16 16)"/><ellipse cx="16" cy="16" rx="12" ry="4.5" stroke="#61dafb" strokeWidth="1.5" fill="none" transform="rotate(120 16 16)"/></svg>
    ),
  },
  {
    name: 'Vite',
    color: '#646cff',
    icon: (
      <svg viewBox="0 0 32 32" fill="none"><path d="M29 5L16.4 27.5l-1.4-2.5L26 5h3z" fill="#646cff"/><path d="M3 5l13 22.5L27.5 5H22l-6 11L10 5H3z" fill="#ffbd44"/></svg>
    ),
  },
  {
    name: 'Google Analytics',
    color: '#f9ab00',
    icon: (
      <svg viewBox="0 0 32 32" fill="none"><rect x="4" y="18" width="6" height="10" rx="3" fill="#f9ab00"/><rect x="13" y="10" width="6" height="18" rx="3" fill="#e37400"/><rect x="22" y="4" width="6" height="24" rx="3" fill="#f9ab00"/></svg>
    ),
  },
  {
    name: 'PageSpeed',
    color: '#4285f4',
    icon: (
      <svg viewBox="0 0 32 32" fill="none"><path d="M16 4a12 12 0 100 24A12 12 0 0016 4z" stroke="#4285f4" strokeWidth="2" fill="none"/><path d="M16 16l-5-8" stroke="#ea4335" strokeWidth="2" strokeLinecap="round"/><circle cx="16" cy="16" r="2" fill="#4285f4"/><path d="M8 20h16" stroke="#34a853" strokeWidth="1.5" strokeLinecap="round"/></svg>
    ),
  },
  {
    name: 'Meta',
    color: '#0082fb',
    icon: (
      <svg viewBox="0 0 32 32" fill="none"><path d="M4 20c0 3.3 1.5 5.5 3.8 5.5 1.8 0 3-1 4.7-3.8l1.7-2.9-2.5-4.3C10.3 12.4 9.3 12 8.5 12 6 12 4 15.5 4 20z" fill="#0082fb"/><path d="M20.5 11.6c-1.6 0-3 .8-4.5 3.2L11 24.2C9.6 26.4 8.5 27.5 6.8 27.5" stroke="#0082fb" strokeWidth="0" fill="none"/><ellipse cx="22" cy="19.5" rx="6" ry="8" fill="none" stroke="#0082fb" strokeWidth="2.5"/><path d="M16 15c1.5-2.4 3-3.4 4.8-3.4 3 0 5.2 3.4 5.2 8.4 0 3.3-1.2 5.5-3.3 5.5-1.3 0-2.2-.8-3.7-3.3l-3-5.2" fill="none"/><path d="M4 19.8C4 15.4 6.2 12 8.7 12c1.6 0 2.8.9 4.3 3.4l7 12.1c1.3 2.2 2.4 3 3.8 3 2.3 0 4.2-2.6 4.2-6.5 0-5-2.2-8.5-5-8.5-1.6 0-2.9 1-4.3 3.3" stroke="#0082fb" strokeWidth="2.5" fill="none" strokeLinecap="round"/></svg>
    ),
  },
  {
    name: 'Facebook',
    color: '#1877f2',
    icon: (
      <svg viewBox="0 0 32 32" fill="none"><path d="M21 10h-3c-.8 0-1 .4-1 1.2V13h4l-.5 4h-3.5v10h-4V17H11v-4h2v-2c0-3.3 2-5 5-5 1.4 0 3 .3 3 .3V10z" fill="#1877f2"/></svg>
    ),
  },
  {
    name: 'Instagram',
    color: '#e4405f',
    icon: (
      <svg viewBox="0 0 32 32" fill="none"><rect x="7" y="7" width="18" height="18" rx="5" stroke="#e4405f" strokeWidth="2" fill="none"/><circle cx="16" cy="16" r="5" stroke="#e4405f" strokeWidth="2" fill="none"/><circle cx="22.5" cy="9.5" r="1.5" fill="#e4405f"/></svg>
    ),
  },
  {
    name: 'WhatsApp',
    color: '#25d366',
    icon: (
      <svg viewBox="0 0 32 32" fill="none"><path d="M16 3C8.8 3 3 8.8 3 16c0 2.5.7 4.8 1.9 6.8L3 29l6.5-1.7C11.2 28.3 13.6 29 16 29c7.2 0 13-5.8 13-13S23.2 3 16 3z" stroke="#25d366" strokeWidth="2" fill="none"/><path d="M22 18.9c-.3-.14-1.8-.9-2.08-.98-.28-.1-.49-.14-.69.14-.2.27-.78.98-.96 1.18-.17.2-.35.22-.65.07a10.2 10.2 0 01-3-1.85c-.83-.8-1.4-1.76-1.56-2.06-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.53.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.14-.7-1.68-.96-2.3-.25-.6-.5-.52-.7-.53h-.6c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.14.2 2.1 3.2 5.08 4.49.7.3 1.25.48 1.68.62.7.22 1.35.19 1.86.12.57-.08 1.76-.72 2-1.42.25-.7.25-1.3.18-1.42-.07-.12-.27-.2-.57-.34z" fill="#25d366"/></svg>
    ),
  },
  {
    name: 'Google Ads',
    color: '#fbbc05',
    icon: (
      <svg viewBox="0 0 32 32" fill="none"><path d="M5 26l9-16" stroke="#fbbc05" strokeWidth="4" strokeLinecap="round"/><path d="M27 26l-9-16" stroke="#4285f4" strokeWidth="4" strokeLinecap="round"/><path d="M5 26h22" stroke="#34a853" strokeWidth="4" strokeLinecap="round"/></svg>
    ),
  },
  {
    name: 'TikTok',
    color: '#fff',
    icon: (
      <svg viewBox="0 0 32 32" fill="none"><path d="M21 6c.3 2 1.7 3.5 3.5 3.7v3.5c-1.3-.1-2.5-.5-3.5-1.2v6.3c0 3.7-3 6.7-6.7 6.7S7.6 22 7.6 18.3 10.6 11.6 14.3 11.6c.4 0 .7 0 1 .1v3.6c-.3-.1-.7-.1-1-.1-1.9 0-3.4 1.5-3.4 3.4s1.5 3.4 3.4 3.4 3.4-1.5 3.4-3.4V6H21z" fill="#fff"/><path d="M21 6c.3 2 1.7 3.5 3.5 3.7" stroke="#fe2c55" strokeWidth="1.2" fill="none"/><path d="M14.3 15.2c-.3-.1-.7-.1-1-.1" stroke="#25f4ee" strokeWidth="1.2" fill="none"/></svg>
    ),
  },
  {
    name: 'LinkedIn',
    color: '#0a66c2',
    icon: (
      <svg viewBox="0 0 32 32" fill="none"><rect x="6" y="12" width="4" height="14" rx="1" fill="#0a66c2"/><circle cx="8" cy="8" r="2.5" fill="#0a66c2"/><path d="M14 12h4v2s1-2 3.5-2c3 0 4.5 2 4.5 5v7h-4v-6.5c0-1.5-.7-2.5-2-2.5s-2 1-2 2.5V24h-4V12z" fill="#0a66c2"/></svg>
    ),
  },
  {
    name: 'VS Code',
    color: '#007acc',
    icon: (
      <svg viewBox="0 0 32 32" fill="none"><path d="M23.5 3l-12 11L5 9l-2 1.5v11L5 23l6.5-5 12 11 3.5-1.5V4.5L23.5 3z" fill="#007acc"/><path d="M23.5 3L11.5 14 5 9l-2 1.5v11L5 23l6.5-5 12 11 3.5-1.5V4.5L23.5 3zM23.5 8.2v15.6l-9-7.8 9-7.8z" fill="#fff" fillOpacity=".3"/><path d="M3 10.5v11L5 23l6.5-5-6.5-5.5L3 10.5z" fill="#fff" fillOpacity=".2"/></svg>
    ),
  },
  {
    name: 'GitHub',
    color: '#fff',
    icon: (
      <svg viewBox="0 0 32 32" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M16 2C8.27 2 2 8.27 2 16c0 6.18 4.01 11.42 9.57 13.27.7.13.96-.3.96-.68v-2.37c-3.89.84-4.71-1.88-4.71-1.88-.63-1.61-1.55-2.04-1.55-2.04-1.27-.87.1-.85.1-.85 1.4.1 2.14 1.44 2.14 1.44 1.25 2.14 3.27 1.52 4.07 1.16.13-.9.49-1.52.89-1.87-3.1-.35-6.37-1.55-6.37-6.9 0-1.52.54-2.77 1.43-3.74-.14-.36-.62-1.77.14-3.69 0 0 1.17-.37 3.83 1.43A13.3 13.3 0 0116 9.2c1.18.01 2.37.16 3.48.47 2.65-1.8 3.82-1.43 3.82-1.43.76 1.92.28 3.33.14 3.69.89.97 1.43 2.22 1.43 3.74 0 5.36-3.27 6.54-6.39 6.89.5.44.95 1.3.95 2.61v3.87c0 .38.25.82.96.68C25.99 27.42 30 22.18 30 16c0-7.73-6.27-14-14-14z" fill="#fff"/></svg>
    ),
  },
  {
    name: 'Node.js',
    color: '#68a063',
    icon: (
      <svg viewBox="0 0 32 32" fill="none"><path d="M16 2L3 9.5v13L16 30l13-7.5V9.5L16 2z" stroke="#68a063" strokeWidth="2" fill="none"/><path d="M16 8c-.6 0-1 .4-1 1v8.5c0 .4.2.7.5.85l7 4a1 1 0 001-1.73L17 16.8V9a1 1 0 00-1-1z" fill="#68a063"/></svg>
    ),
  },
  {
    name: 'MySQL',
    color: '#00758f',
    icon: (
      <svg viewBox="0 0 32 32" fill="none"><ellipse cx="16" cy="8" rx="11" ry="4" fill="#00758f"/><path d="M5 8v5c0 2.2 4.9 4 11 4s11-1.8 11-4V8" stroke="#00758f" strokeWidth="0" fill="#00758f" fillOpacity=".3"/><ellipse cx="16" cy="8" rx="11" ry="4" fill="#00758f"/><path d="M5 8v5c0 2.2 4.9 4 11 4s11-1.8 11-4V8" fill="#00758f" fillOpacity=".5"/><ellipse cx="16" cy="13" rx="11" ry="4" fill="#00758f" fillOpacity=".8"/><path d="M5 13v5c0 2.2 4.9 4 11 4s11-1.8 11-4v-5" fill="#00758f" fillOpacity=".35"/><ellipse cx="16" cy="18" rx="11" ry="4" fill="#00758f"/><path d="M5 18v5c0 2.2 4.9 4 11 4s11-1.8 11-4v-5" fill="#00758f" fillOpacity=".5"/><ellipse cx="16" cy="23" rx="11" ry="4" fill="#00758f" fillOpacity=".9"/><path d="M22 20l4 4-4 4" stroke="#f9a825" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
    ),
  },
  {
    name: 'Nginx',
    color: '#009639',
    icon: (
      <svg viewBox="0 0 32 32" fill="none"><path d="M16 2L3 9v14l13 7 13-7V9L16 2z" stroke="#009639" strokeWidth="2" fill="none"/><path d="M10 22V10l12 12V10" stroke="#009639" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
    ),
  },
  {
    name: 'Java',
    color: '#f89820',
    icon: (
      <svg viewBox="0 0 32 32" fill="none"><path d="M12 22s-1 .6 .7.8c2 .2 3 .2 5.2-.2 0 0 .6.4 1.4.7-5 2.1-11.2-.1-7.3-1.3zM11.3 19s-1.1.8.6 1c2.3.2 4.1.2 7.2-.3 0 0 .4.4 1 .6-6.4 1.9-13.5.2-8.8-1.3z" fill="#5382a1"/><path d="M17.7 13.7c1.3 1.5-.3 2.8-.3 2.8s3.3-1.7 1.8-3.8c-1.4-2-2.5-2.9 3.3-6.3 0 0-9 2.2-4.8 7.3z" fill="#f89820"/><path d="M23.3 24.6s.7.6-.8.1c-2.9-.8-12-.6-14.5 0-1.4.3-.8-.1-.8-.1-2.8 1 4.9 1.5 8.3 1.5 4 0 10-1 7.8-1.5z" fill="#5382a1"/><path d="M12.7 16.1s-4.6 1.1-1.6 1.5c1.2.2 3.7.1 6-.1 1.9-.1 3.8-.4 3.8-.4s-.7.3-1.1.5c-4.7 1.2-13.7.7-11.1-.5 2.2-1 3.5-.9 4-.9z" fill="#5382a1"/><path d="M21 21.4c4.7-2.4 2.5-4.8 1-4.5-.4.1-.6.2-.6.2s.1-.2.4-.3c3-1.1 5.3 3.2-1 4.8 0-.1.1-.2.2-.2z" fill="#f89820"/><path d="M18.5 4S21 6.5 16.1 10.2c-3.9 3.1-.9 4.8 0 6.8-2.3-2-3.9-3.8-2.8-5.5 1.7-2.5 6.3-3.7 5.2-7.5z" fill="#f89820"/><path d="M13.3 28.3c4.5.3 11.4-.2 11.6-2.2 0 0-.3.8-3.7 1.4-3.9.6-8.6.5-11.4.1 0 0 .6.5 3.5.7z" fill="#5382a1"/></svg>
    ),
  },
  {
    name: 'Anthropic',
    color: '#d97757',
    icon: (
      <svg viewBox="0 0 32 32" fill="none"><path d="M18.8 6h-3.8L8 26h3.8l1.6-4.4h5.2L20.2 26H24L18.8 6zm-4.4 12.4L16 11.2l1.6 7.2h-3.2z" fill="#d97757"/></svg>
    ),
  },
  {
    name: 'Claude',
    color: '#d97757',
    icon: (
      <svg viewBox="0 0 32 32" fill="none"><path d="M18.8 9h-3.8L8 23h3.8l1.4-3.8h4.8L19.4 23H23L18.8 9zm-3.8 7.8L16.4 13l1.4 3.8h-2.8z" fill="#d97757"/></svg>
    ),
  },
  {
    name: 'Gemini',
    color: '#8ab4f8',
    icon: (
      <svg viewBox="0 0 32 32" fill="none"><defs><linearGradient id="gem" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#4285f4"/><stop offset="50%" stopColor="#9b72cb"/><stop offset="100%" stopColor="#d96570"/></linearGradient></defs><path d="M16 3C16 3 16 13 9 16C16 19 16 29 16 29C16 29 16 19 23 16C16 13 16 3 16 3Z" fill="url(#gem)"/></svg>
    ),
  },
];

function ToolsCarousel() {
  const row1 = [...TOOLS, ...TOOLS];
  const row2 = [...TOOLS, ...TOOLS];
  return (
    <div className="ft-tools">
      <p className="ft-tools-label">Tecnologías y plataformas que usamos</p>

      <div className="ft-track-wrap">
        <div className="ft-track ft-track--ltr">
          {row1.map((t, i) => (
            <div key={i} className="ft-tool-item">
              <div className="ft-tool-icon">{t.icon}</div>
              <span className="ft-tool-name">{t.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="ft-track-wrap">
        <div className="ft-track ft-track--rtl">
          {row2.map((t, i) => (
            <div key={i} className="ft-tool-item">
              <div className="ft-tool-icon">{t.icon}</div>
              <span className="ft-tool-name">{t.name}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

/* ===================== FOOTER ===================== */
function Footer({ onNav }) {
  const year = new Date().getFullYear();
  const go = (e, id) => { e.preventDefault(); onNav(id); };
  return (
    <footer className="footer">
      <ToolsCarousel />
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
                  <a href={s.page || '#'}>{s.tag}</a>
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
              <li><a href="https://instagram.com/g360ia" target="_blank" rel="noopener">Instagram</a></li>
              <li><a href="https://www.linkedin.com/company/g360ia" target="_blank" rel="noopener">LinkedIn</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {year} Gestion360ia · Todos los derechos reservados</span>
          <span><a href="/legal/aviso-legal.html" style={{marginRight: 16}}>Aviso legal</a><a href="/legal/privacidad.html">Política de privacidad</a></span>
        </div>
      </div>
    </footer>
  );
}

export { Process, Cases, Footer };
