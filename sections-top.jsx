/* global React, Icon, SERVICES */
const { useState: useStateH, useEffect: useEffectH, useRef: useRefH } = React;

/* ===================== HEADER ===================== */
function Header({ active, onNav }) {
  const [scrolled, setScrolled] = useStateH(false);
  const [menuOpen, setMenuOpen] = useStateH(false);

  useEffectH(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const items = [
    { id: "servicios", label: "Servicios" },
    { id: "proceso",   label: "Proceso" },
    { id: "casos",     label: "Casos" },
    { id: "contacto",  label: "Contacto" },
  ];

  const go = (e, id) => {
    e.preventDefault();
    setMenuOpen(false);
    onNav(id);
  };

  return (
    <React.Fragment>
      <header className={`header ${scrolled ? "scrolled" : ""}`}>
        <div className="container header-inner">
          <a href="#hero" className="logo" onClick={(e) => go(e, "hero")}>
            <img src="logo.png" alt="Gestion360.iA" className="logo-img" />
            <span className="logo-name">
              Gestion<span className="num">360</span><span className="ia">.iA</span>
            </span>
          </a>
          <nav className="nav" aria-label="Principal">
            {items.map(it => (
              <a key={it.id} href={`#${it.id}`}
                 className={active === it.id ? "is-active" : ""}
                 onClick={(e) => go(e, it.id)}>{it.label}</a>
            ))}
          </nav>
          <div className="header-cta">
            <button className="btn btn-primary btn-sm" onClick={(e) => go(e, "contacto")}>
              Agendar reunión
              <span className="arrow"><Icon.arrow /></span>
            </button>
            <button className="menu-btn" aria-label="Menú" onClick={() => setMenuOpen(o => !o)}>
              <Icon.menu />
            </button>
          </div>
        </div>
      </header>

      <div className={`mobile-menu ${menuOpen ? "is-open" : ""}`}>
        {items.map(it => (
          <a key={it.id} href={`#${it.id}`} onClick={(e) => go(e, it.id)}>{it.label}</a>
        ))}
        <button className="btn btn-primary" style={{marginTop: 12}} onClick={(e) => go(e, "contacto")}>
          Agendar reunión <span className="arrow"><Icon.arrow /></span>
        </button>
      </div>
    </React.Fragment>
  );
}

/* ===================== HERO VISUAL ===================== */
function HeroVisual() {
  return (
    <div className="hero-stage">
      <svg viewBox="0 0 500 600" width="100%" height="100%" style={{position: "absolute", inset: 0, overflow: "visible"}}>
        <defs>
          <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9"/>
            <stop offset="100%" stopColor="#ece6d6" stopOpacity="0.5"/>
          </linearGradient>
          <linearGradient id="cardA" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff"/>
            <stop offset="100%" stopColor="#faf9f6"/>
          </linearGradient>
          <linearGradient id="darkCard" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3a485e"/>
            <stop offset="100%" stopColor="#1f2937"/>
          </linearGradient>
          <pattern id="dots" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="#4a5a75" opacity="0.18"/>
          </pattern>
        </defs>

        {/* Soft backdrop */}
        <rect x="40" y="40" width="420" height="520" rx="28" fill="url(#bgGrad)" opacity="0.5"/>
        <rect x="40" y="40" width="420" height="520" rx="28" fill="url(#dots)"/>

        {/* Dark card — assistant conversation */}
        <g transform="translate(60 80)" style={{animation: "drift 8s ease-in-out infinite"}}>
          <rect width="280" height="200" rx="20" fill="url(#darkCard)"/>
          <rect width="280" height="200" rx="20" fill="none" stroke="rgba(255,255,255,0.06)"/>

          <g transform="translate(20 22)">
            <circle r="4" cx="0" cy="0" fill="#c8b896"/>
            <text x="12" y="4" fill="#c8b896" fontSize="10" fontFamily="JetBrains Mono, monospace" letterSpacing="1.5">ASISTENTE · EN LÍNEA</text>
          </g>

          {/* Chat bubbles */}
          <g transform="translate(20 60)">
            <rect width="180" height="34" rx="14" fill="rgba(255,255,255,0.07)"/>
            <text x="14" y="22" fill="#ece6d6" fontSize="11" fontFamily="Plus Jakarta Sans">¿Hay stock del modelo X-200?</text>
          </g>
          <g transform="translate(80 102)">
            <rect width="180" height="34" rx="14" fill="#c8b896"/>
            <text x="14" y="22" fill="#1f2937" fontSize="11" fontFamily="Plus Jakarta Sans" fontWeight="600">Sí, 12 unidades en CABA.</text>
          </g>
          <g transform="translate(80 142)">
            <rect width="200" height="34" rx="14" fill="#c8b896"/>
            <text x="14" y="22" fill="#1f2937" fontSize="11" fontFamily="Plus Jakarta Sans" fontWeight="600">¿Coordinamos el envío?</text>
          </g>
          <g transform="translate(20 184)">
            <circle r="2" cx="0" cy="0" fill="#c8b896">
              <animate attributeName="opacity" values="0.3;1;0.3" dur="1.4s" repeatCount="indefinite" begin="0s"/>
            </circle>
            <circle r="2" cx="8" cy="0" fill="#c8b896">
              <animate attributeName="opacity" values="0.3;1;0.3" dur="1.4s" repeatCount="indefinite" begin="0.2s"/>
            </circle>
            <circle r="2" cx="16" cy="0" fill="#c8b896">
              <animate attributeName="opacity" values="0.3;1;0.3" dur="1.4s" repeatCount="indefinite" begin="0.4s"/>
            </circle>
            <text x="28" y="4" fontFamily="Plus Jakarta Sans" fontSize="10" fill="rgba(236,230,214,0.6)">cliente escribiendo</text>
          </g>
        </g>

        {/* Metric card */}
        <g transform="translate(250 250)" style={{animation: "drift 10s ease-in-out infinite", animationDelay: "-2s"}}>
          <rect width="200" height="140" rx="18" fill="url(#cardA)" stroke="#d9dee6"/>
          <text x="20" y="34" fontFamily="JetBrains Mono, monospace" fontSize="9.5" fill="#8a93a4" letterSpacing="1.2">CONVERSIÓN · 30D</text>
          <text x="20" y="76" fontFamily="Plus Jakarta Sans" fontSize="38" fontWeight="600" fill="#3a485e" letterSpacing="-1.5">+34<tspan fontSize="22" fill="#8a93a4">%</tspan></text>

          {/* mini sparkline */}
          <polyline
            points="20,114 50,108 80,112 110,98 140,102 170,86 180,88"
            fill="none" stroke="#4a5a75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          />
          <polyline
            points="20,114 50,108 80,112 110,98 140,102 170,86 180,88 180,128 20,128"
            fill="#4a5a75" opacity="0.08"
          />
          <circle cx="180" cy="88" r="3" fill="#3a485e"/>
        </g>

        {/* Workflow / nodes card */}
        <g transform="translate(60 320)" style={{animation: "drift 9s ease-in-out infinite", animationDelay: "-4s"}}>
          <rect width="220" height="170" rx="18" fill="url(#cardA)" stroke="#d9dee6"/>
          <text x="20" y="32" fontFamily="JetBrains Mono, monospace" fontSize="9.5" fill="#8a93a4" letterSpacing="1.2">FLUJO ACTIVO</text>

          <g transform="translate(20 56)">
            {/* Nodes */}
            <circle cx="14" cy="14" r="14" fill="#f6f3ec" stroke="#d9dee6"/>
            <text x="14" y="18" textAnchor="middle" fontFamily="Plus Jakarta Sans" fontSize="11" fill="#4a5a75" fontWeight="600">1</text>

            <line x1="32" y1="14" x2="76" y2="14" stroke="#b6c0cf" strokeWidth="1.5" strokeDasharray="3 3"/>

            <circle cx="90" cy="14" r="14" fill="#4a5a75"/>
            <text x="90" y="18" textAnchor="middle" fontFamily="Plus Jakarta Sans" fontSize="11" fill="#fff" fontWeight="600">2</text>

            <line x1="108" y1="14" x2="152" y2="14" stroke="#b6c0cf" strokeWidth="1.5" strokeDasharray="3 3"/>

            <circle cx="166" cy="14" r="14" fill="#f6f3ec" stroke="#d9dee6"/>
            <text x="166" y="18" textAnchor="middle" fontFamily="Plus Jakarta Sans" fontSize="11" fill="#8a93a4" fontWeight="600">3</text>

            <text x="14" y="50" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="8" fill="#8a93a4">RECIBO</text>
            <text x="90" y="50" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="8" fill="#4a5a75">PROCESO</text>
            <text x="166" y="50" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="8" fill="#8a93a4">RESPONDO</text>
          </g>

          <g transform="translate(20 138)">
            <rect width="180" height="20" rx="10" fill="#f5f6f8"/>
            <rect width="120" height="20" rx="10" fill="#4a5a75"/>
            <text x="90" y="14" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="#fff">67% completado</text>
          </g>
        </g>

        {/* Floating tag */}
        <g transform="translate(320 60)">
          <rect width="120" height="36" rx="18" fill="#ffffff" stroke="#d9dee6"/>
          <circle cx="18" cy="18" r="4" fill="#5d6e88">
            <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite"/>
          </circle>
          <text x="32" y="22" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="#4a5a75" letterSpacing="0.5">IA · activa</text>
        </g>
      </svg>
    </div>
  );
}

/* ===================== HERO ===================== */
function Hero({ onNav }) {
  return (
    <section id="hero" className="hero hero-grain">
      <div className="hero-bg"></div>
      <div className="container">
        <div className="hero-inner">
          <span className="eyebrow reveal">Consultora de IA · Gestion360ia</span>
          <h1 className="h-display h1 reveal" style={{"--delay": "60ms"}}>
            Transformamos tu negocio con <em>Inteligencia Artificial</em>.
          </h1>
          <p className="lead reveal" style={{"--delay": "180ms"}}>
            Consultoría, desarrollo y automatización con IA para empresas que quieren crecer
            más rápido, vender más y operar mejor. Diseñamos soluciones a medida que se integran
            con tu operación actual.
          </p>

          <div className="hero-ctas reveal" style={{"--delay": "280ms"}}>
            <button className="btn btn-primary" onClick={() => onNav("contacto")}>
              Agendar diagnóstico gratuito <span className="arrow"><Icon.arrow /></span>
            </button>
            <button className="btn btn-ghost" onClick={() => onNav("servicios")}>
              Ver servicios <span className="arrow"><Icon.arrowDown /></span>
            </button>
          </div>

          <div className="trust-bar reveal" style={{"--delay": "380ms"}}>
            <span className="trust-label">+24 empresas confían en nosotros</span>
            <div className="trust-logos">
              <span className="trust-logo">◆ Norte Capital</span>
              <span className="trust-logo">⌬ Lumen</span>
              <span className="trust-logo">▲ Studio Verde</span>
              <span className="trust-logo">◉ Pampa Foods</span>
              <span className="trust-logo">⬡ Astra</span>
            </div>
          </div>

          <div className="hero-cue reveal" style={{"--delay": "500ms"}}>
            <span>Conocenos</span>
            <span className="line"></span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ===================== SERVICES ===================== */
function ServiceCard({ s, onOpen }) {
  const IconComp = Icon[s.icon];
  return (
    <article className="svc-card reveal" onClick={() => onOpen(s)} tabIndex="0"
             onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onOpen(s)}>
      <span className="svc-icon" aria-hidden="true"><IconComp /></span>
      <span className="tag">{s.tag}</span>
      <h3>{s.name}</h3>
      <p>{s.desc}</p>
      <span className="svc-more">
        <span className="dot"></span>
        Ver más
        <Icon.arrow style={{marginLeft: 4}}/>
      </span>
    </article>
  );
}

function Services({ onOpen }) {
  return (
    <section id="servicios" className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow reveal">Servicios</span>
            <h2 className="h-display h2 reveal" style={{"--delay": "60ms"}}>
              Todo lo que tu negocio necesita,<br/>
              <em>en un solo lugar.</em>
            </h2>
          </div>
          <p className="lead reveal" style={{"--delay": "140ms"}}>
            Combinamos estrategia, tecnología e IA para ofrecerte un ecosistema completo
            de servicios digitales. Cada solución se integra con la siguiente.
          </p>
        </div>

        <div className="services-grid">
          {SERVICES.map((s, i) => (
            <div key={s.id} className="reveal" style={{"--delay": `${60 + i * 40}ms`}}>
              <ServiceCard s={s} onOpen={onOpen} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===================== SERVICE MODAL ===================== */
function ServiceModal({ service, onClose, onContact }) {
  useEffectH(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    if (service) document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [service, onClose]);

  const IconComp = service ? Icon[service.icon] : null;

  return (
    <div className={`modal-overlay ${service ? "is-open" : ""}`} onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{position: "relative"}}>
        <button className="modal-close" onClick={onClose} aria-label="Cerrar">
          <Icon.close/>
        </button>
        {service && (
          <React.Fragment>
            <div style={{display: "flex", alignItems: "center", gap: 14, marginBottom: 18}}>
              <span className="svc-icon" style={{margin: 0}}><IconComp /></span>
              <span className="tag">{service.tag}</span>
            </div>
            <h3>{service.name}</h3>
            <p style={{margin: "6px 0 0", color: "var(--slate-600)", fontSize: 15, fontStyle: "italic"}}>
              {service.tagline}
            </p>
            <p style={{marginTop: 22, color: "var(--ink-soft)", fontSize: 15.5, lineHeight: 1.6}}>
              {service.desc}
            </p>

            <div style={{marginTop: 28}}>
              <span className="tag" style={{display: "block", marginBottom: 12}}>Qué incluye</span>
              <ul className="modal-list">
                {service.includes.map((it, i) => (
                  <li key={i}>
                    <span className="check"><Icon.check/></span>
                    {it}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{display: "flex", gap: 10, marginTop: 28, flexWrap: "wrap"}}>
              <button className="btn btn-primary" onClick={() => { onClose(); onContact(service.id); }}>
                Quiero este servicio <Icon.arrow/>
              </button>
              <button className="btn btn-ghost" onClick={onClose}>Volver</button>
            </div>
          </React.Fragment>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { Header, Hero, Services, ServiceModal });
