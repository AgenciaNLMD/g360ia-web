/* Piezas compartidas de las páginas de Devaffi.
 *
 * Todo se prerenderiza en el build (scripts/prerender-devaffi.mjs) y después
 * se hidrata en el navegador: lo que se renderiza acá tiene que dar lo mismo en
 * Node que en el navegador. Nada de `window`, fechas ni azar durante el render. */
import React, { useState, useEffect } from 'react';

export const APP = 'https://app.devaffi.com';
export const WA = 'https://wa.me/5491125526561';

/* Contacto de Devaffi. El correo ya es del dominio propio; el teléfono es
   provisorio (el de la empresa titular) y se cambia acá, en un solo lugar. */
export const MAIL = 'contacto@devaffi.com';
export const TEL = '+54 9 11 2552-6561';
export const TEL_HREF = 'tel:+5491125526561';
export const VET = 'https://vet.g360ia.com.ar';
export const SITIO = 'https://g360ia.com.ar';

export const RUTAS = {
  inicio: '/devaffi',
  developers: '/developers',
  afiliados: '/afiliados',
  planes: '/planes',
  nosotros: '/sobre-devaffi',
  terminos: '/terminos-devaffi',
  privacidad: '/privacidad-devaffi',
  legales: '/legales-devaffi',
};

/* ── Íconos ─────────────────────────────────────────────────────────────── */
const trazo = { fill: 'none', stroke: 'currentColor', strokeLinecap: 'round', strokeLinejoin: 'round' };

export function Flecha() {
  return (
    <svg viewBox="0 0 24 24" {...trazo} strokeWidth="2.4" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
  );
}
export function Tilde() {
  return (
    <svg viewBox="0 0 24 24" {...trazo} strokeWidth="2.6" aria-hidden="true"><path d="M5 12l5 5L20 7" /></svg>
  );
}

const ICONOS = {
  codigo: 'M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16',
  personas: 'M9 11.2a3.2 3.2 0 100-6.4 3.2 3.2 0 000 6.4zM3 20a6 6 0 0112 0M16 5.5a3.2 3.2 0 010 6M18 20a6 6 0 00-3-5.2',
  negocio: 'M3 9l1.5-5h15L21 9M3 9h18v11H3zM3 9a3 3 0 006 0 3 3 0 006 0 3 3 0 006 0M9 20v-5h6v5',
  ojo: 'M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12zM12 15a3 3 0 100-6 3 3 0 000 6z',
  escudo: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z M9 12l2 2 4-4',
  enlace: 'M10 13a5 5 0 007 0l3-3a5 5 0 00-7-7l-1 1M14 11a5 5 0 00-7 0l-3 3a5 5 0 007 7l1-1',
  precio: 'M12 2v20M17 6H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6',
  llave: 'M15 7a4 4 0 11-3.9 5H8v3H5v-3H3v-3h8.1A4 4 0 0115 7z',
  red: 'M12 5a2 2 0 100-4 2 2 0 000 4zM5 21a2 2 0 100-4 2 2 0 000 4zM19 21a2 2 0 100-4 2 2 0 000 4zM12 5v6M12 11l-6 7M12 11l6 7',
  calendario: 'M4 5h16v16H4zM4 10h16M9 3v4M15 3v4',
  camion: 'M3 7h13v10H3zM16 10h3l2 3v4h-5M6.5 19.3a1.8 1.8 0 100-3.6 1.8 1.8 0 000 3.6zM17.5 19.3a1.8 1.8 0 100-3.6 1.8 1.8 0 000 3.6z',
  planilla: 'M4 3h16v18H4zM8 7h8M8 11h8M8 15h5',
  llave2: 'M14.7 6.3a4 4 0 01-5 5L4 17v3h3l5.7-5.7a4 4 0 015-5l-2.5 2.5 2.1 2.1 2.5-2.5a4 4 0 00-5.1-5.1z',
  ciclo: 'M21 12a9 9 0 01-15.5 6.2M3 12A9 9 0 0118.5 5.8M18 2v4h-4M6 22v-4h4',
  chat: 'M21 11.5a8.4 8.4 0 01-9 8.4 9 9 0 01-3.9-.9L3 20.5l1.6-4.6A8.4 8.4 0 0112 3.1a8.4 8.4 0 019 8.4z',
  diana: 'M12 21a9 9 0 100-18 9 9 0 000 18zM12 16a4 4 0 100-8 4 4 0 000 8zM12 12h.01',
  tarjeta: 'M2 5h20v14H2zM2 10h20M6 15h4',
  rayo: 'M13 2L4 14h7l-1 8 9-12h-7z',
  libro: 'M4 4h6a3 3 0 013 3v13a2 2 0 00-2-2H4zM20 4h-6a3 3 0 00-3 3v13a2 2 0 012-2h7z',
  estrella: 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z',
};

export function Icono({ n }) {
  return (
    <svg viewBox="0 0 24 24" {...trazo} strokeWidth="1.8" aria-hidden="true"><path d={ICONOS[n]} /></svg>
  );
}

/* ── Marca ──────────────────────────────────────────────────────────────────
   Redibujo en vector del isotipo: dos rombos —el que construye y el que vende—
   unidos, con la flecha que sube saliendo del primero. Liviano y nítido a
   cualquier tamaño. Si el diseñador entrega el SVG oficial, se reemplaza acá y
   cambia en todo el sitio. */

export function Isotipo({ alto = 34, id }) {
  const g = id || 'dv-iso';
  return (
    <svg width={Math.round(alto * 1.62)} height={alto} viewBox="0 0 146 90" aria-hidden="true">
      <defs>
        <linearGradient id={g} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4cc06a" />
          <stop offset=".5" stopColor="#1f8f9a" />
          <stop offset="1" stopColor="#1a4fe0" />
        </linearGradient>
      </defs>
      <g fill="none" stroke={`url(#${g})`} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M68 55 L41 82 L13 55 L41 27 L58 10" />
        <path d="M77 55 L105 27 L133 55 L105 82 L93 70" />
      </g>
      <path d="M68 1 L64.5 17 L52 5.5 Z" fill="#4cc06a" stroke="#4cc06a" strokeWidth="3" strokeLinejoin="round" />
      <path d="M57 41 L88 72" stroke="#1f8f9a" strokeWidth="4.5" strokeLinecap="round" />
      <g fill="none" stroke="#1f7f8f" strokeWidth="4" strokeLinecap="round">
        <circle cx="41" cy="49" r="6" />
        <path d="M30 66 a11 10 0 0 1 22 0" />
        <circle cx="105" cy="49" r="6" />
        <path d="M94 66 a11 10 0 0 1 22 0" />
      </g>
    </svg>
  );
}

export function Marca({ alto = 30, href = RUTAS.inicio, id }) {
  return (
    <a className="dv-marca" href={href} aria-label="Devaffi — inicio">
      <Isotipo alto={alto} id={id} />
      <span className="dv-marca-txt">DEVAFFI</span>
    </a>
  );
}

/* ── Barra ───────────────────────────────────────────────────────────────── */
const ENLACES = [
  ['developers', 'Developers'],
  ['afiliados', 'Afiliados'],
  ['planes', 'Planes'],
  ['nosotros', 'Nosotros'],
];

export function Nav({ actual }) {
  const [abierto, setAbierto] = useState(false);

  useEffect(() => {
    if (!abierto) return;
    const cerrar = () => setAbierto(false);
    const tecla = (e) => { if (e.key === 'Escape') setAbierto(false); };
    window.addEventListener('scroll', cerrar, { passive: true });
    document.addEventListener('keydown', tecla);
    return () => { window.removeEventListener('scroll', cerrar); document.removeEventListener('keydown', tecla); };
  }, [abierto]);

  const cur = (k) => (k === actual ? 'page' : undefined);

  return (
    <nav className="dv-nav" aria-label="Navegación principal">
      <div className="dv-cont">
        <div className="dv-nav-caja">
          <Marca id="dv-iso-nav" />
          <div className="dv-nav-links">
            {ENLACES.map(([k, t]) => (
              <a key={k} className="dv-nav-link" href={RUTAS[k]} aria-current={cur(k)}>{t}</a>
            ))}
          </div>
          <div className="dv-nav-acc">
            <a className="dv-btn dv-btn--texto dv-solo-ancho" href={APP} target="_blank" rel="noopener">Entrar</a>
            <a className="dv-btn dv-btn--primario dv-solo-ancho" href={APP} target="_blank" rel="noopener">Crear cuenta</a>
            <button
              type="button"
              className="dv-hamb"
              aria-label={abierto ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={abierto}
              aria-controls="dv-menu-movil"
              onClick={() => setAbierto(!abierto)}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" {...trazo} strokeWidth="2" aria-hidden="true">
                <path d={abierto ? 'M6 6l12 12M18 6L6 18' : 'M4 7h16M4 12h16M4 17h16'} />
              </svg>
            </button>
          </div>
        </div>
        <div className="dv-nav-movil" id="dv-menu-movil" hidden={!abierto}>
          <a href={RUTAS.inicio} aria-current={cur('inicio')}>Inicio</a>
          {ENLACES.map(([k, t]) => (
            <a key={k} href={RUTAS[k]} aria-current={cur(k)}>{t}</a>
          ))}
          <a href={APP} target="_blank" rel="noopener">Entrar</a>
          <a className="dv-btn dv-btn--primario" href={APP} target="_blank" rel="noopener">Crear cuenta</a>
        </div>
      </div>
    </nav>
  );
}

/* ── Pie ─────────────────────────────────────────────────────────────────── */
export function Pie() {
  return (
    <footer className="dv-pie">
      <div className="dv-cont">
        <div className="dv-pie-grid">
          <div className="dv-pie-marca">
            <Marca alto={28} id="dv-iso-pie" />
            <p className="dv-pie-slogan">Plataforma de afiliados para desarrolladores. El que construye software y el que sabe venderlo, en la misma red.</p>
          </div>
          <div>
            <h4>Plataforma</h4>
            <ul>
              <li><a href={RUTAS.developers}>Publicar mi software</a></li>
              <li><a href={RUTAS.afiliados}>Vender software</a></li>
              <li><a href={RUTAS.planes}>Planes</a></li>
              <li><a href="/docs/api">Documentación de la API</a></li>
            </ul>
          </div>
          <div>
            <h4>Devaffi</h4>
            <ul>
              <li><a href={RUTAS.nosotros}>Nosotros</a></li>
              <li><a href={WA} target="_blank" rel="noopener">WhatsApp</a></li>
              <li><a href={TEL_HREF}>{TEL}</a></li>
              <li><a href={'mailto:' + MAIL}>{MAIL}</a></li>
              <li><a href={APP} target="_blank" rel="noopener">Entrar al panel</a></li>
            </ul>
          </div>
          <div>
            <h4>Legales</h4>
            <ul>
              <li><a href={RUTAS.terminos}>Términos del programa</a></li>
              <li><a href={RUTAS.privacidad}>Privacidad</a></li>
              <li><a href={RUTAS.privacidad + '#prospeccion'}>Datos de prospección</a></li>
              <li><a href={RUTAS.legales}>Aviso legal</a></li>
            </ul>
          </div>
        </div>
        <div className="dv-pie-base">
          {/* El único lugar visible donde se nombra a Gestión 360 IA: el enlace
              le pasa señal al sitio de la empresa y deja clara la titularidad. */}
          <span>© 2026 Devaffi · Todos los derechos reservados. Devaffi es un producto de <a href={SITIO + '/'}>Gestión 360 IA</a>.</span>
          <span>Buenos Aires, Argentina</span>
        </div>
      </div>
    </footer>
  );
}

/* ── Texto con marcas mínimas ────────────────────────────────────────────────
   Las preguntas frecuentes se escriben una sola vez y salen dos veces: en
   pantalla y en el JSON-LD de FAQPage. Para eso el texto va plano con dos
   marcas —**negrita** y [texto](url)— que acá se dibujan y en `plano()` se
   borran. Así la respuesta visible y la de los datos estructurados no pueden
   decir cosas distintas. */
export function Rico({ t }) {
  const partes = [];
  const re = /\*\*(.+?)\*\*|\[(.+?)\]\((.+?)\)/g;
  let ult = 0, m, i = 0;
  while ((m = re.exec(t))) {
    if (m.index > ult) partes.push(t.slice(ult, m.index));
    if (m[1]) partes.push(<strong key={i++}>{m[1]}</strong>);
    else {
      const ext = /^https?:/.test(m[3]);
      partes.push(
        <a key={i++} className="dv-link" href={m[3]} {...(ext ? { target: '_blank', rel: 'noopener' } : {})}>{m[2]}</a>
      );
    }
    ult = re.lastIndex;
  }
  if (ult < t.length) partes.push(t.slice(ult));
  return <>{partes}</>;
}
export const plano = (t) => t.replace(/\*\*(.+?)\*\*/g, '$1').replace(/\[(.+?)\]\((.+?)\)/g, '$1');

export function JsonLd({ datos }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datos) }} />;
}

/* FAQ con <details>: el acordeón lo hace el navegador, sin estado que se
   desincronice, y el buscador del navegador abre la respuesta que coincide. */
export function Faq({ items }) {
  return (
    <div className="dv-faq">
      {items.map(({ q, a }) => (
        <details key={q}>
          <summary>{q}</summary>
          <div className="dv-faq-r">
            {a.map((p, i) => <p key={i}><Rico t={p} /></p>)}
          </div>
        </details>
      ))}
    </div>
  );
}

export function faqLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a.map(plano).join(' ') },
    })),
  };
}

export function migasLd(nombre) {
  const lista = [{ '@type': 'ListItem', position: 1, name: 'Devaffi', item: SITIO + RUTAS.inicio }];
  if (nombre) lista.push({ '@type': 'ListItem', position: 2, name: nombre });
  return { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: lista };
}

/* Bloque de intención (GEO): preguntas como las haría alguien a un buscador o
   a una IA, cada una apuntando a la sección que la responde. No es FAQPage. */
export function Geo({ items }) {
  return (
    <section className="dv-sec dv-sec--corta" id="intencion">
      <div className="dv-cont">
        <div className="dv-geo dv-rev">
          <p className="dv-geo-t">También respondemos en esta página</p>
          <ul>
            {items.map(([t, h]) => (
              <li key={t}><a href={h}><span>{t}</span><Flecha /></a></li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ── Piezas de maquetación ───────────────────────────────────────────────── */
export function Boton({ href, v = 'primario', grande, children, flecha = true }) {
  const ext = /^https?:/.test(href);
  return (
    <a
      className={`dv-btn dv-btn--${v}${grande ? ' dv-btn--grande' : ''}`}
      href={href}
      {...(ext ? { target: '_blank', rel: 'noopener' } : {})}
    >
      {children}{flecha && <Flecha />}
    </a>
  );
}

export function Cab({ eyebrow, titulo, lead, izq, children }) {
  return (
    <div className={`dv-cab dv-rev${izq ? ' dv-cab--izq' : ''}`}>
      {eyebrow && <span className="dv-eyebrow">{eyebrow}</span>}
      <h2 className="dv-h2">{titulo}</h2>
      {lead && <p className="dv-lead">{lead}</p>}
      {children}
    </div>
  );
}

export function Chips({ items }) {
  return (
    <ul className="dv-chips">
      {items.map((t) => <li key={t}><Tilde />{t}</li>)}
    </ul>
  );
}

export function Migas({ actual }) {
  return (
    <nav className="dv-migas" aria-label="Migas de pan">
      <a href={RUTAS.inicio}>Devaffi</a><span>/</span>{actual}
    </nav>
  );
}

export function Cierre({ titulo, texto, children }) {
  return (
    <section className="dv-sec" id="empezar">
      <div className="dv-cont">
        <div className="dv-cierre dv-rev">
          <h2>{titulo}</h2>
          <p>{texto}</p>
          <div className="dv-cierre-ctas">{children}</div>
        </div>
      </div>
    </section>
  );
}

/* Vista ilustrativa del panel. No lleva cifras a propósito: un monto inventado
   en una captura de venta se lee como una promesa de ingreso. */
export function Mockup() {
  return (
    <div className="dv-mock-envol dv-rev">
      <div className="dv-mock" aria-hidden="true">
        <div className="dv-mock-lado">
          <span className="dv-marca"><Isotipo alto={18} id="dv-iso-mock" /><span className="dv-marca-txt">DEVAFFI</span></span>
          <ul className="dv-mock-menu">
            <li className="is-on"><i />Inicio</li>
            <li><i />Catálogo</li>
            <li><i />Mis links</li>
            <li><i />Clientes</li>
            <li><i />Comisiones</li>
            <li><i />Liquidaciones</li>
            <li><i />Perfil</li>
          </ul>
        </div>
        <div className="dv-mock-main">
          <div className="dv-mock-top"><span className="dv-mock-buscar" /><span className="dv-mock-avatar" /></div>
          <div className="dv-mock-h">Tu panel</div>
          <div className="dv-mock-kpis">
            <div className="dv-mock-kpi"><span>Clientes activos</span><div className="dv-mock-barra"><b style={{ width: '64%' }} /></div></div>
            <div className="dv-mock-kpi"><span>Comisión del mes</span><div className="dv-mock-barra"><b style={{ width: '78%' }} /></div></div>
            <div className="dv-mock-kpi"><span>Próxima liquidación</span><div className="dv-mock-barra"><b style={{ width: '40%' }} /></div></div>
          </div>
          <div className="dv-mock-fila2">
            <div className="dv-mock-caja">
              <span>Comisión recurrente, mes a mes</span>
              <div className="dv-mock-graf">
                {[22, 30, 36, 45, 52, 60, 68, 77, 84, 92].map((h, i) => <b key={i} style={{ height: h + '%' }} />)}
              </div>
            </div>
            <div className="dv-mock-caja">
              <span>Cobros de este mes</span>
              <ul className="dv-mock-lista">
                <li><em /><i className="ok">Liquidado</i></li>
                <li><em /><i className="ok">Liquidado</i></li>
                <li><em /><i className="ok pend">Pendiente</i></li>
                <li><em /><i className="ok">Liquidado</i></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <p className="dv-mock-nota">Vista ilustrativa del panel del vendedor</p>
    </div>
  );
}

/* ── Esqueleto de cada página ────────────────────────────────────────────── */
export function Layout({ actual, children }) {
  return (
    <>
      <a className="dv-saltar" href="#contenido">Saltar al contenido</a>
      <Nav actual={actual} />
      <main id="contenido">{children}</main>
      <Pie />
    </>
  );
}
