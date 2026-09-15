import React, { useState as useStateH, useEffect as useEffectH, useRef as useRefH } from 'react';
import { Icon, SERVICES, PUERTAS } from './data.jsx';

/* ===================== HEADER ===================== */
function Header({ active, onNav }) {
  const [scrolled, setScrolled] = useStateH(false);

  useEffectH(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (e, id) => {
    e.preventDefault();
    onNav(id);
  };

  return (
    <React.Fragment>
      <header className={`header ${scrolled ? "scrolled" : ""}`}>
        <div className="container header-inner">
        </div>
      </header>
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
      {/* Background image is now global-fixed-bg in app.jsx */}

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

        {/* Scanline */}
        <rect className="fx-scan" x="0" y="440" width="720" height="55"/>

        {/* Network links */}
        <line className="fx-link fx-link-cy" x1="330" y1="490" x2="410" y2="458"/>
        <line className="fx-link"            x1="410" y1="458" x2="500" y2="474"/>
        <line className="fx-link fx-link-cy" x1="500" y1="474" x2="572" y2="505"/>
        <line className="fx-link fx-link-w"  x1="330" y1="490" x2="455" y2="530"/>
        <line className="fx-link"            x1="455" y1="530" x2="500" y2="474"/>
        <line className="fx-link fx-link-cy" x1="455" y1="530" x2="380" y2="552"/>

        {/* Network nodes */}
        <circle className="fx-node fx-node-cy" cx="330" cy="490" r="3.5"/>
        <circle className="fx-node"            cx="410" cy="458" r="3"   style={{animationDelay:'-0.8s'}}/>
        <circle className="fx-node fx-node-cy" cx="500" cy="474" r="4"   style={{animationDelay:'-1.6s'}}/>
        <circle className="fx-node fx-node-w"  cx="572" cy="505" r="2.5" style={{animationDelay:'-0.4s'}}/>
        <circle className="fx-node"            cx="455" cy="530" r="3"   style={{animationDelay:'-2s'}}/>
        <circle className="fx-node fx-node-cy" cx="380" cy="552" r="2"   style={{animationDelay:'-1.2s'}}/>

        {/* Line charts — cyan crece primero, luego gold y soft */}
        <path className="fx-chart fx-chart-cyan"
          d="M 60,720 L 140,692 L 210,706 L 280,678 L 350,688 L 420,658 L 490,670 L 565,642 L 640,652"
        />
        <path className="fx-chart fx-chart-gold"
          d="M 60,755 L 140,733 L 210,744 L 280,720 L 350,728 L 420,704 L 490,714 L 565,692 L 640,700"
        />
        <path className="fx-chart fx-chart-soft"
          d="M 80,786 L 175,769 L 265,776 L 350,758 L 435,764 L 520,748 L 610,754"
        />

        {/* Chart endpoint dots */}
        <circle className="fx-chart-dot fx-chart-dot-cy" cx="640" cy="652" r="4"/>
        <circle className="fx-chart-dot"                 cx="640" cy="700" r="3.5"/>
      </svg>

      {/* ── Particles ── */}
      <div className="hero-particles" ref={particlesRef} aria-hidden="true"/>

      {/* ── Atmospheric overlays ── */}
      <div className="hero-tint"/>
      <div className="hero-vignette"/>

      {/* ── Hero content ── */}
      <div className="hero-content">
        <a className="btn btn-primary btn-sm hero-acceso-btn" href="https://panel.g360ia.com.ar">
          Acceso clientes
          <span className="arrow"><Icon.arrow /></span>
        </a>
        <div className="hero-bottom-row">
          <h1 className="hero-title">
            <span className="hero-title-line">Transformamos tu negocio</span>
            <span className="hero-title-line"><a href="https://chat.g360ia.com.ar" style={{ color: 'inherit', textDecoration: 'inherit', cursor: 'text', pointerEvents: 'auto' }} aria-label="Abrir chat G360iA">con</a> <span>Inteligencia Artificial</span></span>
          </h1>
          <div className="hero-ctas">
            <a className="btn btn-ghost" href="/blog/">
              Visitá el blog <span className="arrow"><Icon.arrow /></span>
            </a>
          </div>
        </div>
      </div>

    </section>
  );
}

/* ===================== PUERTAS =====================
   Tres tarjetas y nada más. Es lo que reemplaza al catálogo que había acá:
   la agencia vende servicio, producto y reventa a tres personas distintas, y
   la home ahora pregunta cuál de las tres sos en vez de mostrarle las tres
   cosas enteras a todo el mundo. Cada puerta lleva a su lugar y ahí se abre. */
function Puertas({ onNav }) {
  const ir = (p) => (e) => {
    /* Las que apuntan a una sección de esta misma página navegan por el
       canvas (desktop) o por scroll (mobile); las que apuntan a otra página
       son un <a> normal y no las tocamos. */
    if (!p.nav) return;
    e.preventDefault();
    onNav(p.nav);
  };

  return (
    <section id="puertas" className="section puertas-section" aria-label="Por dónde empezar">
      <div className="container">
        <div className="section-head section-head--stack">
          <span className="eyebrow reveal">Por dónde empezar</span>
          <h2 className="h-display h2 reveal" style={{ '--delay': '60ms' }}>
            ¿A qué viniste?
          </h2>
          <p className="lead reveal" style={{ '--delay': '140ms' }}>
            Hacemos tres cosas distintas. Elegí la tuya y te llevamos derecho.
          </p>
        </div>

        <div className="puertas-grid" role="list">
          {PUERTAS.map((p, i) => {
            const IconComp = Icon[p.icon];
            return (
              <a
                key={p.id}
                href={p.href}
                role="listitem"
                className="puerta reveal"
                style={{ '--delay': 200 + i * 90 + 'ms' }}
                onClick={ir(p)}
              >
                <span className="puerta-ico" aria-hidden="true"><IconComp /></span>
                <span className="puerta-kicker">{p.kicker}</span>
                <h3 className="puerta-titulo">{p.titulo}</h3>
                <p className="puerta-desc">{p.desc}</p>
                <span className="puerta-accion">
                  {p.accion} <Icon.arrow />
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ===================== SERVICIOS =====================
   Una grilla de tarjetas que enlazan. Antes había acá un bento con overlay
   animado: cada tarjeta se expandía a pantalla completa midiendo su posición
   con getBoundingClientRect, sincronizando el re-render con flushSync y
   esperando el transitionend para devolverla a la grilla. El detalle que
   mostraba al expandirse es el que ya está —mejor contado— en la página de
   cada servicio, así que era una escala de más: el usuario leía un resumen y
   después igual tenía que clickear para llegar a la página real.

   Las siete imágenes de fondo (~1,3 MB) se fueron con él. Cada tarjeta es
   ahora un <a>: se puede abrir en otra pestaña, el robot la sigue, y el
   posicionamiento de las páginas de servicio recibe un enlace interno de la
   home, que antes no tenían. */
function Servicios() {
  return (
    <section id="servicios" className="section svc-cards-section">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow reveal">Servicios</span>
            <h2 className="h-display h2 reveal" style={{ '--delay': '60ms' }}>
              Todo lo que tu negocio necesita,<br />
              <em>en un solo lugar.</em>
            </h2>
          </div>
          <p className="lead reveal" style={{ '--delay': '140ms' }}>
            Combinamos estrategia, tecnología e IA para ofrecerte un ecosistema completo
            de servicios digitales. Cada solución se integra con la siguiente.
          </p>
        </div>

        <div className="svc-cards" role="list">
          {SERVICES.map((s, i) => {
            const IconComp = Icon[s.icon];
            return (
              <a
                key={s.id}
                href={s.page}
                role="listitem"
                className="svc-card reveal"
                style={{ '--delay': 120 + i * 60 + 'ms' }}
              >
                <span className="svc-card-ico" aria-hidden="true"><IconComp /></span>
                <span className="svc-card-kick">{s.tag}</span>
                <h3 className="svc-card-title">{s.name}</h3>
                <p className="svc-card-desc">{s.tagline}</p>
                <span className="svc-card-mas">Ver el servicio <Icon.arrow /></span>
              </a>
            );
          })}

          {/* Octava celda: el puente al catálogo de producto. Quien llegó hasta
              acá buscando servicio a medida puede no saber que además hay
              sistemas ya hechos, que suelen ser más baratos para él. */}
          <a href="/software" role="listitem" className="svc-card svc-card--cruce reveal"
             style={{ '--delay': 120 + SERVICES.length * 60 + 'ms' }}>
            <span className="svc-card-ico" aria-hidden="true"><Icon.box /></span>
            <span className="svc-card-kick">Software propio</span>
            <h3 className="svc-card-title">¿Y si ya existe hecho?</h3>
            <p className="svc-card-desc">
              Sistemas listos para usar, por una cuota mensual. Sale menos que mandarlo a hacer.
            </p>
            <span className="svc-card-mas">Ver el catálogo <Icon.arrow /></span>
          </a>
        </div>
      </div>
    </section>
  );
}

/* ===================== FLOAT NAV ===================== */
function FloatNav({ active, onNav }) {
  const [svcOpen, setSvcOpen] = useStateH(false);
  const dropRef = useRefH(null);

  useEffectH(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setSvcOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const go = (e, id) => {
    e.preventDefault();
    setSvcOpen(false);
    onNav(id);
  };

  return (
    <nav className="floatnav" aria-label="Navegación">
      <div className="floatnav-drop-wrap" ref={dropRef}>
        <button
          className={`floatnav-drop-btn${active === "servicios" ? " is-active" : ""}${svcOpen ? " is-open" : ""}`}
          onClick={() => setSvcOpen(o => !o)}
        >
          Servicios
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="floatnav-chevron"><path d="M6 9l6 6 6-6"/></svg>
        </button>
        <div className={`floatnav-drop-panel${svcOpen ? " is-open" : ""}`}>
          <a href="#servicios" className="floatnav-drop-item" onClick={(e) => go(e, "servicios")}>
            Ver todos los servicios
          </a>
          <div className="floatnav-drop-sep"/>
          <a href="/servicios/desarrollo-software" className="floatnav-drop-item floatnav-drop-item--page">
            <span>Software & Apps</span><span className="nav-drop-tag">Ver página</span>
          </a>
          <a href="/servicios/sitios-web" className="floatnav-drop-item floatnav-drop-item--page">
            <span>SEO + Sitios web</span><span className="nav-drop-tag">Ver página</span>
          </a>
          <a href="/servicios/agentes-ia" className="floatnav-drop-item floatnav-drop-item--page">
            <span>IA conversacionales</span><span className="nav-drop-tag">Ver página</span>
          </a>
          <a href="/servicios/bots-whatsapp" className="floatnav-drop-item floatnav-drop-item--page">
            <span>Bots WhatsApp</span><span className="nav-drop-tag">Ver página</span>
          </a>
        </div>
      </div>
      {[].map(id => (
        <a key={id} href={`#${id}`}
           className={`floatnav-link${active === id ? " is-active" : ""}`}
           onClick={(e) => go(e, id)}>
          {id.charAt(0).toUpperCase() + id.slice(1)}
        </a>
      ))}
    </nav>
  );
}

/* ===================== VALOR PROP ===================== */
function ValorProp({ onNav }) {
  return (
    <section id="valor" className="section valor-section" aria-label="Propuesta de Valor">
      <img className="valor-bg" src="hero-bg.webp" alt="" aria-hidden="true" loading="lazy" decoding="async" />
      <div className="valor-tint" aria-hidden="true" />
      <div className="container valor-inner">

        {/* Left column */}
        <div className="valor-left">
          <span className="valor-eyebrow reveal" style={{"--delay":"0ms"}}>Strategic Automation // Latam Division</span>
          <h2 className="valor-heading">
            <span className="valor-line valor-line--l reveal">Transformamos tu negocio</span>
            <span className="valor-line valor-line--r reveal" style={{"--delay":"200ms"}}>con <em>Inteligencia Artificial</em></span>
          </h2>
          <p className="valor-desc reveal" style={{"--delay":"400ms"}}>
            Impulsamos la eficiencia operativa de tu empresa mediante agentes
            conversacionales, automatización de procesos estratégicos y
            desarrollo de productos digitales a medida.
          </p>
        </div>

        {/* Right column — terminal widget */}
        <div className="reveal" style={{"--delay":"220ms"}}>
          <div className="valor-terminal">
            <div className="vt-header">
              <span className="vt-dot" />
              <span className="vt-title">OPERATIONAL_EFFICIENCY_DASHBOARD</span>
            </div>
            <div className="vt-body">
              <div className="vt-line">
                <span className="vt-prompt">&gt;</span>
                AI_AGENT_STATUS: <span className="vt-green">ACTIVE</span>
              </div>
              <div className="vt-line">
                <span className="vt-prompt">&gt;</span>
                OPTIMIZING_PROCESSES<span className="vt-blink-dots">...</span>
              </div>
              <div className="vt-line">
                <span className="vt-prompt">&gt;</span>
                COST_REDUCTION: <span className="vt-gold">+34%</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

export { Header, Hero, Puertas, Servicios, FloatNav, ValorProp };
