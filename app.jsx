/* global React, ReactDOM, Header, Hero, Services, ServiceModal, Process, Cases, Contact, Footer, TweaksPanel, useTweaks, TweakSection, TweakRadio, TweakSlider, TweakColor, TweakToggle */
const { useState, useEffect, useRef } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "primary": "#5d7fa3",
  "accent": "#e5b547",
  "heroBg": "fade",
  "cardStyle": "soft",
  "density": "comfy",
  "reveal": true
}/*EDITMODE-END*/;

function App() {
  const [active, setActive] = useState("hero");
  const [openSvc, setOpenSvc] = useState(null);
  const [presetService, setPresetService] = useState(null);
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  /* ---- scrollspy ---- */
  useEffect(() => {
    const ids = ["hero", "servicios", "proceso", "casos", "contacto"];
    const obs = new IntersectionObserver((entries) => {
      // pick the entry closest to top whose intersectionRatio > some threshold
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
  }, []);

  /* ---- reveal-on-scroll ---- */
  useEffect(() => {
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
  }, [tweaks.reveal]);

  /* ---- nav helper: smooth scroll with header offset ---- */
  const onNav = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const headerH = 72;
    const top = el.getBoundingClientRect().top + window.scrollY - (id === "hero" ? 0 : headerH - 6);
    window.scrollTo({ top, behavior: "smooth" });
  };

  /* ---- when service modal asks to contact ---- */
  const handleContact = (svcId) => {
    setPresetService(svcId);
    setTimeout(() => onNav("contacto"), 50);
  };

  /* ---- apply tweaks to CSS vars ---- */
  useEffect(() => {
    const r = document.documentElement;
    r.style.setProperty("--slate-600", tweaks.primary);
    r.style.setProperty("--warm-accent", tweaks.accent);

    // density
    const densityScale = { compact: 88, comfy: 120, airy: 152 };
    r.style.setProperty("--section-pad", `${densityScale[tweaks.density] || 120}px`);
    document.body.classList.toggle("density-compact", tweaks.density === "compact");
    document.body.classList.toggle("density-airy", tweaks.density === "airy");

    // hero bg
    const heroBgs = {
      fade: "radial-gradient(60% 35% at 50% 85%, rgba(255,255,255,0.55), transparent 75%), linear-gradient(180deg, #ffffff 0%, #f4f7fb 18%, rgba(93,127,163,0.22) 55%, rgba(93,127,163,0.45) 82%, rgba(93,127,163,0.22) 100%)",
      light: "radial-gradient(60% 40% at 50% 70%, rgba(93,127,163,0.10), transparent 70%), linear-gradient(180deg, #ffffff 0%, #f4f7fb 100%)",
      navy: "radial-gradient(900px 600px at 50% 90%, rgba(93,127,163,0.35), transparent 70%), linear-gradient(180deg, #1a2c44 0%, #233a59 100%)",
    };
    r.style.setProperty("--hero-bg", heroBgs[tweaks.heroBg] || heroBgs.fade);
    const heroBg = document.querySelector(".hero-bg");
    if (heroBg) heroBg.style.background = heroBgs[tweaks.heroBg] || heroBgs.fade;
    document.body.classList.toggle("hero-dark", tweaks.heroBg === "navy");

    // card style
    document.body.classList.toggle("card-flat", tweaks.cardStyle === "flat");
    document.body.classList.toggle("card-bordered", tweaks.cardStyle === "bordered");
  }, [tweaks]);

  return (
    <React.Fragment>
      <Header active={active} onNav={onNav} />
      <main>
        <Hero onNav={onNav} />
        <Services onOpen={setOpenSvc} />
        <Process />
        <Cases />
        <Contact presetService={presetService} onClearPreset={() => setPresetService(null)} />
      </main>
      <Footer onNav={onNav} />

      <ServiceModal
        service={openSvc}
        onClose={() => setOpenSvc(null)}
        onContact={handleContact}
      />

      <TweaksPanel title="Tweaks">
        <TweakSection label="Color">
          <TweakColor
            label="Primario"
            value={tweaks.primary}
            onChange={(v) => setTweak("primary", v)}
            options={["#5d7fa3", "#34547a", "#7e9ab8", "#1a2c44"]}
          />
          <TweakColor
            label="Acento"
            value={tweaks.accent}
            onChange={(v) => setTweak("accent", v)}
            options={["#e5b547", "#f0c870", "#5d7fa3", "#a4b8cf"]}
          />
        </TweakSection>

        <TweakSection label="Hero">
          <TweakRadio
            label="Fondo"
            value={tweaks.heroBg}
            onChange={(v) => setTweak("heroBg", v)}
            options={[
              { value: "fade", label: "Degradé" },
              { value: "light", label: "Claro" },
              { value: "navy", label: "Oscuro" },
            ]}
          />
        </TweakSection>

        <TweakSection label="Estilo">
          <TweakRadio
            label="Cards"
            value={tweaks.cardStyle}
            onChange={(v) => setTweak("cardStyle", v)}
            options={[
              { value: "soft", label: "Suaves" },
              { value: "flat", label: "Planas" },
              { value: "bordered", label: "Bordes" },
            ]}
          />
          <TweakRadio
            label="Densidad"
            value={tweaks.density}
            onChange={(v) => setTweak("density", v)}
            options={[
              { value: "compact", label: "Densa" },
              { value: "comfy", label: "Cómoda" },
              { value: "airy", label: "Amplia" },
            ]}
          />
          <TweakToggle
            label="Animaciones al hacer scroll"
            value={tweaks.reveal}
            onChange={(v) => setTweak("reveal", v)}
          />
        </TweakSection>
      </TweaksPanel>
    </React.Fragment>
  );
}

document.getElementById("seo-fallback")?.remove();
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
