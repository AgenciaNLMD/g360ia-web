import React, { useState, useEffect, useRef } from 'react';
import { Icon, SERVICES, PUERTAS, COMISION_PCT } from './data.jsx';

/* ===========================================================================
   LA HOME — sistema claro, scroll vertical
   ===========================================================================
   Reemplaza al canvas espacial de GSAP y al bento de servicios. El canvas
   obligaba a que cada sección midiera exactamente 100vw × 100vh, y eso era lo
   que apretaba todo: para que ocho tarjetas entraran en una pantalla de
   teléfono había que bajar las descripciones a 10,5px. Acá cada sección mide
   lo que mide su contenido y se distingue de la anterior por el fondo.

   El orden alterna a propósito:
     hero (oscuro, con la foto) → cifras (blanco) → puertas (gris) →
     servicios (blanco) → software (gris) → afiliados (crema) →
     contacto (oscuro) → pie

   Ninguna sección repite el fondo de la que tiene al lado, que es lo que hace
   que se lea dónde empieza cada una sin una sola línea divisoria.
   =========================================================================== */

/* Flecha, que aparece en casi todos los botones y enlaces. */
const Flecha = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"
       strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const Tilde = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"
       strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12l5 5L20 7" />
  </svg>
);

/* ===========================================================================
   REVELAR — entrada al scroll
   Un solo observador para toda la página en vez de uno por sección: son ocho
   secciones y cada observador propio es un listener más corriendo todo el
   tiempo para algo que pasa una vez.
   =========================================================================== */
function useRevelar() {
  useEffect(() => {
    const items = document.querySelectorAll('.g-rev');
    if (!items.length) return;

    /* Sin soporte, o con animaciones reducidas, todo visible de entrada. */
    const quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (quieto || !('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('is-in'));
      return;
    }

    const obs = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add('is-in');
          obs.unobserve(e.target); /* una vez y listo */
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.08 },
    );
    items.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

/* ===========================================================================
   BARRA SUPERIOR
   Transparente sobre el hero y blanca al bajar. El umbral no es un número
   fijo: es el alto del hero menos la barra, así que el cambio pasa justo
   cuando el fondo de atrás deja de ser la foto.
   =========================================================================== */
const ENLACES = [
  { texto: 'Servicios',  href: '/servicios' },
  { texto: 'Software',   href: '/software' },
  { texto: 'Afiliados',  href: '/afiliados' },
  { texto: 'Developers', href: '/developers' },
  { texto: 'Blog',       href: '/blog/' },
];

function Nav() {
  const [solida, setSolida] = useState(false);
  const [abierto, setAbierto] = useState(false);

  useEffect(() => {
    const alCambiar = () => {
      const hero = document.querySelector('.g-hero');
      const umbral = hero ? hero.offsetHeight - 80 : 400;
      setSolida(window.scrollY > umbral);
    };
    alCambiar();
    window.addEventListener('scroll', alCambiar, { passive: true });
    window.addEventListener('resize', alCambiar);
    return () => {
      window.removeEventListener('scroll', alCambiar);
      window.removeEventListener('resize', alCambiar);
    };
  }, []);

  /* El menú de celular se cierra al scrollear: quedó abierto tapando la página
     es el error más común de una hoja desplegable. */
  useEffect(() => {
    if (!abierto) return;
    const cerrar = () => setAbierto(false);
    window.addEventListener('scroll', cerrar, { passive: true });
    return () => window.removeEventListener('scroll', cerrar);
  }, [abierto]);

  return (
    <nav className={`g-nav${solida || abierto ? ' is-solida' : ''}`} aria-label="Navegación principal">
      <div className="g-contenedor">
        <div className="g-nav-caja">
          <a href="/" className="g-marca">
            <img src="/logo.webp" alt="" width="34" height="34" />
            <span className="g-marca-txt">
              Gestion<span className="num">360</span><span className="ia">.iA</span>
            </span>
          </a>

          <div className="g-nav-links">
            {ENLACES.map((e) => (
              <a key={e.href} className="g-nav-link" href={e.href}>{e.texto}</a>
            ))}
          </div>

          <div className="g-nav-acciones">
            <a className="g-btn g-btn--primario" href="https://wa.me/5491125526561"
               target="_blank" rel="noopener">
              Hablemos <Flecha />
            </a>
            <button
              className="g-hamb"
              aria-label={abierto ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={abierto}
              onClick={() => setAbierto((a) => !a)}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                {abierto
                  ? <path d="M18 6L6 18M6 6l12 12" />
                  : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </div>
        </div>

        {abierto && (
          <div className="g-nav-movil">
            {ENLACES.map((e) => (
              <a key={e.href} href={e.href} onClick={() => setAbierto(false)}>{e.texto}</a>
            ))}
            <a className="g-btn g-btn--primario" href="https://wa.me/5491125526561"
               target="_blank" rel="noopener">
              Hablemos por WhatsApp <Flecha />
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}

/* ===========================================================================
   HERO
   La foto del fondo no la dibuja este componente: vive en index.html, fuera de
   #root, para que el navegador la descubra en el primer parseo. Es el elemento
   LCP, y esperarla a que React monte costaba medio segundo de nada.
   =========================================================================== */
function Hero() {
  return (
    <section className="g-hero" id="inicio">
      <div className="g-contenedor">
        <div className="g-hero-inner">
          <span className="g-eyebrow">Consultora de IA · Buenos Aires · LATAM</span>
          <h1 className="g-h1">
            Transformamos tu negocio<br />
            con <em>Inteligencia Artificial</em>
          </h1>
          <p className="g-hero-lead">
            Hacemos tres cosas: resolvemos a medida lo que tu negocio necesita, publicamos
            software de gestión listo para usar, y le pagamos comisión a quien lo venda.
            Elegí por dónde empezar.
          </p>
          <div className="g-hero-ctas">
            <a className="g-btn g-btn--primario g-btn--grande" href="#puertas">
              Ver por dónde empezar <Flecha />
            </a>
            <a className="g-btn g-btn--fantasma g-btn--grande" href="/software">
              Conocé nuestro software
            </a>
          </div>
          <p className="g-hero-nota">
            <span><Tilde /> Diagnóstico inicial sin costo</span>
            <span><Tilde /> +24 empresas en LATAM</span>
            <span><Tilde /> Respondemos el mismo día</span>
          </p>
        </div>
      </div>

      {/* La onda: lo que despega el bloque oscuro del blanco de abajo sin una
          línea dura de por medio. */}
      <svg className="g-onda" viewBox="0 0 1440 64" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0,40 C240,8 480,8 720,28 C960,48 1200,58 1440,34 L1440,64 L0,64 Z" />
      </svg>
    </section>
  );
}

/* ===========================================================================
   CIFRAS
   Cuatro números y nada más. Van pegados al hero porque es donde alguien
   decide si el sitio le habla a él: resumen las tres patas del negocio antes
   de que tenga que leer una sección entera para descubrirlas.
   =========================================================================== */
const CIFRAS = [
  { n: '+24', t: 'empresas acompañadas en Argentina y LATAM' },
  { n: '10',  t: 'servicios que se integran entre sí' },
  { n: '1',   t: 'software propio publicado, y las verticales que vienen' },
  { n: COMISION_PCT + '%', t: 'de comisión recurrente para quien lo venda' },
];

function Cifras() {
  return (
    <section className="g-sec g-sec--corta">
      <div className="g-contenedor">
        <div className="g-cifras">
          {CIFRAS.map((c, i) => (
            <div key={c.n} className="g-rev" style={{ '--g-delay': i * 80 + 'ms' }}>
              <div className="g-cifra-n">{c.n}</div>
              <p className="g-cifra-t">{c.t}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===========================================================================
   LAS TRES PUERTAS
   La home pregunta a qué viniste en vez de mostrarle las tres cosas enteras a
   todo el mundo: son tres embudos distintos para tres personas distintas, y
   meterlos en el mismo scroll era lo que la tenía cargada.
   =========================================================================== */
function Puertas() {
  return (
    <section className="g-sec g-sec--soft" id="puertas">
      <div className="g-contenedor">
        <div className="g-cab g-rev">
          <span className="g-eyebrow">Por dónde empezar</span>
          <h2 className="g-h2">¿A qué viniste?</h2>
          <p className="g-lead g-lead--centro">
            Hacemos tres cosas distintas para tres personas distintas.
            Elegí la tuya y te llevamos derecho.
          </p>
        </div>

        <div className="g-grid g-grid--3">
          {PUERTAS.map((p, i) => {
            const Ico = Icon[p.icon];
            return (
              <a key={p.id} href={p.href} className="g-card g-card--puerta g-rev"
                 style={{ '--g-delay': 100 + i * 90 + 'ms' }}>
                <span className="g-card-ico" aria-hidden="true"><Ico /></span>
                <span className="g-card-kick">{p.kicker}</span>
                <h3 className="g-card-t">{p.titulo}</h3>
                <p className="g-card-p">{p.desc}</p>
                <span className="g-card-mas">{p.accion} <Flecha /></span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ===========================================================================
   SERVICIOS
   Ocho tarjetas que enlazan. Antes había acá un bento con overlay animado que
   mostraba un resumen de lo que ya cuenta cada página de servicio; el usuario
   leía el resumen y después igual tenía que clickear para llegar a la página
   real. Ahora la tarjeta es el enlace.
   =========================================================================== */
function Servicios() {
  return (
    <section className="g-sec" id="servicios">
      <div className="g-contenedor">
        <div className="g-cab g-rev">
          <span className="g-eyebrow">Servicios</span>
          <h2 className="g-h2">Todo lo que tu negocio necesita, <em>en un solo lugar</em></h2>
          <p className="g-lead g-lead--centro">
            Cada servicio resuelve un problema concreto y se conecta con el que sigue:
            el sitio captura, la campaña trae tráfico, el bot atiende y el software
            sostiene la operación.
          </p>
        </div>

        <div className="g-grid g-grid--4">
          {SERVICES.map((s, i) => {
            const Ico = Icon[s.icon];
            return (
              <a key={s.id} href={s.page} className="g-card g-rev"
                 style={{ '--g-delay': 60 + (i % 4) * 70 + 'ms' }}>
                <span className="g-card-ico" aria-hidden="true"><Ico /></span>
                <span className="g-card-kick">{s.tag}</span>
                <h3 className="g-card-t">{s.name}</h3>
                <p className="g-card-p">{s.tagline}</p>
                <span className="g-card-mas">Ver el servicio <Flecha /></span>
              </a>
            );
          })}
        </div>

        <div className="g-cierre g-rev">
          <a className="g-btn g-btn--linea" href="/servicios">
            Ver los diez servicios en detalle <Flecha />
          </a>
        </div>
      </div>
    </section>
  );
}

/* ===========================================================================
   SOFTWARE PROPIO
   La captura va en un marco de ventana y no suelta: es el detalle que hace
   que se lea como un sistema de verdad y no como una imagen pegada.
   =========================================================================== */
function Software() {
  return (
    <section className="g-sec g-sec--soft" id="software">
      <div className="g-contenedor">
        <div className="g-split g-split--ancha">
          <div className="g-rev">
            <span className="g-eyebrow">Software propio</span>
            <h2 className="g-h2">Sistemas que <em>ya existen</em> y podés usar mañana</h2>
            <p className="g-lead" style={{ marginBottom: 24 }}>
              Mandar a hacer un sistema a medida cuesta meses y varios miles de dólares.
              Si tu rubro ya tiene uno construido, contratarlo es una cuota mensual y
              una tarde de configuración.
            </p>
            <ul className="g-lista">
              <li><strong>Vet 360iA</strong>, para veterinarias: agenda, historia clínica, facturación, inventario y un bot de WhatsApp que atiende solo</li>
              <li>Se usa desde el navegador, <strong>sin instalar nada</strong> y sin servidor que comprar</li>
              <li><strong>Sin permanencia:</strong> cuota mensual o anual, y el anual sale diez meses</li>
            </ul>
            <div className="g-hero-ctas" style={{ marginTop: 28 }}>
              <a className="g-btn g-btn--primario" href="https://vet.g360ia.com.ar"
                 target="_blank" rel="noopener">
                Ir a Vet 360iA <Flecha />
              </a>
              <a className="g-btn g-btn--linea" href="/software">Ver el catálogo</a>
            </div>
          </div>

          <div className="g-rev" style={{ '--g-delay': '140ms' }}>
            <figure className="g-marco" style={{ margin: 0 }}>
              <div className="g-marco-barra" aria-hidden="true">
                <span className="g-marco-punto" />
                <span className="g-marco-punto" />
                <span className="g-marco-punto" />
                <span className="g-marco-url">vet.g360ia.com.ar/panel</span>
              </div>
              <img
                src="/portfolio/vet360ia/dashboard.webp"
                width="1280" height="720" loading="lazy" decoding="async"
                alt="Panel de Vet 360iA con los turnos del día, la facturación de la jornada y los avisos pendientes de la veterinaria"
              />
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ===========================================================================
   AFILIADOS
   Va sobre el crema y no sobre el navy a propósito: la sección de contacto que
   viene abajo ya es oscura, y dos bandas oscuras seguidas borran el corte
   entre las dos.
   =========================================================================== */
function Afiliados() {
  return (
    <section className="g-sec g-sec--warm" id="afiliados">
      <div className="g-contenedor">
        <div className="g-split">
          <div className="g-rev">
            <span className="g-eyebrow">Programa de afiliados</span>
            <h2 className="g-h2">¿Y si en vez de comprarlo <em>lo vendés</em>?</h2>
            <p className="g-lead" style={{ marginBottom: 24 }}>
              Si ya tratás con negocios de un rubro —porque les vendés insumos, les llevás
              la contabilidad o simplemente los conocés— podés presentarles los sistemas del
              catálogo con tu código y cobrar una comisión de cada cuota que paguen.
            </p>
            <div className="g-hero-ctas">
              <a className="g-btn g-btn--primario" href="/afiliados">
                Cómo funciona el programa <Flecha />
              </a>
            </div>
          </div>

          <div className="g-cinta g-rev" style={{ '--g-delay': '120ms' }}>
            <div className="g-cinta-n">{COMISION_PCT}%</div>
            <p className="g-cinta-t">
              <strong>de cada pago, todos los meses.</strong> No es una comisión por la
              primera venta: se repite mientras el cliente que trajiste siga usando el
              sistema. Sin techo, sin plazo y sin cupo mínimo.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ===========================================================================
   CONTACTO
   ===========================================================================
   Reemplaza a la sección MAIA, que se fue el 15-sep-2026. Aquella tenía un
   canvas de partículas con su propio requestAnimationFrame corriendo siempre,
   un degradado que seguía al cursor recalculado en cada mousemove, y una
   maqueta animada de conversación. Tres animaciones permanentes para mostrar
   un teléfono y un mail.

   Lo que queda es la información y nada más. La sección conserva el id
   `contacto` porque hay enlaces /#contacto vivos en las dos páginas legales
   y en /servicios/seo.
   =========================================================================== */
const VIAS = [
  {
    icono: 'whatsapp',
    etiqueta: 'WhatsApp',
    valor: '+54 9 11 2552-6561',
    href: 'https://wa.me/5491125526561',
    nota: 'Lo más rápido — respondemos el mismo día',
  },
  {
    icono: 'mail',
    etiqueta: 'Email',
    valor: 'consultora@g360ia.com.ar',
    href: 'mailto:consultora@g360ia.com.ar',
    nota: 'Para propuestas y documentación',
  },
  {
    icono: 'map',
    etiqueta: 'Dónde estamos',
    valor: 'Buenos Aires, Argentina',
    href: null,
    nota: 'Trabajamos con toda LATAM, en remoto',
  },
];

function Contacto() {
  return (
    <section className="g-sec g-sec--dark" id="contacto">
      <div className="g-contenedor">
        <div className="g-cab g-rev">
          <span className="g-eyebrow">Contacto</span>
          <h2 className="g-h2">Contanos qué necesita <em>tu negocio</em></h2>
          <p className="g-lead">
            El primer diagnóstico no se cobra: escribinos qué estás tratando de resolver
            y te decimos si lo nuestro sirve para eso o no.
          </p>
        </div>

        <div className="g-vias g-rev" style={{ '--g-delay': '90ms' }}>
          {VIAS.map((v, i) => {
            const Ico = Icon[v.icono];
            const dentro = (
              <React.Fragment>
                <span className="g-via-ico" aria-hidden="true"><Ico /></span>
                <span className="g-via-et">{v.etiqueta}</span>
                <span className="g-via-val">{v.valor}</span>
                <span className="g-via-nota">{v.nota}</span>
              </React.Fragment>
            );
            return v.href
              ? <a key={i} className="g-via" href={v.href}
                   target={v.href.startsWith('http') ? '_blank' : undefined}
                   rel={v.href.startsWith('http') ? 'noopener' : undefined}>{dentro}</a>
              : <div key={i} className="g-via">{dentro}</div>;
          })}
        </div>

        <div className="g-cierre g-rev" style={{ '--g-delay': '160ms' }}>
          <a className="g-btn g-btn--primario g-btn--grande" href="https://wa.me/5491125526561"
             target="_blank" rel="noopener">
            Escribinos por WhatsApp <Flecha />
          </a>
        </div>
      </div>
    </section>
  );
}

export { Nav, Hero, Cifras, Puertas, Servicios, Software, Afiliados, Contacto, useRevelar, Flecha };
