/* /devaffi — la portada de la red.
 *
 * Qué se dice primero, y por qué en este orden:
 *
 * 1. El hero le habla al developer. Es lo que dice el slogan («plataforma de
 *    afiliados para desarrolladores») y es el lado que hace falta primero: una
 *    red de venta sin nada que vender no retiene a ningún vendedor. Pero la
 *    segunda puerta, la del que vende, está en el mismo primer pantallazo.
 * 2. Enseguida, el mecanismo entero en tres pasos —publica, vende, paga— y el
 *    reparto. Es lo que alguien necesita entender antes de elegir un lado.
 * 3. Las dos puertas, con lo que cada uno gana.
 * 4. Lo que hace distinta a esta red: reglas escritas antes de empezar.
 * 5. Dónde está esto hoy, sin inflar. Después, planes y cierre. */
import React from 'react';
import {
  Layout, Boton, Cab, Chips, Faq, faqLd, JsonLd, Mockup, Cierre, Icono, Flecha, Isotipo,
  APP, RUTAS, SITIO,
} from '../componentes.jsx';

const FAQ = [
  {
    q: '¿Qué es Devaffi?',
    a: ['Una plataforma de afiliados para software por suscripción. De un lado, quien desarrolla un sistema publica su producto en el catálogo y fija cuánto le paga al vendedor. Del otro, vendedores que conocen un rubro lo presentan con su código de referido y cobran una comisión de cada cuota que paga el negocio que trajeron, mes a mes, mientras siga suscripto.'],
  },
  {
    q: '¿Cuánto cuesta entrar?',
    a: ['Nada. Crear la cuenta es gratis para los dos lados, publicar un software no tiene costo de alta ni cuota de permanencia, y vender tampoco. Las comisiones existen sólo sobre plata que ya entró. Hay planes pagos opcionales —el Pro del vendedor y los niveles del developer— que están explicados en [Planes](/planes).'],
  },
  {
    q: '¿Por qué no publican los porcentajes de comisión?',
    a: ['Porque la comisión del vendedor no es una sola: **la define cada developer, producto por producto**, y queda publicada en su ficha del catálogo antes de que nadie tome el link. La de la plataforma, que es el costo de cobrar, está en las condiciones que cada uno acepta al registrarse y a la vista en el panel. Un número escrito en una página de venta envejece solo; el panel es el que liquida.'],
  },
  {
    q: '¿Esto es marketing multinivel?',
    a: ['No. No se gana por sumar gente debajo tuyo ni hay una pirámide de reclutados: el vendedor gana exclusivamente por los negocios que se suscriben con su link, y el developer, por los clientes que le llegan. Si nadie vende, nadie cobra.'],
  },
  {
    q: '¿Dónde se crea la cuenta?',
    a: ['En [el panel de Devaffi](https://app.devaffi.com), que es una sola puerta para los dos lados: entrás con tu cuenta de Google y el panel te muestra la cara que te corresponde —la del vendedor o la del developer—.'],
  },
  {
    q: '¿Quién está detrás de Devaffi?',
    a: ['Un equipo de Buenos Aires, Argentina, que construyó la plataforma de punta a punta: el panel, la API que verifica cada venta, los cobros y las herramientas del vendedor. La historia completa está en [Nosotros](/sobre-devaffi).'],
  },
];

const LD = [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': SITIO + RUTAS.inicio + '#org',
    name: 'Devaffi',
    url: SITIO + RUTAS.inicio,
    slogan: 'Plataforma de afiliados para desarrolladores',
    description: 'Red de venta de software por suscripción: los desarrolladores publican su producto en un catálogo y vendedores afiliados lo presentan con su código de referido, cobrando una comisión recurrente sobre cada cuota cobrada.',
    logo: SITIO + '/multimedia/devaffi-marca.jpg',
    parentOrganization: { '@id': SITIO + '/#business', name: 'Gestión 360 IA', url: SITIO + '/' },
    areaServed: { '@type': 'Country', name: 'Argentina' },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': SITIO + RUTAS.inicio + '#page',
    url: SITIO + RUTAS.inicio,
    name: 'Devaffi — Plataforma de afiliados para desarrolladores',
    inLanguage: 'es-AR',
    about: { '@id': SITIO + RUTAS.inicio + '#org' },
    significantLink: [SITIO + RUTAS.developers, SITIO + RUTAS.afiliados, SITIO + RUTAS.planes],
  },
  faqLd(FAQ),
];

export default function Inicio() {
  return (
    <Layout actual="inicio">
      {LD.map((d, i) => <JsonLd key={i} datos={d} />)}

      {/* ── 1 · HERO ── */}
      <section className="dv-hero dv-hero--centro">
        <div className="dv-cont">
          <div className="dv-hero-iso"><Isotipo alto={64} id="dv-iso-hero" /></div>
          <span className="dv-pildora"><i />Plataforma de afiliados para desarrolladores</span>
          <h1 className="dv-h1">
            Vos programás.<br /><span className="dv-grad-txt">La red sale a vender.</span>
          </h1>
          <p className="dv-hero-lead">
            Con IA cada vez más gente construye software, y casi nadie sabe venderlo. Devaffi
            conecta a quien lo construye con vendedores que ya conocen el rubro. Publicás tu producto, ellos lo presentan con su link y la comisión
            sale de cada cuota cobrada — todos los meses, mientras el cliente siga pagando.
            Nadie pone plata por adelantado.
          </p>
          <div className="dv-hero-ctas">
            <Boton href={RUTAS.developers} grande>Publicar mi software</Boton>
            <Boton href={RUTAS.afiliados} v="claro" grande>Quiero vender software</Boton>
          </div>
          <Chips items={['0 costo fijo para publicar', 'Comisión recurrente', 'Sin exclusividad', 'La comisión, a la vista antes de elegir']} />
          <Mockup />
        </div>
      </section>

      {/* ── 2 · CÓMO FUNCIONA LA RED ── */}
      <section className="dv-sec dv-sec--suave" id="como-funciona">
        <div className="dv-cont">
          <Cab
            eyebrow="Cómo funciona"
            titulo={<>Tres partes, <span className="dv-grad-txt">un mismo cobro</span></>}
            lead="El que construye, el que vende y el negocio que usa el sistema. Cada uno hace lo que sabe hacer, y la plata sale de la cuota que el negocio ya paga."
          />
          <div className="dv-flujo dv-rev">
            <article className="dv-card">
              <span className="dv-card-ico"><Icono n="codigo" /></span>
              <span className="dv-card-kick">1 · El developer</span>
              <h3 className="dv-h3">Publica su software</h3>
              <p>Carga la ficha, sus planes con los precios reales y la comisión que le paga al vendedor. Conecta su sistema a la API y entra al catálogo.</p>
            </article>
            <div className="dv-flujo-flecha" aria-hidden="true"><Flecha /></div>
            <article className="dv-card">
              <span className="dv-card-ico dv-card-ico--verde"><Icono n="personas" /></span>
              <span className="dv-card-kick">2 · El vendedor</span>
              <h3 className="dv-h3">Lo presenta con su link</h3>
              <p>Elige del catálogo lo que tiene sentido para los negocios que ya trata y lo comparte. Quien se registra desde su link queda asociado a él para siempre.</p>
            </article>
            <div className="dv-flujo-flecha" aria-hidden="true"><Flecha /></div>
            <article className="dv-card">
              <span className="dv-card-ico"><Icono n="negocio" /></span>
              <span className="dv-card-kick">3 · El negocio</span>
              <h3 className="dv-h3">Se suscribe y paga</h3>
              <p>Paga el mismo precio que pagaría sin link. Usa el software, recibe el soporte de quien lo hizo y sigue pagando mientras le sirva.</p>
            </article>
          </div>

          <div className="dv-reparto dv-rev">
            <div className="dv-reparto-item"><b>La plataforma</b><span>Lo que cuesta cobrar. Es igual para todo el catálogo y no es una participación en tu negocio.</span></div>
            <div className="dv-reparto-item"><b>El vendedor</b><span>La comisión que fija cada developer en su ficha, cobrada en cada cuota.</span></div>
            <div className="dv-reparto-item"><b>El developer</b><span>Todo el resto. El producto y el cliente siguen siendo suyos.</span></div>
          </div>
        </div>
      </section>

      {/* ── 3 · LAS DOS PUERTAS ── */}
      <section className="dv-sec" id="puertas">
        <div className="dv-cont">
          <Cab eyebrow="Elegí tu lado" titulo="¿Construís software o sabés venderlo?" />
          <div className="dv-grid dv-grid--2 dv-rev">
            <article className="dv-card dv-puerta">
              <span className="dv-card-ico"><Icono n="codigo" /></span>
              <span className="dv-card-kick">Developers</span>
              <h3 className="dv-h3">Tengo un software y nadie que lo venda</h3>
              <p>Construir y vender son dos oficios distintos. Publicalo en el catálogo y dejá que lo venda gente que ya conoce el rubro, pagando sólo cuando hay una cuota cobrada.</p>
              <ul className="dv-lista">
                <li>Publicar es gratis y <strong>sin exclusividad</strong></li>
                <li><strong>Vos elegís</strong> cuánto le pagás al vendedor</li>
                <li>El producto y el cliente <strong>siguen siendo tuyos</strong></li>
                <li>Una API documentada y un botón que la prueba solo</li>
              </ul>
              <Boton href={RUTAS.developers}>Ver cómo publicar</Boton>
            </article>
            <article className="dv-card dv-puerta dv-puerta--verde">
              <span className="dv-card-ico dv-card-ico--verde"><Icono n="precio" /></span>
              <span className="dv-card-kick">Afiliados</span>
              <h3 className="dv-h3">Conozco negocios y quiero algo bueno para ofrecerles</h3>
              <p>Elegís software del catálogo, lo compartís con tu link y cobrás un porcentaje de cada cuota — no una vez, todos los meses.</p>
              <ul className="dv-lista">
                <li><strong>Sin invertir</strong> y sin saber programar</li>
                <li>Tu link registra al cliente <strong>para siempre</strong></li>
                <li>La comisión está <strong>a la vista antes de elegir</strong></li>
                <li>Cobrás el segundo viernes de cada mes, por transferencia</li>
              </ul>
              <Boton href={RUTAS.afiliados} v="claro">Ver cómo vender</Boton>
            </article>
          </div>
        </div>
      </section>

      {/* ── 4 · POR QUÉ RECURRENTE ── */}
      <section className="dv-sec dv-sec--suave" id="recurrente">
        <div className="dv-cont">
          <div className="dv-split">
            <div className="dv-rev">
              <span className="dv-eyebrow">Por qué funciona</span>
              <h2 className="dv-h2">Una venta, <span className="dv-grad-txt">muchos cobros</span></h2>
              <p className="dv-lead">
                El software que se paga por mes cambia la cuenta para los dos lados. El vendedor
                deja de arrancar cada mes en cero: el cliente de marzo le sigue pagando en agosto y
                el de agosto se suma. El developer deja de pagar sueldos antes de la primera venta:
                el costo comercial aparece recién cuando hay una cuota cobrada.
              </p>
              <ul className="dv-lista">
                <li>El esfuerzo de una venta <strong>se cobra muchas veces</strong></li>
                <li>Un canal a comisión <strong>cuesta cero mientras no vende</strong></li>
                <li>A los dos les conviene lo mismo: <strong>clientes que se quedan</strong></li>
              </ul>
            </div>
            <div className="dv-caja dv-rev">
              <span className="dv-eyebrow">La contracara, dicha de frente</span>
              <p>
                <strong>Un cliente que da de baja deja de generar comisión.</strong> Por eso acá
                conviene vender a quien de verdad lo necesita, y publicar software que de verdad
                resuelve algo.
              </p>
              <p>
                <strong>Y una red no arregla un producto que no convence.</strong> Si nadie paga
                todavía por tu software, un canal de venta lo va a confirmar más rápido, no a
                cambiar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5 · LAS REGLAS ── */}
      <section className="dv-sec" id="reglas">
        <div className="dv-cont">
          <Cab
            eyebrow="Lo que nos hace distintos"
            titulo="Las reglas están escritas antes de empezar"
            lead="La mayoría de los acuerdos de canal se rompen por lo que nadie aclaró al principio. Acá cada regla está en el panel y en los términos, igual para todos."
          />
          <div className="dv-grid dv-grid--3 dv-rev">
            <article className="dv-card">
              <span className="dv-card-ico"><Icono n="ojo" /></span>
              <h3 className="dv-h3">La comisión, a la vista</h3>
              <p>Cada producto publica cuánto paga y cuánta plata deja por mes cada negocio, antes de que el vendedor tome el link.</p>
            </article>
            <article className="dv-card">
              <span className="dv-card-ico dv-card-ico--verde"><Icono n="calendario" /></span>
              <h3 className="dv-h3">12 meses de garantía</h3>
              <p>El porcentaje que regía cuando el cliente pagó por primera vez le queda al vendedor un año, aunque el developer lo baje después.</p>
            </article>
            <article className="dv-card">
              <span className="dv-card-ico"><Icono n="enlace" /></span>
              <h3 className="dv-h3">Atribución que no vence</h3>
              <p>El cliente que se registra con un link queda atado a ese vendedor para siempre. No depende de cookies ni de cuándo pague.</p>
            </article>
            <article className="dv-card">
              <span className="dv-card-ico dv-card-ico--verde"><Icono n="precio" /></span>
              <h3 className="dv-h3">El cliente paga lo mismo</h3>
              <p>Con link o sin link, el precio es el mismo. La comisión sale del margen de quien publica, nunca de un recargo.</p>
            </article>
            <article className="dv-card">
              <span className="dv-card-ico"><Icono n="escudo" /></span>
              <h3 className="dv-h3">Tu producto es tuyo</h3>
              <p>Corre en tu infraestructura, con tu marca, y el cliente te escribe a vos. No es una adquisición ni una sociedad.</p>
            </article>
            <article className="dv-card">
              <span className="dv-card-ico dv-card-ico--verde"><Icono n="planilla" /></span>
              <h3 className="dv-h3">Cobro por cobro</h3>
              <p>Cada uno ve en su panel qué le corresponde de cada cuota, qué está liquidado y qué está pendiente.</p>
            </article>
          </div>
        </div>
      </section>

      {/* ── 6 · DÓNDE ESTÁ ESTO HOY ── */}
      <section className="dv-sec dv-sec--suave" id="hoy">
        <div className="dv-cont">
          <div className="dv-split dv-split--arriba">
            <div className="dv-rev">
              <span className="dv-eyebrow">Dónde está esto hoy</span>
              <h2 className="dv-h2">La red está arrancando, <span className="dv-grad-txt">y lo decimos</span></h2>
              <p className="dv-lead">
                No hay cientos de vendedores ni un catálogo infinito. Hay un programa abierto, la
                liquidación funcionando y un producto publicado con el que probamos el mecanismo
                antes de invitar a nadie.
              </p>
              <p>
                Entrar temprano tiene una ventaja concreta: el developer que publica hoy es el único
                de su rubro en el catálogo, y el vendedor que se suma hoy elige antes que el resto.
              </p>
            </div>
            <div className="dv-grid dv-rev">
              <article className="dv-card">
                <span className="dv-etiqueta">Publicado</span>
                <h3 className="dv-h3">El primer software del catálogo</h3>
                <p>Un sistema de gestión por suscripción, con el programa abierto y la liquidación funcionando. Los vendedores lo ven con su ficha y su demo adentro del panel.</p>
              </article>
              <article className="dv-card">
                <span className="dv-etiqueta dv-etiqueta--gris">Entrando al catálogo</span>
                <h3 className="dv-h3">Software de otros developers</h3>
                <p>El catálogo se está abriendo a productos de otras empresas. Cada uno entra con su nombre y su comisión el día que está publicado — no antes.</p>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7 · PLANES ── */}
      <section className="dv-sec" id="planes">
        <div className="dv-cont">
          <Cab
            eyebrow="Planes"
            titulo="Empezar es gratis. Crecer, opcional."
            lead="Ni vender ni publicar cuestan nada. Lo pago suma herramientas y alcance para el que quiere ir más rápido."
          />
          <div className="dv-grid dv-grid--2 dv-rev">
            <a className="dv-card" href={RUTAS.planes + '#vendedores'}>
              <span className="dv-card-kick">Para vendedores</span>
              <h3 className="dv-h3">Free para vender. Pro para vender con volumen.</h3>
              <p>El plan gratis alcanza para vender y cobrar. El Pro suma CRM, tu WhatsApp conectado y negocios reales del rubro para contactar.</p>
              <span className="dv-card-mas">Ver planes del vendedor <Flecha /></span>
            </a>
            <a className="dv-card" href={RUTAS.planes + '#developers'}>
              <span className="dv-card-kick">Para developers</span>
              <h3 className="dv-h3">Publicar es gratis. Más vendedores, si los querés.</h3>
              <p>El nivel gratis trae un cupo de vendedores por producto. Cada nivel pago suma lugares, productos y contactos de regalo para tu red.</p>
              <span className="dv-card-mas">Ver niveles del developer <Flecha /></span>
            </a>
          </div>
        </div>
      </section>

      {/* ── 8 · PREGUNTAS ── */}
      <section className="dv-sec dv-sec--suave" id="preguntas">
        <div className="dv-cont">
          <Cab eyebrow="Preguntas frecuentes" titulo="Lo primero que pregunta todo el mundo" />
          <div className="dv-rev"><Faq items={FAQ} /></div>
        </div>
      </section>

      <Cierre
        titulo="Una sola cuenta. Elegís de qué lado entrás."
        texto="Entrás con Google en el panel y queda lista en el momento: sin entrevista, sin formularios largos, sin aprobación que esperar."
      >
        <Boton href={APP} v="blanco" grande>Crear mi cuenta</Boton>
        <Boton href={RUTAS.nosotros} v="borde-blanco" grande flecha={false}>Conocer quiénes somos</Boton>
      </Cierre>
    </Layout>
  );
}
