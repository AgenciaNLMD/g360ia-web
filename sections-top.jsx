/* global React, Icon, SERVICES */
const { useState: useStateH, useEffect: useEffectH, useRef: useRefH } = React;

/* ===================== HEADER ===================== */
function Header({ active, onNav }) {
  const [scrolled, setScrolled] = useStateH(false);
  const [menuOpen, setMenuOpen] = useStateH(false);
  const [svcDropOpen, setSvcDropOpen] = useStateH(false);
  const svcDropRef = useRefH(null);

  useEffectH(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffectH(() => {
    const handler = (e) => {
      if (svcDropRef.current && !svcDropRef.current.contains(e.target)) {
        setSvcDropOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
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
    setSvcDropOpen(false);
    onNav(id);
  };

  return (
    <React.Fragment>
      <header className={`header ${scrolled ? "scrolled" : ""}`}>
        <div className="container header-inner">
          <a href="#hero" className="logo" onClick={(e) => go(e, "hero")}>
            <img src="logo.png" alt="Gestión 360 IA" className="logo-img" />
            <span className="logo-name">
              Gestion<span className="num">360</span><span className="ia">.iA</span>
            </span>
          </a>
          <nav className="nav" aria-label="Principal">
            {items.map(it => {
              if (it.id === "servicios") return (
                <div key="servicios" className="nav-drop-wrap" ref={svcDropRef}>
                  <button
                    className={`nav-drop-btn ${active === "servicios" ? "is-active" : ""} ${svcDropOpen ? "is-open" : ""}`}
                    onClick={() => setSvcDropOpen(o => !o)}
                  >
                    Servicios
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="nav-drop-chevron"><path d="M6 9l6 6 6-6"/></svg>
                  </button>
                  <div className={`nav-drop-panel ${svcDropOpen ? "is-open" : ""}`}>
                    <a href="#servicios" className="nav-drop-item" onClick={(e) => go(e, "servicios")}>
                      Ver todos los servicios
                    </a>
                    <div className="nav-drop-sep"/>
                    <a href="/servicios/agentes-ia" className="nav-drop-item nav-drop-item--page">
                      <span>Agentes IA</span>
                      <span className="nav-drop-tag">Ver página</span>
                    </a>
                    <a href="/servicios/bots-whatsapp" className="nav-drop-item nav-drop-item--page">
                      <span>Bots WhatsApp</span>
                      <span className="nav-drop-tag">Ver página</span>
                    </a>
                    <a href="/servicios/sitios-web" className="nav-drop-item nav-drop-item--page">
                      <span>Sitios web</span>
                      <span className="nav-drop-tag">Ver página</span>
                    </a>
                    <a href="/servicios/desarrollo-software" className="nav-drop-item nav-drop-item--page">
                      <span>Desarrollo de software</span>
                      <span className="nav-drop-tag">Ver página</span>
                    </a>
                    <a href="/servicios/seo" className="nav-drop-item nav-drop-item--page">
                      <span>SEO</span>
                      <span className="nav-drop-tag">Ver página</span>
                    </a>
                  </div>
                </div>
              );
              return (
                <a key={it.id} href={`#${it.id}`}
                   className={active === it.id ? "is-active" : ""}
                   onClick={(e) => go(e, it.id)}>{it.label}</a>
              );
            })}
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
          <React.Fragment key={it.id}>
            <a href={`#${it.id}`} onClick={(e) => go(e, it.id)}>{it.label}</a>
            {it.id === "servicios" && (
              <React.Fragment>
                <a href="/servicios/agentes-ia" className="mobile-menu-subitem">↳ Agentes IA</a>
                <a href="/servicios/bots-whatsapp" className="mobile-menu-subitem">↳ Bots WhatsApp</a>
                <a href="/servicios/sitios-web" className="mobile-menu-subitem">↳ Sitios web</a>
                <a href="/servicios/desarrollo-software" className="mobile-menu-subitem">↳ Desarrollo de software</a>
                <a href="/servicios/seo" className="mobile-menu-subitem">↳ SEO</a>
              </React.Fragment>
            )}
          </React.Fragment>
        ))}
        <button className="btn btn-primary" style={{marginTop: 12}} onClick={(e) => go(e, "contacto")}>
          Agendar reunión <span className="arrow"><Icon.arrow /></span>
        </button>
      </div>
    </React.Fragment>
  );
}

/* ===================== HERO ===================== */
function Hero({ onNav }) {
  const particlesRef = useRefH(null);

  /* Spawn floating particles */
  useEffectH(() => {
    const container = particlesRef.current;
    if (!container) return;
    const N = 22;
    const palette = ['#e6a532', '#f0c46e', '#7ec8e3'];
    container.innerHTML = '';
    for (let i = 0; i < N; i++) {
      const p = document.createElement('div');
      p.className = 'hero-particle';
      const x    = 4 + Math.random() * 48;
      const y    = 18 + Math.random() * 65;
      const sz   = 1.5 + Math.random() * 2.5;
      const color = palette[Math.floor(Math.random() * palette.length)];
      Object.assign(p.style, {
        left:              x + '%',
        top:               y + '%',
        width:             sz + 'px',
        height:            sz + 'px',
        background:        color,
        boxShadow:         `0 0 ${4 + sz * 2}px ${color}`,
        animationDuration: (5 + Math.random() * 8) + 's',
        animationDelay:    (-Math.random() * 10) + 's',
      });
      container.appendChild(p);
    }
    return () => { if (container) container.innerHTML = ''; };
  }, []);

  /* KPI count-up animation (loops) */
  useEffectH(() => {
    function animateCountUp(el) {
      const target   = parseFloat(el.dataset.target);
      const prefix   = el.dataset.prefix   || '';
      const suffix   = el.dataset.suffix   || '';
      const decimals = parseInt(el.dataset.decimals || '0', 10);
      const dur      = 2200;

      function fmt(n) {
        const v    = n.toFixed(decimals);
        const parts = v.split('.');
        parts[0]   = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        return prefix + parts.join(',') + suffix;
      }

      function run() {
        const t0 = performance.now();
        (function step(t) {
          const prog = Math.min(1, (t - t0) / dur);
          const ease = 1 - Math.pow(1 - prog, 3);
          el.textContent = fmt(target * ease);
          if (prog < 1) requestAnimationFrame(step);
          else setTimeout(run, 3200);
        })(performance.now());
      }
      run();
    }
    document.querySelectorAll('.kpi-ku').forEach(animateCountUp);
  }, []);

  return (
    <section id="hero" className="hero hero-grain" aria-label="Hero Gestión 360 IA">
      {/* ── Background image ── */}
      <img
        className="hero-bg-img"
        src="hero-bg.png"
        alt="Ejecutivo observando un dashboard analítico holográfico en una oficina nocturna con vista al skyline"
      />

      {/* ── SVG FX layer — aligned to image via preserveAspectRatio slice ── */}
      <svg
        className="hero-fx"
        viewBox="0 0 720 1280"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="scanGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="rgba(230,165,50,0)"/>
            <stop offset="50%"  stopColor="rgba(230,165,50,0.18)"/>
            <stop offset="100%" stopColor="rgba(230,165,50,0)"/>
          </linearGradient>
          <radialGradient id="haloGold" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="rgba(230,165,50,0.30)"/>
            <stop offset="100%" stopColor="rgba(230,165,50,0)"/>
          </radialGradient>
          <radialGradient id="haloCyan" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="rgba(126,200,227,0.30)"/>
            <stop offset="100%" stopColor="rgba(126,200,227,0)"/>
          </radialGradient>
        </defs>

        {/* Soft halos */}
        <ellipse cx="220" cy="280" rx="180" ry="120" fill="url(#haloGold)"/>
        <ellipse cx="260" cy="780" rx="200" ry="130" fill="url(#haloCyan)" opacity="0.7"/>

        {/* ── Node network (top-left dashboard area) ── */}
        <g>
          <line className="fx-link"           x1="100" y1="220" x2="170" y2="180"/>
          <line className="fx-link fx-link-cy" x1="100" y1="220" x2="135" y2="280"/>
          <line className="fx-link"           x1="170" y1="180" x2="215" y2="235"/>
          <line className="fx-link fx-link-w"  x1="170" y1="180" x2="225" y2="135"/>
          <line className="fx-link"           x1="215" y1="235" x2="180" y2="305"/>
          <line className="fx-link fx-link-cy" x1="215" y1="235" x2="265" y2="280"/>
          <line className="fx-link"           x1="135" y1="280" x2="180" y2="305"/>
          <line className="fx-link fx-link-w"  x1="180" y1="305" x2="240" y2="325"/>
          <line className="fx-link fx-link-cy" x1="265" y1="280" x2="240" y2="325"/>
          <line className="fx-link"           x1="100" y1="220" x2="80"  y2="170"/>
          <line className="fx-link fx-link-w"  x1="170" y1="180" x2="120" y2="140"/>

          <circle className="fx-node fx-node-w"  cx="80"  cy="170" r="3"/>
          <circle className="fx-node"            cx="120" cy="140" r="3.5" style={{animationDelay:'-0.4s'}}/>
          <circle className="fx-node fx-node-cy" cx="100" cy="220" r="4"   style={{animationDelay:'-0.8s'}}/>
          <circle className="fx-node fx-node-w"  cx="135" cy="280" r="3"   style={{animationDelay:'-1.2s'}}/>
          <circle className="fx-node"            cx="170" cy="180" r="4"   style={{animationDelay:'-1.6s'}}/>
          <circle className="fx-node fx-node-cy" cx="215" cy="235" r="3.5" style={{animationDelay:'-2.0s'}}/>
          <circle className="fx-node"            cx="225" cy="135" r="3"   style={{animationDelay:'-2.4s'}}/>
          <circle className="fx-node fx-node-w"  cx="180" cy="305" r="3.5" style={{animationDelay:'-0.6s'}}/>
          <circle className="fx-node fx-node-cy" cx="265" cy="280" r="4"   style={{animationDelay:'-1.4s'}}/>
          <circle className="fx-node"            cx="240" cy="325" r="3"   style={{animationDelay:'-2.2s'}}/>
        </g>

        {/* ── Upper line chart ── */}
        <path className="fx-chart fx-chart-gold" d="M210 360 Q 230 320 250 335 T 290 320 T 330 305 T 370 315 T 410 295"/>
        <path className="fx-chart fx-chart-cyan" d="M210 340 Q 240 305 270 320 T 320 300 T 370 290 T 410 275"/>
        <path className="fx-chart fx-chart-soft" d="M210 375 Q 240 355 270 360 T 320 348 T 370 342 T 410 332"/>
        <circle className="fx-chart-dot"              cx="410" cy="295" r="3"/>
        <circle className="fx-chart-dot fx-chart-dot-cy" cx="410" cy="275" r="2.5"/>

        {/* ── Lower line chart ── */}
        <path className="fx-chart fx-chart-gold" d="M90 830 Q 130 780 170 800 T 230 760 T 290 740 T 350 720 T 410 705"/>
        <path className="fx-chart fx-chart-cyan" d="M90 800 Q 130 760 170 770 T 230 740 T 290 715 T 350 720 T 410 690"/>
        <path className="fx-chart fx-chart-soft" d="M90 860 Q 140 830 180 840 T 240 815 T 300 805 T 360 790 T 410 770"/>
        <circle className="fx-chart-dot"              cx="410" cy="705" r="3"/>
        <circle className="fx-chart-dot fx-chart-dot-cy" cx="410" cy="690" r="2.5"/>

        {/* Grid accents */}
        <line x1="90"  y1="690" x2="90"  y2="880" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5"/>
        <line x1="410" y1="690" x2="410" y2="880" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5"/>
        <rect className="fx-scan" x="80" y="680" width="350" height="2"/>

        {/* ── KPI glass cards ── */}
        <foreignObject x="60" y="80" width="220" height="50">
          <div xmlns="http://www.w3.org/1999/xhtml" className="kpi">
            <span className="kpi-label">Procesos analizados</span>
            <span className="kpi-value">
              <span className="kpi-ku" data-target="2847">0</span>
            </span>
          </div>
        </foreignObject>

        <foreignObject x="60" y="400" width="220" height="60">
          <div xmlns="http://www.w3.org/1999/xhtml" className="kpi kpi-2">
            <span className="kpi-label">Ineficiencias detectadas</span>
            <span className="kpi-value">
              <span className="kpi-ku" data-target="34" data-prefix="US$ " data-suffix="K">0</span>
            </span>
            <span className="kpi-trend">▲ +12,4%</span>
          </div>
        </foreignObject>

        <foreignObject x="60" y="950" width="240" height="62">
          <div xmlns="http://www.w3.org/1999/xhtml" className="kpi kpi-3">
            <span className="kpi-label">Eficiencia operativa</span>
            <span className="kpi-value">
              <span className="kpi-ku" data-target="87">0</span>
              <span className="unit">%</span>
            </span>
            <span className="kpi-trend">▲ vs. trimestre anterior</span>
          </div>
        </foreignObject>
      </svg>

      {/* ── Particles ── */}
      <div className="hero-particles" ref={particlesRef} aria-hidden="true"/>

      {/* ── Atmospheric overlays ── */}
      <div className="hero-tint"/>
      <div className="hero-vignette"/>

      {/* ── Hero content ── */}
      <div className="hero-content">
        <span className="hero-eyebrow">Gestión 360 IA · Consultoría de IA</span>
        <h1 className="hero-title">
          Transformamos tu negocio<br/>con <span>Inteligencia Artificial</span>
        </h1>
        <p className="hero-subtitle">
          Consultoría, desarrollo y automatización con IA para empresas
          que quieren crecer más rápido, vender más y operar mejor.
        </p>
        <div className="hero-ctas">
          <button className="btn btn-primary" onClick={() => onNav("contacto")}>
            Agendar diagnóstico gratuito <span className="arrow"><Icon.arrow /></span>
          </button>
          <button className="btn btn-ghost" onClick={() => onNav("servicios")}>
            Ver servicios <span className="arrow"><Icon.arrowDown /></span>
          </button>
        </div>
        <div className="trust-bar">
          <span className="trust-label">+24 empresas confían en nosotros</span>
          <div className="trust-logos">
            <span className="trust-logo">◆ Norte Capital</span>
            <span className="trust-logo">⌬ Lumen</span>
            <span className="trust-logo">▲ Studio Verde</span>
            <span className="trust-logo">◉ Pampa Foods</span>
            <span className="trust-logo">⬡ Astra</span>
          </div>
        </div>
      </div>

      <div className="hero-cue" aria-hidden="true">
        <span>Conocenos</span>
        <span className="hero-cue-line"/>
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
      <div className="svc-card-foot">
        <span className="svc-more">
          <span className="dot"></span>
          Ver más
          <Icon.arrow style={{marginLeft: 4}}/>
        </span>
        {s.page && (
          <a href={s.page} className="svc-page-btn"
             onClick={(e) => e.stopPropagation()}
             aria-label={`Ver información completa de ${s.name}`}>
            Ver información completa
            <Icon.arrow/>
          </a>
        )}
      </div>
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
            {service.page && (
              <a href={service.page} className="modal-detail-link">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><path d="M15 3h6v6"/><path d="M10 14L21 3"/></svg>
                Ver información completa de este servicio
                <Icon.arrow style={{marginLeft: "auto", flexShrink: 0}}/>
              </a>
            )}
            <div style={{display: "flex", alignItems: "center", gap: 14, marginBottom: 18}}>
              <span className="svc-icon" style={{margin: 0}}><IconComp /></span>
              <span className="tag">{service.tag}</span>
            </div>
            <h3>{service.name}</h3>
            <p style={{margin: "6px 0 0", color: "var(--ink-mute)", fontSize: 14, fontStyle: "italic"}}>
              {service.tagline}
            </p>
            <p style={{marginTop: 20, color: "var(--ink-soft)", fontSize: 14.5, lineHeight: 1.6}}>
              {service.desc}
            </p>

            <div style={{marginTop: 26}}>
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

            <div style={{display: "flex", gap: 10, marginTop: 26, flexWrap: "wrap"}}>
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
