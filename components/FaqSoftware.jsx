import { useState, useEffect, useRef } from 'react';

const FAQS = [
  {
    q: '¿Cuánto cuesta hacer un software o aplicación a medida?',
    a: 'Depende de lo que necesitás construir. Hay soluciones que arrancan desde el equivalente a $10 por día, y proyectos más complejos pueden escalar a varios miles de dólares. Lo primero es una reunión gratuita para entender tu caso y darte un número real — sin rodeos.',
  },
  {
    q: '¿Esto es para empresas grandes o también para pymes?',
    a: 'Para pymes, especialmente. Los sistemas a medida resuelven justo el problema que tenés vos, sin pagar por funciones que nunca vas a usar. Muchos de nuestros clientes son negocios de entre 3 y 30 personas que se hartaron de Excel, WhatsApp o herramientas genéricas.',
  },
  {
    q: '¿En qué se diferencia de usar Excel, Notion o una app ya hecha?',
    a: 'Las herramientas genéricas las adaptás vos a ellas. Un software a medida se adapta a vos. Si tu negocio tiene un proceso específico — presupuestos, turnos, seguimiento de clientes, inventario — un sistema propio lo automatiza y elimina la fricción.',
  },
  {
    q: '¿Cuánto tiempo lleva tener algo funcionando?',
    a: 'Rápido. Desde la tercera semana ya podés tener una primera versión real en tus manos para probar. No esperamos meses para mostrarte algo — construimos, te mostramos, ajustamos.',
  },
  {
    q: '¿Qué pasa si quiero cambiar algo después de que esté listo?',
    a: 'Podés pedir cambios. Trabajamos en ciclos cortos de dos semanas, así que nada queda congelado. Si el negocio cambia, el sistema puede cambiar con él.',
  },
  {
    q: '¿Necesito saber de tecnología para trabajar con ustedes?',
    a: 'No. Nuestro trabajo es entender tu negocio y traducirlo a tecnología — no al revés. Vas a ver demos, aprobar funciones y dar feedback en términos de tu operación, no de código.',
  },
  {
    q: '¿El sistema o app queda en mis manos o dependo de ustedes para siempre?',
    a: 'El sistema es tuyo. El código, la base de datos, el dominio — todo queda a tu nombre. Si algún día querés que otra persona lo continúe, puede hacerlo sin problemas.',
  },
  {
    q: '¿Le pueden sumar inteligencia artificial?',
    a: null,
    link: { href: '#ia-software', text: '¿Querés saber cómo la IA potenciaría tu software? Descubrilo acá →' },
  },
];

export default function FaqSoftware() {
  const [open, setOpen] = useState(null);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.12 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const toggle = (i) => setOpen(open === i ? null : i);

  return (
    <section className="faq-section" id="faq" data-nav-label="FAQ" ref={sectionRef}>

      {/* línea decorativa superior */}
      <div className="faq-deco-line" aria-hidden="true">
        <span className="faq-deco-dot" />
        <span className="faq-deco-seg" />
        <span className="faq-deco-label">FAQ</span>
        <span className="faq-deco-seg" />
        <span className="faq-deco-dot" />
      </div>

      <div className="container">
        <div className="faq-two-col">

          {/* ── Columna izquierda — entra desde la izquierda ── */}
          <div className={`faq-intro faq-col-left${visible ? ' faq-col--in' : ''}`}>
            <span className="eyebrow">Preguntas frecuentes</span>
            <h2 className="faq-intro-title">
              ¿Tenés dudas sobre tener tu propio sistema o app?
            </h2>
            <p className="faq-intro-desc">
              Es normal. La mayoría de las empresas que nos contactan nunca encargaron software antes. Acá respondemos lo que más nos preguntan: costos, tiempos, si es para vos, y qué pasa después.
            </p>
            <a
              href="https://wa.me/5491125526561?text=Hola%2C%20quiero%20consultar%20sobre%20desarrollo%20de%20software%20a%20medida"
              target="_blank"
              rel="noopener"
              className="faq-cta-link"
            >
              Consultanos sin compromiso →
            </a>
          </div>

          {/* ── Columna derecha — entra desde la derecha, scroll interno ── */}
          <div className={`faq-col-right${visible ? ' faq-col--in' : ''}`}>
            <div className="faq-scroll-area">
              {FAQS.map((item, i) => (
                <div key={i} className={`faq-item${open === i ? ' faq-item--open' : ''}`}>
                  <button
                    className="faq-question"
                    onClick={() => toggle(i)}
                    aria-expanded={open === i}
                  >
                    <span>{item.q}</span>
                    <span className="faq-toggle" aria-hidden="true">
                      {open === i ? '−' : '+'}
                    </span>
                  </button>
                  <div className={`faq-answer-wrap${open === i ? ' faq-answer-wrap--open' : ''}`}>
                    <div className="faq-answer">
                      {item.a && <p>{item.a}</p>}
                      {item.link && (
                        <a href={item.link.href} className="faq-answer-link">
                          {item.link.text}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* línea decorativa inferior */}
      <div className="faq-deco-line faq-deco-line--bottom" aria-hidden="true">
        <span className="faq-deco-dot" />
        <span className="faq-deco-seg" />
        <span className="faq-deco-dot" />
      </div>

    </section>
  );
}
