/* /sobre-devaffi — quiénes somos y por qué existe.
 *
 * Se llama así y no /nosotros porque hoy vive en g360ia.com.ar: un /nosotros
 * en la raíz de ese dominio se leería como la página de la empresa.
 *
 * Devaffi se cuenta como marca propia: la empresa titular sólo se nombra en
 * el pie y en los legales (Regla 9). */
import React from 'react';
import {
  Layout, Boton, Cab, JsonLd, Migas, Cierre, Icono,
  APP, WA, MAIL, TEL, TEL_HREF, RUTAS, SITIO, migasLd,
} from '../componentes.jsx';

const LD = [
  {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    '@id': SITIO + RUTAS.nosotros + '#page',
    url: SITIO + RUTAS.nosotros,
    name: 'Sobre Devaffi',
    description: 'Devaffi es la plataforma de afiliados para desarrolladores: conecta a quien construye software y no sabe venderlo con vendedores independientes que tienen la red de contactos pero no las herramientas.',
    inLanguage: 'es-AR',
    about: { '@id': SITIO + RUTAS.inicio + '#org' },
    primaryImageOfPage: { '@type': 'ImageObject', url: SITIO + '/multimedia/devaffi-marca.jpg', width: 1408, height: 768 },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Pablo Montenegro',
    jobTitle: 'Fundador de Devaffi',
    worksFor: { '@id': SITIO + RUTAS.inicio + '#org' },
    sameAs: ['https://www.linkedin.com/in/pablo-montenegr0/'],
  },
  migasLd('Nosotros'),
];

const PRINCIPIOS = [
  ['ojo', 'No inflamos nada', 'Si la red tiene pocos vendedores, lo decimos. Si el catálogo tiene un software, decimos uno. Cada número que se exagera en una página de venta se descubre el primer día en el panel.'],
  ['escudo', 'Sólo se ofrece lo que se puede vender', 'Ningún software aparece en el catálogo antes de estar publicado y contratable. Una promesa rota el día del registro es peor que una vidriera chica.'],
  ['planilla', 'Los números viven en el panel', 'Comisiones, precios y cupos salen del mismo lugar que liquida. Por eso las páginas no los escriben a mano: un número copiado envejece solo.'],
  ['personas', 'Cada uno hace lo que sabe', 'El developer construye y da soporte, el vendedor presenta y acompaña, la plataforma cobra y reparte. Nadie tiene que hacer el trabajo del otro.'],
  ['enlace', 'Reglas iguales para todos', 'La atribución no vence, la comisión está a la vista antes de elegir y el porcentaje del primer pago se garantiza un año. Está escrito en los términos, no se negocia uno por uno.'],
  ['precio', 'Se cobra cuando se cobra', 'Ni el vendedor ni el developer ponen plata por adelantado. Todo lo que gana cada parte sale de cuotas que el negocio ya pagó.'],
];

export default function Nosotros() {
  return (
    <Layout actual="nosotros">
      {LD.map((d, i) => <JsonLd key={i} datos={d} />)}

      <section className="dv-hero">
        <div className="dv-cont">
          <div className="dv-split">
            <div>
              <Migas actual="Nosotros" />
              <span className="dv-pildora"><i />Sobre Devaffi</span>
              <h1 className="dv-h1">Con IA sobra software. <span className="dv-grad-txt">Falta quién lo venda.</span></h1>
              <p className="dv-hero-lead">
                Cada vez más gente publica software y no sabe venderlo. Del otro lado hay vendedores
                que tienen la red de contactos pero no las herramientas. Devaffi junta las dos puntas.
              </p>
            </div>
            <figure className="dv-figura dv-rev">
              <img
                src="/multimedia/devaffi-marca.jpg"
                alt="Logo de Devaffi —dos marcos unidos, con una persona cada uno, y una flecha que sube— con el slogan «Plataforma de afiliados para desarrolladores», aplicado en tarjetas, cuadernos y en el panel en una notebook"
                width="1408" height="768" loading="eager" decoding="async"
              />
              <figcaption>Dos marcos unidos en un lazo continuo: el que construye y el que vende.</figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="dv-sec dv-sec--suave" id="historia">
        <div className="dv-cont dv-cont--angosto">
          <div className="dv-rev">
            <span className="dv-eyebrow">Por qué existe</span>
            <h2 className="dv-h2">Construir y vender son dos oficios distintos</h2>
            <p className="dv-lead">
              Con las herramientas de IA, hacer un software dejó de ser el problema: hoy cualquiera
              con una buena idea puede tenerlo andando en semanas. Lo que no cambió es lo otro. Un
              software que nadie conoce se muere igual, aunque esté bien hecho.
            </p>
            <p>
              Del otro lado hay gente que conoce negocios: proveedores que visitan los mismos locales
              todas las semanas, contadores, técnicos, consultores. Tienen la confianza del dueño y
              querrían ofrecerle algo, pero no tienen qué ofrecer, ni un CRM, ni forma de prospectar
              con volumen.
            </p>
            <p style={{ marginBottom: 0 }}>
              <strong>Devaffi conecta a los dos.</strong> El developer publica su software y fija la
              comisión. El vendedor lo presenta con su link y cobra por cada negocio que se suscribe.
              Y una API propia verifica y paga cada venta sola, para que nadie dependa de la palabra
              del otro.
            </p>
          </div>
        </div>
      </section>

      <section className="dv-sec" id="nombre">
        <div className="dv-cont">
          <div className="dv-split">
            <div className="dv-rev">
              <span className="dv-eyebrow">El nombre</span>
              <h2 className="dv-h2"><span className="dv-grad-txt">Dev</span> + <span className="dv-grad-txt">Affi</span></h2>
              <p className="dv-lead">
                Developers y afiliados: las dos puntas que la plataforma conecta. El logo las muestra
                como dos marcos unidos en un lazo continuo, cruzados por la conexión que verifica cada
                venta y con una flecha de crecimiento.
              </p>
              <p style={{ marginBottom: 0 }}>
                El degradé de verde a azul junta las dos cosas que se mueven acá: plata y tecnología.
              </p>
            </div>
            <div className="dv-caja dv-caja--tinte dv-rev">
              <span className="dv-eyebrow">Qué hay construido</span>
              <ul className="dv-lista" style={{ marginTop: 8 }}>
                <li>Alta autogestionada para vendedores y developers, con un solo login</li>
                <li>Una API versionada y documentada, con prueba automática de la conexión</li>
                <li>Verificación diaria de cada cuenta que trajo un vendedor</li>
                <li>Cobros con medios de pago locales</li>
                <li>CRM del vendedor, con su WhatsApp conectado y prospección de negocios</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="dv-sec dv-sec--suave" id="principios">
        <div className="dv-cont">
          <Cab
            eyebrow="Cómo decidimos"
            titulo="Seis principios que no se negocian"
            lead="Una red de venta funciona con confianza, y la confianza se pierde una sola vez. Estas son las reglas con las que tomamos cada decisión."
          />
          <div className="dv-grid dv-grid--3 dv-rev">
            {PRINCIPIOS.map(([ic, t, p], i) => (
              <article className="dv-card" key={t}>
                <span className={'dv-card-ico' + (i % 2 ? ' dv-card-ico--verde' : '')}><Icono n={ic} /></span>
                <h3 className="dv-h3">{t}</h3>
                <p>{p}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="dv-sec" id="quien">
        <div className="dv-cont">
          <div className="dv-split">
            <div className="dv-rev">
              <span className="dv-eyebrow">Quién está detrás</span>
              <h2 className="dv-h2">Hecho en Buenos Aires, con nombre y apellido</h2>
              <p className="dv-lead">
                Devaffi lo construyó de punta a punta{' '}
                <a className="dv-link" href="https://www.linkedin.com/in/pablo-montenegr0/" target="_blank" rel="noopener me">Pablo Montenegro</a>:
                la plataforma, la API de integración, los pagos y el CRM.
              </p>
              <p>
                Arrancamos en Argentina y, desde acá, vamos a sumar el resto de Latinoamérica. Cuando
                escribís, te contesta alguien del equipo.
              </p>
            </div>
            <div className="dv-caja dv-rev">
              <span className="dv-eyebrow">Hablemos</span>
              <ul className="dv-lista" style={{ marginTop: 8 }}>
                <li><strong>WhatsApp:</strong> <a className="dv-link" href={WA} target="_blank" rel="noopener">escribinos</a></li>
                <li><strong>Teléfono:</strong> <a className="dv-link" href={TEL_HREF}>{TEL}</a></li>
                <li><strong>Correo:</strong> <a className="dv-link" href={'mailto:' + MAIL}>{MAIL}</a></li>
                <li><strong>Panel:</strong> <a className="dv-link" href={APP} target="_blank" rel="noopener">entrar a Devaffi</a></li>
                <li><strong>Developers:</strong> <a className="dv-link" href="/docs/api">documentación de la API</a></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Cierre
        titulo="Si construís software o sabés venderlo, hay lugar"
        texto="Elegí tu lado y empezá hoy. La cuenta se crea con Google y queda lista en el momento."
      >
        <Boton href={RUTAS.developers} v="blanco" grande>Publicar mi software</Boton>
        <Boton href={RUTAS.afiliados} v="borde-blanco" grande>Quiero vender software</Boton>
      </Cierre>
    </Layout>
  );
}
