/* /sobre-devaffi — quién está detrás y por qué existe.
 *
 * Se llama así y no /nosotros porque vive en g360ia.com.ar: un /nosotros en
 * la raíz de ese dominio se leería como la página de Gestión 360 IA. */
import React from 'react';
import {
  Layout, Boton, Cab, JsonLd, Migas, Cierre, Icono,
  APP, WA, VET, RUTAS, SITIO, migasLd,
} from '../componentes.jsx';

const LD = [
  {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    '@id': SITIO + RUTAS.nosotros + '#page',
    url: SITIO + RUTAS.nosotros,
    name: 'Sobre Devaffi',
    description: 'Devaffi es la plataforma de afiliados para desarrolladores de Gestión 360 IA: nació para vender su propio software y se abrió para que otros developers tengan una red de venta a comisión.',
    inLanguage: 'es-AR',
    about: { '@id': SITIO + RUTAS.inicio + '#org' },
    primaryImageOfPage: { '@type': 'ImageObject', url: SITIO + '/multimedia/devaffi-marca.jpg', width: 1408, height: 768 },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Pablo Montenegro',
    jobTitle: 'Fundador de Gestión 360 IA',
    worksFor: { '@id': SITIO + '/#business' },
    sameAs: ['https://www.linkedin.com/in/pablo-montenegr0/'],
  },
  migasLd('Nosotros'),
];

const PRINCIPIOS = [
  ['ojo', 'No inflamos nada', 'Si la red tiene pocos vendedores, lo decimos. Si el catálogo tiene un producto, decimos uno. Cada número que se exagera en una página de venta se descubre el primer día en el panel.'],
  ['escudo', 'Sólo se ofrece lo que se puede vender', 'Ningún producto aparece en el catálogo antes de estar publicado y contratable. Una promesa rota el día del registro es peor que una vidriera chica.'],
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
              <h1 className="dv-h1">Nació de tener un software <span className="dv-grad-txt">y nadie que lo vendiera</span></h1>
              <p className="dv-hero-lead">
                Devaffi no empezó como una plataforma. Empezó como un problema propio: habíamos
                construido un buen sistema y no teníamos cómo ponerlo adelante de la gente que lo
                necesitaba.
              </p>
            </div>
            <figure className="dv-figura dv-rev">
              <img
                src="/multimedia/devaffi-marca.jpg"
                alt="Logo de Devaffi —dos rombos con una persona cada uno, unidos, y una flecha que sube— con el slogan «Plataforma de afiliados para desarrolladores», aplicado en tarjetas, cuadernos y en el panel en una notebook"
                width="1408" height="768" loading="eager" decoding="async"
              />
              <figcaption>Dos rombos, dos oficios: el que construye y el que vende, unidos por la misma venta.</figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="dv-sec dv-sec--suave" id="historia">
        <div className="dv-cont dv-cont--angosto">
          <div className="dv-rev">
            <span className="dv-eyebrow">La historia</span>
            <h2 className="dv-h2">Primero lo probamos con lo nuestro</h2>
            <p className="dv-lead">
              Somos <a className="dv-link" href={SITIO + '/'}>Gestión 360 IA</a>, una empresa de
              software de Buenos Aires. Construimos <a className="dv-link" href={VET} target="_blank" rel="noopener">Vet 360iA</a>,
              un sistema de gestión para veterinarias, y nos chocamos con lo mismo que le pasa a casi
              todo el software chico: el producto andaba, pero venderlo era otro oficio.
            </p>
            <p>
              Armar un equipo comercial era sueldo fijo antes de la primera venta. Lo que sí había era
              gente que ya visitaba veterinarias todas las semanas —proveedores, técnicos, contadores—
              y a la que el dueño le atendía el teléfono. Les faltaba algo bueno para ofrecer, y a
              nosotros nos faltaba quién lo ofreciera.
            </p>
            <p>
              Así que construimos el mecanismo: un link por vendedor que registra al cliente para
              siempre, una comisión sobre cada cuota que se repite mientras el cliente pague, y un panel
              donde cada uno ve cobro por cobro qué le toca. Lo probamos con nuestro propio producto
              antes de invitar a nadie.
            </p>
            <p style={{ marginBottom: 0 }}>
              <strong>Devaffi es ese mecanismo abierto a otros developers.</strong> Si a nosotros nos
              servía una red de venta a comisión, a cualquiera que haya construido un buen software por
              suscripción le sirve lo mismo. Y para el que vende, un catálogo más grande es más
              oportunidades con la misma cuenta.
            </p>
          </div>
        </div>
      </section>

      <section className="dv-sec" id="principios">
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

      <section className="dv-sec dv-sec--suave" id="quien">
        <div className="dv-cont">
          <div className="dv-split">
            <div className="dv-rev">
              <span className="dv-eyebrow">Quién está detrás</span>
              <h2 className="dv-h2">Una empresa real, con nombre y apellido</h2>
              <p className="dv-lead">
                Devaffi es un producto de <strong>Gestión 360 IA</strong>, con base en Buenos Aires,
                Argentina. La fundó <a className="dv-link" href="https://www.linkedin.com/in/pablo-montenegr0/" target="_blank" rel="noopener me">Pablo Montenegro</a>,
                que es también quien diseñó el programa.
              </p>
              <p>
                El panel, la API y la liquidación los construimos y los operamos nosotros. Cuando
                escribís, te contesta alguien del equipo.
              </p>
            </div>
            <div className="dv-caja dv-rev">
              <span className="dv-eyebrow">Hablemos</span>
              <ul className="dv-lista" style={{ marginTop: 8 }}>
                <li><strong>WhatsApp:</strong> <a className="dv-link" href={WA} target="_blank" rel="noopener">escribinos</a></li>
                <li><strong>Correo:</strong> <a className="dv-link" href="mailto:consultora@g360ia.com.ar">consultora@g360ia.com.ar</a></li>
                <li><strong>Panel:</strong> <a className="dv-link" href={APP} target="_blank" rel="noopener">app.g360ia.com.ar</a></li>
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
