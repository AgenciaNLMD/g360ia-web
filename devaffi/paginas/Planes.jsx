/* /planes — qué es gratis y qué es pago, de los dos lados.
 *
 * Ningún precio, cupo ni plazo está escrito acá: los pone planes-api.jsx
 * desde app.devaffi.com/api/planes, que lee lo mismo con lo que cobra el
 * panel. Cada <Dato> trae un texto de reserva que se lee bien solo, y cada
 * <Estado> dice «Próximamente» hasta que el pago se puede hacer de verdad. */
import React from 'react';
import {
  Layout, Boton, Cab, Faq, faqLd, JsonLd, Migas, Cierre, Icono,
  APP, RUTAS, SITIO, migasLd,
} from '../componentes.jsx';
import { PlanesProvider, Dato, Estado, TablaNiveles } from '../planes-api.jsx';

const FAQ = [
  {
    q: '¿Tengo que pagar algo para vender o para publicar?',
    a: ['No. Crear la cuenta es gratis de los dos lados. El vendedor con el plan Free vende y cobra sus comisiones; el developer con el nivel gratis publica y está en el catálogo. Todo lo pago es opcional y suma herramientas o alcance.'],
  },
  {
    q: '¿Pagar un plan o un nivel cambia las comisiones?',
    a: ['No. Las dos comisiones —la de la plataforma y la que cada developer le fija al vendedor— son las mismas con plan pago o sin él. Lo que se paga son herramientas para el vendedor y acceso a más vendedores para el developer.'],
  },
  {
    q: '¿Por qué los precios están en dólares?',
    a: ['Porque lo que los sostiene —la búsqueda de negocios y los mensajes de WhatsApp— también se paga en dólares. El monto en pesos sale del dólar del día.'],
  },
  {
    q: '¿Los niveles del developer se debitan solos?',
    a: ['No. Se pagan por período, sin débito automático. Renovar suma días; cambiar de nivel pasa los días que te quedaban según lo que vale cada uno. Si no renovás, volvés al Nivel 1 sin que nadie te baje nada.'],
  },
  {
    q: '¿Qué significa «Próximamente» al lado de un plan?',
    a: ['Que ese pago todavía no se puede hacer desde el panel. La etiqueta cambia sola a «Disponible» el día que se habilita: esta página lee el estado del mismo lugar que el panel.'],
  },
  {
    q: '¿Dónde veo los precios exactos?',
    a: ['Acá mismo, que los lee del panel, y en el panel, que es el que cobra. Si alguna vez ves un número distinto en otro lado, el que vale es el del panel.'],
  },
];

const LD = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': SITIO + RUTAS.planes + '#page',
    url: SITIO + RUTAS.planes,
    name: 'Planes de Devaffi para vendedores y developers',
    description: 'Vender y publicar software en Devaffi es gratis. Planes opcionales: Pro del vendedor con CRM, WhatsApp y prospección; niveles del developer con más vendedores por producto y contactos de regalo.',
    inLanguage: 'es-AR',
    isPartOf: { '@id': SITIO + RUTAS.inicio + '#org' },
  },
  migasLd('Planes'),
  faqLd(FAQ),
];

export default function Planes() {
  return (
    <PlanesProvider>
      <Layout actual="planes">
        {LD.map((d, i) => <JsonLd key={i} datos={d} />)}

        <section className="dv-hero dv-hero--centro">
          <div className="dv-cont">
            <Migas actual="Planes" />
            <h1 className="dv-h1">Empezar es gratis. <span className="dv-grad-txt">Crecer, opcional.</span></h1>
            <p className="dv-hero-lead">
              Ni vender ni publicar cuestan nada, y las comisiones existen sólo sobre plata que ya
              entró. Lo pago suma herramientas al que vende y alcance al que publica.
            </p>
            <nav className="dv-tabs" aria-label="Elegí tu lado">
              <a href="#vendedores">Para vendedores</a>
              <a href="#developers">Para developers</a>
            </nav>
          </div>
        </section>

        <section className="dv-sec dv-sec--suave" id="vendedores">
          <div className="dv-cont">
            <Cab
              eyebrow="Para vendedores"
              titulo="Vender es gratis. Las herramientas, opcionales."
              lead="El plan Free alcanza para vender y cobrar. El Pro suma lo que hace falta para vender con volumen. Nada de esto es obligatorio para cobrar tus comisiones."
            />
            <div className="dv-grid dv-grid--2 dv-rev">
              <article className="dv-card dv-plan">
                <span className="dv-etiqueta">Disponible</span>
                <h3 className="dv-h3">Free</h3>
                <div className="dv-plan-precio">Gratis</div>
                <ul className="dv-lista">
                  <li>Un ritmo de <strong><Dato k="afi-free-semana">pocos</Dato> softwares nuevos por semana</strong>: no es un total, es un ritmo, para que nadie acapare lugares sin vender</li>
                  <li>Tu link de referido por cada software, con su QR</li>
                  <li>El panel de comisiones: qué trajiste, qué se liquidó y qué está pendiente</li>
                  <li>Cobro el segundo viernes de cada mes</li>
                </ul>
                <Boton href={APP} v="claro">Crear mi cuenta</Boton>
              </article>
              <article className="dv-card dv-plan dv-plan--pro">
                <Estado k="afi-pro" />
                <h3 className="dv-h3">Pro</h3>
                <div className="dv-plan-precio"><Dato k="afi-pro-precio">Cuota mensual</Dato></div>
                <ul className="dv-lista">
                  <li>Softwares nuevos <strong>sin tope semanal</strong></li>
                  <li><strong>CRM</strong> por software: pipeline de Nuevo a Ganado, contactos y agenda con «volver a llamar»</li>
                  <li><strong>Tu WhatsApp conectado</strong> al CRM, con tu propio número — nunca uno de la plataforma</li>
                  <li><strong>Prospección con cupo mensual</strong>: negocios reales de Google Maps, del rubro del software que vendés</li>
                  <li>Recordatorios automáticos y embudo propio, en desarrollo</li>
                </ul>
              </article>
            </div>

            <div className="dv-grid dv-grid--3 dv-rev" style={{ marginTop: 20 }}>
              <article className="dv-card">
                <Estado k="afi-paquete" />
                <h3 className="dv-h3">Paquetes de contactos</h3>
                <p><strong><Dato k="afi-paquete">Se compran por paquete</Dato></strong>, por software, eligiendo rubro y ciudad desde el CRM. Cada negocio se le asigna a <strong>un solo vendedor</strong> de toda la red: nadie más le escribe al mismo.</p>
                <p>Para comprar otro hay que haber trabajado el anterior: los contactos se gastan llamando, no guardándolos.</p>
              </article>
              <article className="dv-card">
                <Estado k="dev-niveles" />
                <h3 className="dv-h3">Contactos de regalo</h3>
                <p>Los developers que pagan un nivel le regalan <strong><Dato k="dev-regalo-por-vendedor">un paquete de</Dato> contactos</strong> a cada vendedor que toma su software: te caen al CRM sin pedir nada.</p>
                <p>Y el developer ve qué hace cada vendedor con ellos. Al que los trabaja bien le puede regalar más.</p>
              </article>
              <article className="dv-card">
                <Estado k="afi-lugar" />
                <h3 className="dv-h3">Mantener tu lugar</h3>
                <p>Cada negocio nuevo que paga te da 45 días más en ese software. Si se te está por vencer y tenés una venta en camino, lo podés sostener pagando <strong><Dato k="afi-lugar">una extensión</Dato></strong> mientras todavía lo tenés.</p>
                <p>El aviso te llega tres días antes, por correo y en la campanita del panel.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="dv-sec" id="developers">
          <div className="dv-cont">
            <Cab
              eyebrow="Para developers"
              titulo="Publicar es gratis. Más vendedores, si los querés."
              lead="No se cobra por publicar, ni por estar listado, ni una cuota por mantener la ficha. Lo que se paga no es un tablero ni un reporte: es acceso a más vendedores."
            />
            <div className="dv-split dv-split--arriba">
              <div className="dv-rev">
                <h3 className="dv-h3">Cómo funcionan los niveles</h3>
                <p>
                  El Nivel 1 es gratis y trae <Dato k="dev-nivel1-cupo">un cupo chico de</Dato> vendedores
                  por producto y <Dato k="dev-nivel1-softwares">pocos</Dato> softwares en el catálogo.
                  Cada nivel pago suma lugares y productos, y se paga cada <Dato k="dev-dias">30</Dato> días.
                </p>
                <ul className="dv-lista">
                  <li><strong>Lo elegís con una barra</strong> en «Mi nivel», dentro de tu panel</li>
                  <li><strong>Renovar suma días</strong>; cambiar de nivel pasa los días que te quedaban según lo que vale cada uno</li>
                  <li>Desde el primer nivel pago, <strong>tu ficha sale destacada</strong> y podés mandarles un aviso a los vendedores</li>
                  <li><strong>El tope es la red</strong>: no te vendemos un nivel con más vendedores de los que hay. Si no alcanza, el panel te lo dice y te sugiere el más alto posible</li>
                </ul>
              </div>
              <div className="dv-rev" style={{ minWidth: 0 }}>
                <Estado k="dev-niveles" />
                <TablaNiveles />
                <p className="dv-nota"><Dato k="dev-nivel-siguiente">Los niveles no tienen techo: los precios y los cupos de cada uno están en tu panel.</Dato></p>
              </div>
            </div>

            <div className="dv-grid dv-grid--3 dv-rev" style={{ marginTop: 32 }}>
              <article className="dv-card">
                <span className="dv-card-ico"><Icono n="personas" /></span>
                <h3 className="dv-h3">Contactos para tus vendedores</h3>
                <p>Desde el primer nivel pago, cada vendedor que toma tu software recibe <Dato k="dev-regalo-por-vendedor">un paquete de</Dato> contactos de negocios reales de tu rubro. Arranca a llamar el primer día.</p>
              </article>
              <article className="dv-card">
                <Estado k="dev-regalo" />
                <h3 className="dv-h3">Regalo al que trabaja bien</h3>
                <p>En «Mis vendedores» ves qué hace cada uno con los contactos que le financiaste. Al que los trabaja le podés regalar más, <Dato k="dev-regalo">por paquete</Dato>, y le llega el aviso.</p>
              </article>
              <article className="dv-card">
                <span className="dv-card-ico dv-card-ico--verde"><Icono n="calendario" /></span>
                <h3 className="dv-h3">Lista de espera</h3>
                <p>Si tu producto está lleno, el vendedor marca «Lo quiero vender» y vos ves cuántos esperan. Cuando subís de nivel, les llega un aviso por orden de llegada.</p>
              </article>
            </div>

            <div className="dv-caja dv-caja--tinte dv-rev" style={{ marginTop: 24 }}>
              <p>
                <strong>Lo que no cambia con ningún nivel: las dos comisiones.</strong> La de la
                plataforma, que es el costo de cobrar y es igual para todo el catálogo, y la que vos
                elegís pagarle al vendedor. Las dos existen sólo sobre plata que ya entró, y los
                porcentajes están en las condiciones que aceptás al registrarte y en tu panel.
              </p>
            </div>
          </div>
        </section>

        <section className="dv-sec dv-sec--suave" id="preguntas">
          <div className="dv-cont">
            <p className="dv-nota" style={{ textAlign: 'center', marginTop: 0, marginBottom: 32 }}>
              Los precios están en dólares y salen del panel, que es el que cobra: cambian ahí, no en esta página.
            </p>
            <Cab eyebrow="Preguntas frecuentes" titulo="Sobre lo que se paga" />
            <div className="dv-rev"><Faq items={FAQ} /></div>
          </div>
        </section>

        <Cierre
          titulo="Empezá gratis. Pagá sólo si te sirve."
          texto="Creás la cuenta con Google, en el momento. Desde el panel ves tu plan o tu nivel y lo cambiás cuando quieras."
        >
          <Boton href={APP} v="blanco" grande>Crear mi cuenta</Boton>
          <Boton href={RUTAS.inicio} v="borde-blanco" grande flecha={false}>Cómo funciona Devaffi</Boton>
        </Cierre>
      </Layout>
    </PlanesProvider>
  );
}
