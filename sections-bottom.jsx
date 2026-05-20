/* global React, Icon, PROCESS, CASES, CLIENT_LOGOS, SERVICES */
const { useState: useStateB, useEffect: useEffectB } = React;

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

        <div className="client-logos reveal">
          {CLIENT_LOGOS.map((l, i) => {
            const marks = ["◆", "+", "▲", "◉", "⬡", "⌬"];
            return (
              <span key={l} className="trust-logo" style={{fontSize: 19}}>
                <span style={{color: "var(--slate-500)"}}>{marks[i % marks.length]}</span> {l}
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ===================== CONTACT ===================== */
function Contact({ presetService, onClearPreset }) {
  const [form, setForm] = useStateB({
    name: "", email: "", company: "", phone: "", message: "",
  });
  const [picked, setPicked] = useStateB(new Set());
  const [errors, setErrors] = useStateB({});
  const [sent, setSent] = useStateB(false);

  useEffectB(() => {
    if (presetService) {
      setPicked(prev => {
        const next = new Set(prev);
        next.add(presetService);
        return next;
      });
      onClearPreset && onClearPreset();
    }
  }, [presetService]);

  const togglePick = (id) => {
    setPicked(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const update = (key) => (e) => {
    setForm(f => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors(er => ({ ...er, [key]: null }));
  };

  const submit = (e) => {
    e.preventDefault();
    const er = {};
    if (!form.name.trim()) er.name = true;
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) er.email = true;
    if (!form.message.trim()) er.message = true;
    setErrors(er);
    if (Object.keys(er).length) return;
    setSent(true);
  };

  return (
    <section id="contacto" className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow reveal">Contacto</span>
            <h2 className="h-display h2 reveal" style={{"--delay": "60ms"}}>
              Hablemos de <em>tu proyecto</em>
            </h2>
          </div>
          <p className="lead reveal" style={{"--delay": "140ms"}}>
            Contanos qué necesitás y te respondemos en menos de 24hs con una propuesta inicial.
          </p>
        </div>

        <div className="contact-grid">
          <form className={`form reveal ${sent ? "is-sent" : ""}`} onSubmit={submit} noValidate>
            <div className="form-inner">
              <div className="form-row">
                <div className="field">
                  <label>Nombre</label>
                  <input type="text" placeholder="Tu nombre"
                    value={form.name} onChange={update("name")}
                    style={errors.name ? {borderColor: "#c87158", background: "#fff7f4"} : {}} />
                </div>
                <div className="field">
                  <label>Email</label>
                  <input type="email" placeholder="vos@empresa.com"
                    value={form.email} onChange={update("email")}
                    style={errors.email ? {borderColor: "#c87158", background: "#fff7f4"} : {}} />
                </div>
              </div>
              <div className="form-row">
                <div className="field">
                  <label>Empresa</label>
                  <input type="text" placeholder="Nombre de tu empresa"
                    value={form.company} onChange={update("company")} />
                </div>
                <div className="field">
                  <label>Teléfono / WhatsApp</label>
                  <input type="tel" placeholder="+54 9 11..."
                    value={form.phone} onChange={update("phone")} />
                </div>
              </div>

              <div className="field">
                <label>Servicios de interés</label>
                <div className="services-pick">
                  {SERVICES.map(s => (
                    <button type="button" key={s.id}
                            className={`pill ${picked.has(s.id) ? "is-on" : ""}`}
                            onClick={() => togglePick(s.id)}>
                      {picked.has(s.id) && <Icon.check/>}
                      {s.name.replace(" con alta y alojamiento", "")}
                    </button>
                  ))}
                </div>
              </div>

              <div className="field">
                <label>Contanos sobre tu proyecto</label>
                <textarea rows="4" placeholder="¿Qué problema querés resolver? ¿Hay deadlines o presupuesto en mente?"
                  value={form.message} onChange={update("message")}
                  style={errors.message ? {borderColor: "#c87158", background: "#fff7f4"} : {}}></textarea>
              </div>

              <div className="form-foot">
                <span className="form-note">Te respondemos en menos de 24hs hábiles.</span>
                <button type="submit" className="btn btn-primary">
                  Enviar consulta <Icon.arrow/>
                </button>
              </div>
            </div>

            <div className="form-sent">
              <div className="check-circle">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12l5 5L20 7"/>
                </svg>
              </div>
              <h4>Listo, {form.name.split(" ")[0] || "gracias"}.</h4>
              <p>Recibimos tu consulta y te respondemos antes de 24hs hábiles.</p>
            </div>
          </form>

          <aside className="contact-info reveal" style={{"--delay": "120ms"}}>
            <h3>Otras formas de contactarnos</h3>
            <p className="sub">Elegí el canal que prefieras.</p>

            <div className="info-item">
              <span className="info-icon"><Icon.mail/></span>
              <div>
                <span className="label">Email</span>
                <span className="val">consultora@g360ia.com.ar</span>
              </div>
            </div>
            <div className="info-item">
              <span className="info-icon"><Icon.whatsapp/></span>
              <div>
                <span className="label">WhatsApp / Teléfono</span>
                <span className="val">+54 9 11 2552-6561</span>
              </div>
            </div>
            <div className="info-item">
              <span className="info-icon"><Icon.map/></span>
              <div>
                <span className="label">Ubicación</span>
                <span className="val">Buenos Aires · Trabajamos con toda LATAM</span>
              </div>
            </div>
            <div className="info-item">
              <span className="info-icon"><Icon.clock/></span>
              <div>
                <span className="label">Horarios</span>
                <span className="val">Lun a Vie · 9 a 19h (GMT-3)</span>
              </div>
            </div>

            <div className="contact-socials">
              <a href="#" className="social-btn" aria-label="Instagram"><Icon.ig/></a>
              <a href="#" className="social-btn" aria-label="LinkedIn"><Icon.li/></a>
              <a href="#" className="social-btn" aria-label="X"><Icon.x/></a>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

/* ===================== FOOTER ===================== */
function Footer({ onNav }) {
  const year = new Date().getFullYear();
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
              <li><a href="#proceso"   onClick={(e) => go(e, "proceso")}>Proceso</a></li>
              <li><a href="#casos"     onClick={(e) => go(e, "casos")}>Casos</a></li>
              <li><a href="#contacto"  onClick={(e) => go(e, "contacto")}>Contacto</a></li>
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
          <span><a href="#" style={{marginRight: 16}}>Aviso legal</a><a href="#">Política de privacidad</a></span>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { Process, Cases, Contact, Footer });
