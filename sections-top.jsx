import React, { useState as useStateH, useEffect as useEffectH, useRef as useRefH } from 'react';
import { flushSync } from 'react-dom';
import { Icon, SERVICES } from './data.jsx';

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
          {active === "hero" && (
            <div className="header-cta">
              <button className="btn btn-primary btn-sm" onClick={(e) => go(e, "contacto")}>
                Acceso clientes
                <span className="arrow"><Icon.arrow /></span>
              </button>
            </div>
          )}
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
        <h1 className="hero-title">
          <span className="hero-title-line">Transformamos tu negocio</span>
          <span className="hero-title-line">con <span>Inteligencia Artificial</span></span>
        </h1>
        <div className="hero-ctas">
          <button className="btn btn-ghost" onClick={() => onNav("servicios")}>
            Ver servicios <span className="arrow"><Icon.arrowDown /></span>
          </button>
        </div>
      </div>

    </section>
  );
}

/* ===================== SERVICES BENTO METRO ===================== */

/* Split a string into word <span class="w"> elements for stagger animation */
function wrapWords(text) {
  return text.split(/(\s+)/).map((part, i) =>
    /^\s+$/.test(part) ? part : React.createElement('span', { key: i, className: 'w' }, part)
  );
}

function Services({ onContact }) {
  const [expandedIdx, setExpandedIdx] = useStateH(null);
  const bentoRef = useRefH(null);
  const animRef  = useRefH({ idx: null, geo: null }); /* animation state — kept in ref, not state */

  /* ── Expand — mismo enfoque del reference HTML ── */
  const doExpand = (tile, idx) => {
    const bento = bentoRef.current;
    if (!bento || !tile) return;

    const b = bento.getBoundingClientRect();
    const r = tile.getBoundingClientRect();
    const geo = {
      left: r.left - b.left, top: r.top - b.top,
      w: r.width,             h: r.height,
      bW: b.width,            bH: b.height,
    };
    animRef.current = { idx, geo };

    /* Guardar y limpiar grid-column/grid-row inline para que el containing block
       sea el bento completo y no la grid area del tile */
    tile.dataset.gridCol = tile.style.gridColumn;
    tile.dataset.gridRow = tile.style.gridRow;
    tile.style.gridColumn = '';
    tile.style.gridRow    = '';

    /* Pin al tamaño/posición actual ANTES de agregar is-expanded */
    tile.style.left   = geo.left + 'px';
    tile.style.top    = geo.top  + 'px';
    tile.style.width  = geo.w   + 'px';
    tile.style.height = geo.h   + 'px';

    /* Agregar clase → position:absolute toma efecto */
    flushSync(() => setExpandedIdx(idx));

    /* rAF: animar al overlay expandido */
    requestAnimationFrame(() => {
      tile.style.left   = '0';
      tile.style.top    = '0';
      tile.style.width  = b.width  + 'px';
      tile.style.height = b.height + 'px';

      animRef.current.expanding = true;
      const onExpandDone = (e) => {
        if (e.propertyName !== 'width') return;
        tile.removeEventListener('transitionend', onExpandDone);
        if (animRef.current) animRef.current.expanding = false;
      };
      tile.addEventListener('transitionend', onExpandDone);
    });

    /* Word stagger */
    tile.querySelectorAll('.svc-tile-title .w').forEach((w, i) => {
      w.style.animationDelay = (0.10 + i * 0.05) + 's';
    });
    tile.querySelectorAll('.svc-tile-desc .w').forEach((w, i) => {
      w.style.transitionDelay = (0.35 + i * 0.025) + 's';
    });
  };

  /* ── Collapse: fade text → animate back → remove overlay ── */
  const doCollapse = (tile, idx) => {
    const { idx: aIdx, geo, expanding } = animRef.current;
    if (!tile || !geo || aIdx !== idx) return;
    if (expanding) return; /* ignore mouseleave while expand animation is running */

    /* Reset word stagger and hide sharp lens */
    tile.querySelectorAll('.svc-tile-title .w').forEach(w => { w.style.animationDelay = '0s'; });
    tile.querySelectorAll('.svc-tile-desc .w').forEach(w => { w.style.transitionDelay = '0s'; });
    animRef.current = { idx: null, geo: null };

    /* Animar de vuelta a posición original */
    tile.style.left   = geo.left + 'px';
    tile.style.top    = geo.top  + 'px';
    tile.style.width  = geo.w    + 'px';
    tile.style.height = geo.h    + 'px';

    const done = (e) => {
      if (e.propertyName !== 'width') return;
      tile.removeEventListener('transitionend', done);
      flushSync(() => setExpandedIdx(null));
      /* Restaurar grid-column/grid-row y limpiar estilos de animación */
      tile.style.gridColumn = tile.dataset.gridCol || '';
      tile.style.gridRow    = tile.dataset.gridRow || '';
      tile.style.left   = '';
      tile.style.top    = '';
      tile.style.width  = '';
      tile.style.height = '';
    };
    tile.addEventListener('transitionend', done);
  };

  /* Click handler: expand on click, collapse on second click or close button */
  const handleClick = (idx) => (e) => {
    const tile = e.currentTarget;
    if (window.innerWidth <= 1024) {
      flushSync(() => setExpandedIdx(tile.classList.contains('is-expanded') ? null : idx));
      return;
    }
    if (tile.classList.contains('is-expanded')) {
      doCollapse(tile, idx);
    } else {
      if (animRef.current.idx !== null) return;
      doExpand(tile, idx);
    }
  };


  /* Render a single bento tile */
  const renderTile = (s, idx) => {
    const IconComp   = Icon[s.icon];
    const isFeature  = s.id === 'software';
    const hasBg      = !!s.bgImage;
    const isExpanded = expandedIdx === idx;

    let cls = 'svc-tile';
    if (isFeature)  cls += ' svc-tile--feature';
    if (hasBg)      cls += ' has-bg';
    if (isExpanded) cls += ' is-expanded';

    const tileStyle = (s.grid && !isExpanded)
      ? { gridColumn: s.grid.col, gridRow: s.grid.row }
      : {};

    return (
      <article
        key={s.id}
        className={cls}
        style={tileStyle}
        role="listitem"
        aria-label={s.name}
        onClick={handleClick(idx)}
      >
        {/* per-tile background image layers */}
        {hasBg && (
          <div className="svc-bg" aria-hidden="true"
            style={{ backgroundImage: `url('${s.bgImage}')` }} />
        )}

        {/* decorative layers */}
        <div className="svc-tile-glow" aria-hidden="true" />
        <div className="svc-tile-wash" aria-hidden="true" />

        {/* collapsed card content */}
        <div className="svc-tile-ico" aria-hidden="true"><IconComp /></div>
        <div className="svc-tile-text">
          <div className="svc-tile-kick">{s.tag}</div>
          <h3 className="svc-tile-title">{wrapWords(s.name)}</h3>
        </div>

        {/* detail panel — visible only when expanded */}
        <div className="svc-tile-desc">
          {s.tagline && <p className="svc-tile-tagline">{wrapWords(s.tagline)}</p>}
          <p>{wrapWords(s.desc)}</p>
          {s.includes && s.includes.length > 0 && (
            <ul className="svc-tile-includes">
              {s.includes.map((it, i) => (
                <li key={i}>
                  <span className="check"><Icon.check /></span>
                  {it}
                </li>
              ))}
            </ul>
          )}
          <div className="svc-tile-actions">
            <button
              className="btn btn-primary"
              onClick={(e) => { e.stopPropagation(); onContact && onContact(s.id); }}
            >
              Quiero este servicio <Icon.arrow />
            </button>
            {s.page && (
              <a href={s.page} className="btn btn-ghost" onClick={(e) => e.stopPropagation()}>
                Ver más <Icon.arrow />
              </a>
            )}
          </div>
        </div>

        {/* click hint (hidden once expanded) */}
        <div className="svc-tile-cta" aria-hidden="true">Ver detalle →</div>

        {/* close button — only visible when expanded */}
        <button
          className="svc-tile-close"
          aria-label="Cerrar"
          onClick={(e) => {
            e.stopPropagation();
            if (window.innerWidth <= 1024) { flushSync(() => setExpandedIdx(null)); return; }
            doCollapse(e.currentTarget.closest('.svc-tile'), idx);
          }}
        >✕</button>
      </article>
    );
  };

  return (
    <section id="servicios" className="section svc-bento-section">
      <div className="container container--svc-head">
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
      </div>

      <div className="svc-bento-outer">
        <div className="svc-bento" ref={bentoRef} role="list" aria-label="Servicios de Gestión 360 IA">
          {SERVICES.map((s, i) => renderTile(s, i))}
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
      <img className="valor-bg" src="hero-bg.png" alt="" aria-hidden="true" />
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

export { Header, Hero, Services, FloatNav, ValorProp };
