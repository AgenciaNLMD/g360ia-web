import React, { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { Header, Hero, Services, FloatNav, ValorProp } from './sections-top.jsx';
import { Footer } from './sections-bottom.jsx';
import MaiaContact from './components/MaiaContact.jsx';
import { useTweaks } from './tweaks-panel.jsx';

/* Panel de tweaks: solo en dev — en producción el chunk no se descarga */
const DevTweaks = import.meta.env.DEV
  ? React.lazy(() => import('./dev-tweaks.jsx'))
  : null;
import { SidebarNav } from './sidebar-nav.jsx';

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "primary": "#e6a532",
  "accent": "#f0c46e",
  "heroBg": "fade",
  "cardStyle": "soft",
  "density": "comfy",
  "reveal": true
}/*EDITMODE-END*/;

/* ─────────────────────────────────────────────────────────────────────────────
   APP
───────────────────────────────────────────────────────────────────────────── */
function App() {
  const [active, setActive]               = useState("hero");
  const [presetService, setPresetService] = useState(null);
  const [tweaks, setTweak]               = useTweaks(TWEAK_DEFAULTS);

  // Sync-init from matchMedia so first render already knows desktop/mobile (no flash)
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches
  );
  const isDesktopRef      = useRef(isDesktop);
  const canvasRef         = useRef(null);
  const goToRef           = useRef(null);   // exposed so onNav can drive navigation
  const currentIdxRef     = useRef(0);      // mirrors currentSection for wheel closures

  /* ── matchMedia watch ── */
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = (e) => {
      setIsDesktop(e.matches);
      isDesktopRef.current = e.matches;
    };
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  /* ── Scrollspy (mobile only — desktop uses GSAP onUpdate) ── */
  useEffect(() => {
    if (isDesktop) return;
    const ids = ["hero", "servicios", "contacto"];
    const obs = new IntersectionObserver((entries) => {
      const visible = entries
        .filter(e => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (visible[0]) setActive(visible[0].target.id);
    }, { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.1, 0.3, 0.6] });
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [isDesktop]);

  /* ── Reveal on scroll (mobile only) ── */
  useEffect(() => {
    if (isDesktop) return;
    if (!tweaks.reveal) {
      document.querySelectorAll(".reveal").forEach(el => el.classList.add("in-view"));
      return;
    }
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("in-view");
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [tweaks.reveal, isDesktop]);

  /* ── Instant reveal when animations disabled (all modes) ── */
  useEffect(() => {
    if (!tweaks.reveal) {
      document.querySelectorAll(".reveal").forEach(el => el.classList.add("in-view"));
    }
  }, [tweaks.reveal]);

  /* ── GSAP spatial navigation (desktop only) ─────────────────────────────
     No ScrollTrigger — pure GSAP to() with wheel/touch/keyboard handling.
     One scroll event = one committed section transition. No mid-path stops.

     Grid (col × row):
       col 0, row 0 → Hero          col 1, row 0 → Servicios
       col 0, row 1 → Casos         col 1, row 1 → Proceso
       col 0, row 2 → Contacto+Footer

     Camera translate per section:
       Hero       [0,    0    ]   → RIGHT →
       Servicios  [-vw,  0    ]   → DOWN  ↓
       Proceso    [-vw,  -vh  ]   → LEFT  ←
       Casos      [0,    -vh  ]   → DOWN  ↓
       Contacto   [0,    -2vh ]
  ──────────────────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!isDesktop) return;
    if (typeof gsap === "undefined") {
      console.warn("[spatial] GSAP not loaded");
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const SECTION_IDS = ["hero", "servicios", "contacto"];
    const TOTAL = SECTION_IDS.length; // 3

    // Compute camera position for section idx using live viewport size
    const pos = (idx) => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      return [
        [0,    0   ],  // Hero      col 0, row 0
        [-vw,  0   ],  // Servicios col 1, row 0
        [-vw,  -vh ],  // Contacto  col 1, row 1
      ][idx] || [0, 0];
    };

    // Lock body scroll; viewport is a fixed overlay
    document.body.style.overflow = "hidden";
    gsap.set(canvas, { x: 0, y: 0 });

    // Stagger-reveal elements in a section when camera arrives
    const revealSection = (id) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.querySelectorAll(".reveal:not(.in-view)").forEach((item, i) => {
        gsap.delayedCall(i * 0.07, () => item.classList.add("in-view"));
      });
    };

    revealSection("hero");
    currentIdxRef.current = 0;
    setActive("hero");

    let isAnimating = false;

    const goTo = (idx) => {
      idx = Math.max(0, Math.min(TOTAL - 1, idx));
      if (isAnimating || idx === currentIdxRef.current) return;

      const [x, y] = pos(idx);
      isAnimating = true;
      currentIdxRef.current = idx;

      gsap.to(canvas, {
        x, y,
        duration: 0.72,
        ease: "power2.inOut",
        onComplete: () => { isAnimating = false; },
      });

      setActive(SECTION_IDS[idx]);
      revealSection(SECTION_IDS[idx]);
    };

    // Expose to onNav
    goToRef.current = goTo;

    // ── Wheel ──────────────────────────────────────────────────────────────
    // Threshold 55px → medium-high sensitivity.
    // After a navigation, cooldown prevents accidental double-jump.
    const WHEEL_THRESHOLD = 55;
    let wheelAccum = 0;
    let wheelTimer = null;
    let lastNav = 0;
    const COOLDOWN = 820; // ~= animation duration + small buffer

    const onWheel = (e) => {
      e.preventDefault();
      const now = Date.now();
      if (now - lastNav < COOLDOWN) return;

      // Normalise across deltaMode (pixels / lines / pages)
      const raw = e.deltaMode === 1 ? e.deltaY * 32
                : e.deltaMode === 2 ? e.deltaY * window.innerHeight
                : e.deltaY;

      // ── En la última sección: enrutar scroll hacia la celda final ──
      // Así el usuario puede bajar al footer sin salir de la navegación.
      if (currentIdxRef.current === TOTAL - 1) {
        const finalCell = document.querySelector('.spatial-cell--final');
        if (finalCell) {
          const atBottom = finalCell.scrollTop >= finalCell.scrollHeight - finalCell.clientHeight - 4;
          const atTop    = finalCell.scrollTop <= 4;
          const goingDown = raw > 0;
          const goingUp   = raw < 0;

          if (goingDown && !atBottom) {
            finalCell.scrollBy({ top: raw * 0.6, behavior: 'smooth' });
            return;
          }
          if (goingUp && !atTop) {
            finalCell.scrollBy({ top: raw * 0.6, behavior: 'smooth' });
            return;
          }
          // Si ya está arriba y sube → navegar a sección anterior
          if (goingUp && atTop) {
            goTo(currentIdxRef.current - 1);
            lastNav = now;
            return;
          }
          // Si ya está abajo y baja → no hay más secciones, ignorar
          return;
        }
      }

      wheelAccum += raw;

      // Reset accumulator if wheel pauses (trackpad deceleration)
      clearTimeout(wheelTimer);
      wheelTimer = setTimeout(() => { wheelAccum = 0; }, 180);

      if (Math.abs(wheelAccum) >= WHEEL_THRESHOLD) {
        goTo(currentIdxRef.current + (wheelAccum > 0 ? 1 : -1));
        wheelAccum = 0;
        lastNav = now;
      }
    };

    // ── Touch (swipe) ───────────────────────────────────────────────────────
    let touchY = 0;
    const onTouchStart = (e) => { touchY = e.touches[0].clientY; };
    const onTouchEnd   = (e) => {
      const dy = touchY - e.changedTouches[0].clientY;
      if (Math.abs(dy) > 40) goTo(currentIdxRef.current + (dy > 0 ? 1 : -1));
    };

    // ── Keyboard ────────────────────────────────────────────────────────────
    const onKeyDown = (e) => {
      if (["ArrowDown", "ArrowRight", "PageDown"].includes(e.key)) {
        e.preventDefault();
        goTo(currentIdxRef.current + 1);
      }
      if (["ArrowUp", "ArrowLeft", "PageUp"].includes(e.key)) {
        e.preventDefault();
        goTo(currentIdxRef.current - 1);
      }
    };

    // ── Resize: snap canvas back to current section with new viewport size ──
    const onResize = () => {
      const [x, y] = pos(currentIdxRef.current);
      gsap.set(canvas, { x, y });
    };

    const viewport = document.getElementById("spatial-scroll-outer");
    viewport.addEventListener("wheel",      onWheel,      { passive: false });
    viewport.addEventListener("touchstart", onTouchStart, { passive: true  });
    viewport.addEventListener("touchend",   onTouchEnd,   { passive: true  });
    window.addEventListener("keydown",  onKeyDown);
    window.addEventListener("resize",   onResize);

    return () => {
      document.body.style.overflow = "";
      viewport.removeEventListener("wheel",      onWheel);
      viewport.removeEventListener("touchstart", onTouchStart);
      viewport.removeEventListener("touchend",   onTouchEnd);
      window.removeEventListener("keydown",  onKeyDown);
      window.removeEventListener("resize",   onResize);
      clearTimeout(wheelTimer);
      gsap.killTweensOf(canvas);
      goToRef.current = null;
    };
  }, [isDesktop]);

  /* ── Nav helper — works in both modes ── */
  const onNav = useCallback((id) => {
    if (isDesktopRef.current) {
      const map = { hero: 0, servicios: 1, contacto: 2 };
      const idx = map[id];
      if (idx !== undefined && goToRef.current) goToRef.current(idx);
      return;
    }
    const el = document.getElementById(id);
    if (!el) return;
    const headerH = 72;
    const top = el.getBoundingClientRect().top + window.scrollY - (id === "hero" ? 0 : headerH - 6);
    window.scrollTo({ top, behavior: "smooth" });
  }, []);

  /* ── Contact-from-modal shortcut ── */
  const handleContact = (svcId) => {
    setPresetService(svcId);
    setTimeout(() => onNav("contacto"), 50);
  };

  /* ── Apply tweaks to CSS vars ── */
  useEffect(() => {
    const r = document.documentElement;
    r.style.setProperty("--slate-600", tweaks.primary);
    r.style.setProperty("--warm-accent", tweaks.accent);

    const densityScale = { compact: 88, comfy: 120, airy: 152 };
    r.style.setProperty("--section-pad", `${densityScale[tweaks.density] || 120}px`);
    document.body.classList.toggle("density-compact", tweaks.density === "compact");
    document.body.classList.toggle("density-airy",    tweaks.density === "airy");

    const heroBgs = {
      fade:  "radial-gradient(60% 35% at 50% 85%, rgba(255,255,255,0.55), transparent 75%), linear-gradient(180deg, #ffffff 0%, #f4f7fb 18%, rgba(93,127,163,0.22) 55%, rgba(93,127,163,0.45) 82%, rgba(93,127,163,0.22) 100%)",
      light: "radial-gradient(60% 40% at 50% 70%, rgba(93,127,163,0.10), transparent 70%), linear-gradient(180deg, #ffffff 0%, #f4f7fb 100%)",
      navy:  "radial-gradient(900px 600px at 50% 90%, rgba(93,127,163,0.35), transparent 70%), linear-gradient(180deg, #1a2c44 0%, #233a59 100%)",
    };
    r.style.setProperty("--hero-bg", heroBgs[tweaks.heroBg] || heroBgs.fade);
    const heroBg = document.querySelector(".hero-bg");
    if (heroBg) heroBg.style.background = heroBgs[tweaks.heroBg] || heroBgs.fade;
    document.body.classList.toggle("hero-dark",    tweaks.heroBg === "navy");
    document.body.classList.toggle("card-flat",    tweaks.cardStyle === "flat");
    document.body.classList.toggle("card-bordered", tweaks.cardStyle === "bordered");
  }, [tweaks]);

  /* ── Render ── */
  return (
    <React.Fragment>
      {/* Fixed background image — stays behind everything while sections scroll over it */}
      <div className="global-fixed-bg" aria-hidden="true">
        <img src="hero-bg.webp" alt="" fetchpriority="high" decoding="async" />
      </div>

      <Header active={active} onNav={onNav} />

      {isDesktop ? (
        /* ────────────────────────────────────────────────────────────────
           DESKTOP: 2D spatial canvas  (5 secciones, 2 filas)
           col -1    col 0       col 1
           row 0:    Hero        Servicios
           row 1:    Contacto    Casos       Proceso
        ──────────────────────────────────────────────────────────────── */
        <div id="spatial-scroll-outer">
          <div id="spatial-canvas" ref={canvasRef}>

            {/* ── Row 0 ── */}
            <div className="spatial-cell" style={{ left: 0, top: 0 }}>
              <Hero onNav={onNav} />
            </div>
            <div className="spatial-cell" style={{ left: "100vw", top: 0 }}>
              <Services onContact={handleContact} />
            </div>

            {/* ── Row 1 ── */}
            <div className="spatial-cell spatial-cell--final"
                 style={{ left: "100vw", top: "100vh" }}>
              <MaiaContact />
              <Footer onNav={onNav} />
            </div>

          </div>{/* /spatial-canvas */}
        </div>
      ) : (
        /* ────────────────────────────────────────────────────────────────
           MOBILE (<1024px): normal vertical stack, unchanged
        ──────────────────────────────────────────────────────────────── */
        <React.Fragment>
          <main>
            <Hero onNav={onNav} />
            <Services onContact={handleContact} />
            <MaiaContact />
          </main>
          <Footer onNav={onNav} />
        </React.Fragment>
      )}

      {DevTweaks && (
        <React.Suspense fallback={null}>
          <DevTweaks tweaks={tweaks} setTweak={setTweak} />
        </React.Suspense>
      )}
    </React.Fragment>
  );
}

export default App;
