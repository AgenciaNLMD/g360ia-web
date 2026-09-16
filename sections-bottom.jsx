import React from 'react';
import { PROCESS, CASES, SERVICES } from './data.jsx';

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

/* ===================== FOOTER ===================== */
function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <a href="/" className="logo">
              <img src="logo.webp" alt="Gestión 360 IA" className="logo-img" width="36" height="36" loading="lazy" />
              <span className="logo-name">
                Gestion<span className="num">360</span><span className="ia">.iA</span>
              </span>
            </a>
            <p className="footer-tag">Consultora de IA. Ayudamos a empresas a crecer con automatización, datos y producto.</p>
          </div>
          <div>
            <h5>Navegación</h5>
            <ul>
              <li><a href="/servicios">Servicios</a></li>
              <li><a href="/software">Software propio</a></li>
              <li><a href="/afiliados">Programa de afiliados</a></li>
              <li><a href="/developers">Developers</a></li>
              <li><a href="/blog/">Blog</a></li>
            </ul>
          </div>
          <div>
            <h5>Softwares 360iA</h5>
            <ul>
              <li>
                <a href="https://vet.g360ia.com.ar" target="_blank" rel="noopener">
                  Vet 360iA · Veterinarias
                </a>
              </li>
              <li><a href="/software">Ver el catálogo</a></li>
              <li><a href="/afiliados">Vendelos y ganá comisión</a></li>
              <li><a href="/developers">Publicá tu software</a></li>
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
          <span><a href="/legal/aviso-legal" style={{marginRight: 16}}>Aviso legal</a><a href="/legal/privacidad">Política de privacidad</a></span>
        </div>
      </div>
    </footer>
  );
}

export { Process, Cases, Footer };
