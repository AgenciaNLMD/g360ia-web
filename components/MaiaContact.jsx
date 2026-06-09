import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Icon } from '../data.jsx';

/* ══════════════════════════════════════════════════════════
   PARTICLE FIELD — background network canvas
══════════════════════════════════════════════════════════ */
function ParticleField() {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const section = canvas.parentElement;
    const onMove = (e) => {
      const r = section.getBoundingClientRect();
      mouse.current = { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height };
    };
    section.addEventListener('mousemove', onMove);

    const N = 50;
    const pts = Array.from({ length: N }, () => ({
      x: Math.random(), y: Math.random(),
      vx: (Math.random() - 0.5) * 0.00016, vy: (Math.random() - 0.5) * 0.00016,
      r: Math.random() * 1.3 + 0.4, op: Math.random() * 0.3 + 0.07,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const mx = mouse.current.x, my = mouse.current.y;
      for (const p of pts) {
        const dx = mx - p.x, dy = my - p.y, d = Math.hypot(dx, dy);
        if (d < 0.28) { p.vx += dx * 0.0000015; p.vy += dy * 0.0000015; }
        p.vx *= 0.998; p.vy *= 0.998;
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) { p.x = 0; p.vx *= -1; } if (p.x > 1) { p.x = 1; p.vx *= -1; }
        if (p.y < 0) { p.y = 0; p.vy *= -1; } if (p.y > 1) { p.y = 1; p.vy *= -1; }
        ctx.beginPath();
        ctx.arc(p.x * canvas.width, p.y * canvas.height, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(93,127,163,${p.op})`; ctx.fill();
      }
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = (pts[i].x - pts[j].x) * canvas.width;
          const dy = (pts[i].y - pts[j].y) * canvas.height;
          const dist = Math.hypot(dx, dy);
          if (dist < 85) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x * canvas.width, pts[i].y * canvas.height);
            ctx.lineTo(pts[j].x * canvas.width, pts[j].y * canvas.height);
            ctx.strokeStyle = `rgba(93,127,163,${0.06 * (1 - dist / 85)})`;
            ctx.lineWidth = 0.5; ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      section.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas ref={canvasRef} className="maia-particles" aria-hidden="true" />;
}

/* ══════════════════════════════════════════════════════════
   MAIA PANEL — frosted glass chat UI
══════════════════════════════════════════════════════════ */
function MaiaPanel({ inView }) {
  const wrapRef     = useRef(null);
  const panelRef    = useRef(null);
  const rafRef      = useRef(null);
  const targetTilt  = useRef({ x: 0, y: 0 });
  const currentTilt = useRef({ x: 0, y: 0 });

  const onMouseMove = useCallback((e) => {
    const r = wrapRef.current?.getBoundingClientRect();
    if (!r) return;
    targetTilt.current = {
      x: (e.clientX - r.left) / r.width  - 0.5,
      y: (e.clientY - r.top)  / r.height - 0.5,
    };
  }, []);

  const onMouseLeave = useCallback(() => {
    targetTilt.current = { x: 0, y: 0 };
  }, []);

  useEffect(() => {
    const lerp = (a, b, t) => a + (b - a) * t;
    const tick = () => {
      const ct = currentTilt.current;
      const tt = targetTilt.current;
      ct.x = lerp(ct.x, tt.x, 0.07);
      ct.y = lerp(ct.y, tt.y, 0.07);
      if (panelRef.current) {
        panelRef.current.style.transform =
          `perspective(1200px) rotateY(${ct.x * 6}deg) rotateX(${-ct.y * 4}deg)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div
      ref={wrapRef}
      className={`mp-wrap${inView ? ' is-visible' : ''}`}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <div ref={panelRef} className="mp-panel">

        {/* Gold ambient light top-left */}
        <div className="mp-glow" aria-hidden="true" />

        {/* ── Header ── */}
        <div className="mp-header">
          <div className="mp-avatar" aria-hidden="true">
            {/* Hex logo inside square avatar */}
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <polygon points="11,2 19,6.5 19,15.5 11,20 3,15.5 3,6.5"
                stroke="rgba(212,165,61,0.9)" strokeWidth="1.4"
                fill="rgba(212,165,61,0.10)" />
              <circle cx="11" cy="11" r="3.2" fill="rgba(212,165,61,0.85)" />
            </svg>
          </div>
          <div className="mp-header-info">
            <span className="mp-name">MAIA</span>
            <span className="mp-sub">
              <span className="mp-online-dot" />
              Intelligent Assistant · G360iA
            </span>
          </div>
        </div>

        {/* ── Chat body ── */}
        <div className="mp-body">

          {/* Date separator */}
          <div className="mp-date">Hoy</div>

          {/* MAIA msg 1 */}
          <div className="mp-row mp-row--in">
            <div className="mp-bubble mp-bubble--in">
              Hola, soy <strong>MAIA</strong> — la IA de Gestión360iA.
            </div>
            <span className="mp-time">9:41 AM</span>
          </div>

          {/* MAIA msg 2 */}
          <div className="mp-row mp-row--in">
            <div className="mp-bubble mp-bubble--in">
              Estoy lista para ayudarte a transformar tu empresa con automatización e inteligencia artificial.
            </div>
            <span className="mp-time">9:41 AM</span>
          </div>

          {/* User msg */}
          <div className="mp-row mp-row--out">
            <div className="mp-bubble mp-bubble--out">
              ¿Cómo puede ayudar la IA a mi empresa?
            </div>
            <span className="mp-time mp-time--out">9:42 AM</span>
          </div>

          {/* Typing indicator */}
          <div className="mp-row mp-row--in">
            <div className="mp-bubble mp-bubble--in mp-typing">
              <span /><span /><span />
            </div>
          </div>

        </div>

        {/* ── Input bar ── */}
        <div className="mp-footer">
          <div className="mp-input-wrap">
            <span className="mp-placeholder">Mensaje…</span>
            <span className="mp-cursor" aria-hidden="true" />
          </div>
          <button className="mp-send" disabled aria-label="Enviar">
            Enviar
          </button>
        </div>

      </div>{/* /mp-panel */}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   CONTACT INFO — dos partes para reordenar en mobile
══════════════════════════════════════════════════════════ */
function ContactHeader({ visible }) {
  return (
    <div className={`maia-info-card${visible ? ' is-visible' : ''}`}>
      <div className="maia-info-eyebrow">
        <span className="maia-pulse-dot" />
        Contacto
      </div>
      <h2 className="maia-info-title">
        Hablemos sobre<br /><em>tu proyecto</em>
      </h2>
      <p className="maia-info-lead">
        Contanos qué necesitás y te respondemos<br />en menos de 24 horas hábiles.
      </p>
    </div>
  );
}

function ContactDetails({ visible }) {
  return (
    <div className={`maia-info-card maia-info-card--details${visible ? ' is-visible' : ''}`}>
      <ul className="maia-contact-list">
        <li>
          <a href="mailto:consultora@g360ia.com.ar" className="maia-contact-item">
            <span className="maia-contact-icon"><Icon.mail /></span>
            <span className="maia-contact-text">
              <span className="maia-contact-label">Email</span>
              <span className="maia-contact-value">consultora@g360ia.com.ar</span>
            </span>
          </a>
        </li>
        <li>
          <a href="https://wa.me/5491125526561" target="_blank" rel="noopener" className="maia-contact-item">
            <span className="maia-contact-icon"><Icon.whatsapp /></span>
            <span className="maia-contact-text">
              <span className="maia-contact-label">WhatsApp</span>
              <span className="maia-contact-value">+54 9 11 2552-6561</span>
            </span>
          </a>
        </li>
        <li>
          <span className="maia-contact-item">
            <span className="maia-contact-icon"><Icon.map /></span>
            <span className="maia-contact-text">
              <span className="maia-contact-label">Ubicación</span>
              <span className="maia-contact-value">Buenos Aires, Argentina</span>
            </span>
          </span>
        </li>
      </ul>
      <div className="maia-info-geo">
        <span className="maia-geo-coords">34°36′S 58°22′O · Buenos Aires, AR</span>
        <span className="maia-geo-reach">Trabajamos con toda LATAM y el mundo</span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIA CONTACT — section root
══════════════════════════════════════════════════════════ */
export default function MaiaContact() {
  const sectionRef = useRef(null);
  const glowRef    = useRef(null);
  const [inView,   setInView] = useState(false);

  const handleMouseMove = useCallback((e) => {
    const r = sectionRef.current?.getBoundingClientRect();
    if (!r || !glowRef.current) return;
    const x = ((e.clientX - r.left) / r.width  * 100).toFixed(1);
    const y = ((e.clientY - r.top)  / r.height * 100).toFixed(1);
    glowRef.current.style.background =
      `radial-gradient(700px circle at ${x}% ${y}%, rgba(93,127,163,0.09) 0%, transparent 60%)`;
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold: 0.06 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id="contacto"
      ref={sectionRef}
      className="maia-section"
      onMouseMove={handleMouseMove}
    >
      <div className="maia-world-bg" aria-hidden="true" />
      <div ref={glowRef} className="maia-cursor-glow" aria-hidden="true" />
      <ParticleField />

      <div className={`maia-inner${inView ? ' is-visible' : ''}`}>

        <ContactHeader visible={inView} />
        <MaiaPanel inView={inView} />
        <ContactDetails visible={inView} />

      </div>
    </section>
  );
}
