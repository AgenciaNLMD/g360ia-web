/* /developers — la red vista por el que construye el software.
 *
 * Otra cara de /afiliados: mismo mecanismo, mismo vocabulario. No se declara
 * ninguna Offer ni ningún precio, y ningún porcentaje del reparto (CLAUDE.md,
 * Regla 6). El contrato técnico vive en /docs/api. */
import React from 'react';
import {
  Layout, Boton, Cab, Chips, Faq, faqLd, JsonLd, Geo, Migas, Cierre, Icono,
  APP, RUTAS, SITIO, migasLd,
} from '../componentes.jsx';

const URL = SITIO + RUTAS.developers;

const FAQ = [
  {
    q: '¿Cuánto cuesta publicar mi software en el catálogo?',
    a: ['Nada por adelantado. No se cobra por publicar, ni por estar listado, ni una cuota por mantener la ficha. El costo son dos comisiones, y las dos existen sólo sobre plata que ya entró: **la de la plataforma** —lo que cuesta cobrar— y **la que vos elegís pagarle al vendedor**. Los dos porcentajes están en las condiciones que aceptás al registrarte y a la vista en tu panel. Si nadie vende tu producto, no pagás nada. Aparte están los [niveles pagos](/planes#developers), opcionales, que amplían el cupo de vendedores por producto; no hacen falta para estar publicado.'],
  },
  {
    q: '¿Pierdo el control de mi producto o de mis clientes?',
    a: ['El producto es tuyo y corre en tu infraestructura: no lo alojamos, no lo tocamos y no entramos en tus decisiones. El cliente usa tu software con tu marca y te escribe a vos cuando algo no anda. El cobro puede pasar por nuestro checkout o seguir en el tuyo: si cobrás vos, la comisión del vendedor sale de tu saldo prepago y la API nos dice en qué plan está cada cuenta, así nadie depende de la buena fe del otro. No es una adquisición ni una sociedad.'],
  },
  {
    q: '¿Hay exclusividad?',
    a: ['No. Podés seguir vendiendo por tu cuenta, tener otros canales, otros revendedores y tu propio equipo comercial. La red es una fuente más de clientes, no un reemplazo de las que ya tengas.'],
  },
  {
    q: '¿Qué comisión tengo que pagar?',
    a: [
      'Dos comisiones distintas. **La de la plataforma no se negocia**: es lo que cuesta mover la plata, no una participación en tu negocio, y es la misma para todo el catálogo. La otra es **la del vendedor, que la elegís vos**, con un techo, y que queda publicada en tu ficha. El resto es tuyo. Los dos números están en las condiciones que aceptás al registrarte y en tu panel: acá no se publican, porque un porcentaje escrito en una página de venta envejece solo y termina contradiciendo al panel, que es el que liquida.',
      'Podés cambiarla hasta dos veces cada 30 días, y cada cambio se les avisa a los vendedores que tengan tu producto tomado. Lo que no podés es bajársela a un cliente que ya está pagando: **el porcentaje que regía cuando ese cliente pagó por primera vez le vale un año** a quien lo trajo. Si la subís, la suba entra enseguida y arranca un año nuevo.',
    ],
  },
  {
    q: '¿Cuánta comisión conviene poner?',
    a: [
      'La que te cierre contra tu alternativa real. Un vendedor propio son meses de sueldo fijo antes de la primera venta y el riesgo es tuyo; acá el costo existe sólo sobre plata que ya entró. Si tu producto se vende solo, este canal no te conviene y lo vas a ver en los números antes de cargar nada.',
      'El número igual no lo elegís a ciegas: al cargarlo te mostramos **el promedio y el máximo que paga tu rubro**. Poner por debajo del promedio no está prohibido, pero tu ficha va a quedar última en una vidriera donde el vendedor compara cuánto le deja cada producto por mes.',
    ],
  },
  {
    q: '¿Cuánto tarda en publicarse mi producto?',
    a: ['Se publica en el momento: el producto queda en revisión y recibís tus credenciales de API. Entra al catálogo cuando aprobamos la ficha y tu sistema ya está conectado —nos avisa las altas y contesta la consulta diaria de estado—. No hace falta esperar a nadie para saber si anda: el botón **Probar API** de tu panel te lo dice en el momento.'],
  },
  {
    q: '¿Hay algo más que pueda pagar, además de la comisión?',
    a: [
      'Dos, y las dos opcionales. Los **niveles pagos**, que se pagan cada 30 días sin débito automático: cada nivel suma lugares de vendedores por producto y productos en el catálogo, y desde el primer nivel pago cada vendedor que toma tu producto recibe contactos de regalo para prospectar, tu ficha sale destacada y podés mandarles un aviso a los vendedores. Y el **regalo de contactos** a un vendedor puntual: en tu panel ves qué hace cada uno con los que ya tiene, y al que los trabaja bien le podés sumar más.',
      'Publicar y estar en el catálogo no cuesta nada: el nivel gratis arranca con un cupo chico de vendedores por producto y alcanza para empezar.',
    ],
  },
  {
    q: '¿Cómo se registra que un cliente vino de un afiliado?',
    a: [
      'El link del afiliado pasa primero por un redirect nuestro, que **genera un identificador de esa visita** y recién ahí manda a la persona a tu sitio. Vos lo recibís en la URL, lo guardás junto a la cuenta cuando esa persona se registra y nos lo informás por la API: un campo de texto y una llamada al crear el usuario.',
      'Ese identificador **queda atado a esa cuenta para siempre** y es lo que hace que no haya nada que discutir después. El día que esa cuenta pase de tu plan gratis al pago —dentro de tu sistema, meses después, sin pasar por ninguna pantalla nuestra— lo vemos igual, y el vendedor que la trajo cobra.',
    ],
  },
  {
    q: '¿Qué pasa si mi servidor está caído justo cuando alguien paga?',
    a: ['El cobro no depende de vos, así que la venta no se pierde. El aviso para activar el plan se encola y se reintenta hasta que tu sistema conteste. Va con una clave de idempotencia, así que si el aviso llega dos veces —porque reintentamos y la primera en realidad había entrado— el plan se activa una sola vez y no queda ningún duplicado.'],
  },
  {
    q: '¿Cuánto trabajo de integración es esto para mí?',
    a: ['Un campo de texto en tu tabla de cuentas y cuatro puntos de contacto con nuestra API: avisar las altas, avisar los cambios de plan, una ruta que conteste en qué plan está una cuenta y, opcional, un webhook que active el plan cuando cobramos nosotros. Está todo en la [documentación de la API](/docs/api), y el panel te arma el pedido completo, con tus credenciales y tus planes adentro, para tu asistente de código. Con **Probar API** ves en el momento qué anda y qué falta.'],
  },
  {
    q: '¿Qué tan grande es la red de afiliados hoy?',
    a: ['Está arrancando. El programa está abierto, la liquidación funciona y hay un producto publicado, que es Vet 360iA. No hay una red de cientos de vendedores y decirlo sería mentir: el que entra hoy entra temprano, con la ventaja y el riesgo que eso significa.'],
  },
  {
    q: '¿Ustedes me construyen el software?',
    a: ['Eso es otra cosa: [desarrollo a medida](/servicios/desarrollo-software), que hace Gestión 360 IA y se cotiza aparte. Devaffi es para software que ya existe y funciona. Si lo que tenés es una idea sin construir, el camino es el de desarrollo y no el del catálogo.'],
  },
  {
    q: '¿Puede entrar un software que compite con uno que ya está?',
    a: ['Se conversa. Si resuelve el mismo rubro que un producto propio de Gestión 360 IA, lo honesto es decirlo de frente antes de publicar nada, porque los dos estarían peleando por el mismo afiliado y el mismo cliente. Si resuelve otro rubro, no hay conflicto y es justamente lo que le falta al catálogo.'],
  },
  {
    q: '¿Quién da soporte al cliente que trae un afiliado?',
    a: ['Vos, que sos quien hizo el producto. El afiliado presenta y acompaña, pero la demostración, la puesta en marcha, el soporte y la facturación son de quien publica el software. Por eso el producto tiene que estar terminado antes de entrar al catálogo.'],
  },
  {
    q: '¿Qué pasa si quiero salir del catálogo?',
    a: ['Se baja la ficha y deja de venderse. Lo que no se corta de un día para el otro son las comisiones de los clientes que ya trajo un afiliado: esos siguen liquidándose mientras sigan suscriptos, porque ese vendedor ya hizo su trabajo, y en las mismas condiciones: están escritas en los [términos](/terminos-devaffi) que aceptás al registrarte, no se negocian cuando alguien se quiere ir.'],
  },
  {
    q: '¿Y si mi software no es de gestión?',
    a: ['Preguntá igual. El catálogo arranca por software de gestión para pymes porque es el rubro donde los afiliados ya tienen contactos, pero lo que define si algo encaja es que se cobre por suscripción y que haya un tipo de negocio claro al que ofrecérselo.'],
  },
];

const PASOS = [
  ['Creás tu cuenta', 'Entrás con tu cuenta de Google y listo. Al registrarte aceptás las condiciones —las dos comisiones y los requisitos de más abajo—, así que no hay nada que negociar después.'],
  ['Publicás y recibís tus credenciales', 'Desde tu panel cargás la ficha —qué hace, capturas, demo, planes y comisión— en seis pasos. Al publicar recibís tus credenciales de API: una clave y un secreto propios de ese producto.'],
  ['Conectás la API y la probás', 'Conectás tu sistema siguiendo la documentación y lo probás con un botón que recorre la integración entera. En paralelo revisamos la ficha: entra al catálogo cuando está aprobada y tu sistema ya contesta.'],
  ['Se cobra y se reparte', 'El afiliado lo ve en el catálogo y lo vende con su link. El negocio paga por nuestro checkout —y tu sistema recibe el aviso para activar el plan— o adentro de tu software, y ahí la comisión del vendedor sale de tu saldo prepago.'],
];

const REQUISITOS = [
  ['ciclo', 'Se cobra por suscripción', 'Una cuota que se repite todos los meses o todos los años. Es lo que hace que la comisión también se repita: un software que se vende una sola vez paga una sola comisión, y con eso ningún afiliado construye nada.'],
  ['rayo', 'Das de alta un cliente sin tocar nada', 'Multitenant, o con un aprovisionamiento automático que haga lo mismo. Si para sumar un cliente tenés que levantar una instancia a mano, el afiliado termina vendiendo algo que tarda dos días en estar arriba.'],
  ['chat', 'Está terminado, en uso y con soporte', 'Con clientes reales que ya pagan — no hace falta que sean muchos, pero tiene que haber alguien que no sea amigo tuyo. Y el que entre por un afiliado te va a escribir a vos cuando algo no ande.'],
  ['enlace', 'Te conectás a nuestra API', 'Tu sistema nos avisa las altas y los cambios de plan, y contesta en qué plan está cada cuenta que trajo un vendedor. Es el único requisito técnico y no se deja para después. Si tu sistema deja de contestar 24 horas, el producto sale solo del catálogo hasta que vuelva.'],
  ['diana', 'Le sirve a un rubro identificable', '«Para cualquier empresa» no se puede vender. Un afiliado necesita saber a qué puerta golpear: veterinarias, estudios contables, talleres, consultorios. Cuanto más definido el rubro, más fácil encontrar quién ya lo conoce.'],
  ['tarjeta', 'La comisión que vas a pagar te cierra', 'La de la plataforma es fija y es el costo de cobrar. La que hay que pensar es cuánto le vas a pagar al vendedor: la elegís vos, queda en tu ficha y decide si alguien sale a vender tu producto. Al cargarla te mostramos el promedio y el máximo de tu rubro.'],
];

const LD = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': URL + '#page',
    url: URL,
    name: 'Publicá tu software en el catálogo de Devaffi',
    description: 'Programa para quienes desarrollan software por suscripción y necesitan un canal de venta: el producto entra al catálogo de Devaffi y lo presenta una red de afiliados que cobra comisión sólo cuando hay una suscripción cobrada.',
    inLanguage: 'es-AR',
    isPartOf: { '@id': SITIO + RUTAS.inicio + '#org' },
    about: [
      { '@type': 'Thing', name: 'Canal de venta de software' },
      { '@type': 'Thing', name: 'Software como servicio (SaaS)' },
      { '@type': 'Thing', name: 'Comisión recurrente' },
      { '@type': 'Thing', name: 'Red de revendedores' },
    ],
    significantLink: [SITIO + RUTAS.afiliados, SITIO + '/docs/api', SITIO + RUTAS.planes],
    audience: { '@type': 'Audience', name: 'Empresas y profesionales que desarrollan software por suscripción' },
  },
  migasLd('Developers'),
  {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'Cómo publicar tu software en el catálogo de Devaffi',
    description: 'Los cuatro pasos para que un software por suscripción entre al catálogo de Devaffi y lo venda su red de afiliados a comisión. El alta es self-service: no hay entrevista ni negociación, sólo requisitos que cumplir.',
    inLanguage: 'es-AR',
    estimatedCost: { '@type': 'MonetaryAmount', currency: 'ARS', value: '0' },
    step: PASOS.map(([n, t], i) => ({ '@type': 'HowToStep', position: i + 1, name: n, text: t, url: URL + '#como-funciona' })),
  },
  faqLd(FAQ),
];

/* Un pedazo de la integración, para que el developer vea el tamaño del trabajo
   antes de registrarse. Es el mismo ejemplo de /docs/api («Avisar un alta»):
   si la API cambia, cambia allá y acá. */
function Codigo() {
  return (
    <figure className="dv-codigo dv-rev">
      <div className="dv-codigo-bar" aria-hidden="true"><i /><i /><i /><span>POST /api/v1/altas</span></div>
      <pre><code>{`// Justo después de crear la cuenta en tu sistema
await fetch("https://app.g360ia.com.ar/api/v1/altas", {
  method: "POST",
  headers: {
    "Authorization": \`Bearer \${process.env.G360_CLAVE}\`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    cuenta: String(cuenta.id),
    negocio: cuenta.nombre,
    ref: cuenta.g360_ref ?? null,  // el del link del vendedor
  }),
});`}</code></pre>
      <figcaption>Avisar un alta: una de las cuatro llamadas. <a href="/docs/api">Ver la documentación</a></figcaption>
    </figure>
  );
}

export default function Developers() {
  return (
    <Layout actual="developers">
      {LD.map((d, i) => <JsonLd key={i} datos={d} />)}

      <section className="dv-hero">
        <div className="dv-cont">
          <div className="dv-split">
            <div>
              <Migas actual="Developers" />
              <span className="dv-pildora"><i />Para quien desarrolla software · Canal de venta</span>
              <h1 className="dv-h1">Vos lo construís. <span className="dv-grad-txt">La red sale a venderlo.</span></h1>
              <p className="dv-hero-lead">
                Si hiciste un software que se cobra por suscripción y el problema no es el producto
                sino que nadie lo conoce, publicalo en el catálogo: una red de afiliados lo presenta
                con su link y cobra sólo cuando hay una venta.
              </p>
              <div className="dv-hero-ctas">
                <Boton href={APP} grande>Crear mi cuenta de developer</Boton>
                <Boton href="#requisitos" v="claro" grande flecha={false}>¿Mi producto encaja?</Boton>
              </div>
              <Chips items={['Sin costo fijo', 'Sin exclusividad', 'El producto y el cliente siguen siendo tuyos']} />
            </div>
            <Codigo />
          </div>
        </div>
      </section>

      <section className="dv-sec dv-sec--suave" id="el-problema">
        <div className="dv-cont">
          <div className="dv-split">
            <div className="dv-rev">
              <span className="dv-eyebrow">El problema de siempre</span>
              <h2 className="dv-h2">Construir y vender son <span className="dv-grad-txt">dos oficios distintos</span></h2>
              <p className="dv-lead">
                Casi todo el software chico que se muere no se muere por malo. Se muere porque lo
                usaron cuatro clientes conocidos, nunca salió de ese círculo y en algún momento dejó
                de tener sentido sostenerlo. El código estaba bien; faltaba quién lo pusiera adelante
                de la gente que lo necesita.
              </p>
              <p>
                Y la salida obvia —armar un equipo comercial— es la más cara: sueldo fijo antes de la
                primera venta, meses de rampa y rotación que te devuelve al principio. Todo eso se paga
                exista o no la venta.
              </p>
              <ul className="dv-lista">
                <li>Una red a comisión <strong>cuesta cero mientras no vende</strong></li>
                <li>El que vende <strong>ya conoce el rubro</strong>: no hay que enseñarle a quién llamar</li>
                <li>Si el producto no engancha, <strong>te enterás rápido y gratis</strong></li>
              </ul>
            </div>
            <div className="dv-caja dv-rev">
              <span className="dv-eyebrow">Las dos formas de conseguir clientes</span>
              <p><strong>Equipo propio.</strong> Costo fijo desde el día uno, rampa larga y riesgo tuyo. Rinde cuando ya tenés volumen y podés sostener el sueldo mientras la persona aprende.</p>
              <p><strong>Red a comisión.</strong> Costo variable y atado al resultado: el vendedor cobra cuando cobrás vos. Rinde cuando todavía no podés bancar un equipo, que es justo cuando más falta hace vender.</p>
              <p><strong>La contracara, dicha de frente.</strong> Nadie sale a vender algo que no se vende solo un poco. Si el producto todavía no convenció a ningún cliente que pague, una red no lo va a arreglar — lo va a confirmar más rápido.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="dv-sec" id="como-funciona">
        <div className="dv-cont">
          <Cab
            eyebrow="Cómo funciona"
            titulo={<>Cuatro pasos, <span className="dv-grad-txt">y ninguno es una reunión</span></>}
            lead="No hay entrevista, ni pitch, ni alguien que decida si tu producto le gusta. Te registrás, cargás lo que pide el panel y lo único que se revisa es que se cumplan los requisitos."
          />
          <div className="dv-pasos dv-rev">
            {PASOS.map(([t, p], i) => (
              <article className="dv-paso" key={t}>
                <span className="dv-paso-n">0{i + 1}</span>
                <h3>{t}</h3>
                <p>{p}</p>
              </article>
            ))}
          </div>
          <div className="dv-cinta dv-rev">
            <div className="dv-cinta-n dv-grad-txt">0</div>
            <p>
              <strong>de costo fijo. No se cobra por publicar, ni por estar listado, ni una cuota por
              mantener la ficha.</strong> Lo único que pagás sale de plata que ya entró: la comisión
              que vos elegís pagarle al vendedor, producto por producto, y la de la plataforma, que es
              lo que cuesta mover la plata. Los dos porcentajes están en las condiciones que aceptás al
              registrarte y a la vista en tu panel. Si nadie vende, no pagás nada.
            </p>
          </div>
        </div>
      </section>

      <section className="dv-sec dv-sec--suave" id="reparto">
        <div className="dv-cont">
          <Cab
            eyebrow="El reparto"
            titulo="Quién pone qué, sin zonas grises"
            lead="La mayoría de los acuerdos de canal se rompen por lo que nadie aclaró al principio. Esto es lo que hace cada uno, escrito antes de empezar."
          />
          <div className="dv-comp dv-rev">
            <div className="dv-comp-col dv-comp-col--si">
              <h3>Lo que ponés vos</h3>
              <ul className="dv-lista">
                <li>El producto funcionando, con clientes reales que ya lo pagan</li>
                <li>La demostración, la puesta en marcha y el soporte del día a día</li>
                <li>Tu sistema conectado a nuestra API, con las credenciales en variables de entorno</li>
                <li>La ficha y tus planes con los precios reales, desde tu panel</li>
                <li>La comisión que le fijes al vendedor, y la de la plataforma sobre lo que cobra nuestro checkout</li>
                <li>Tu propia infraestructura: el software sigue corriendo donde lo tenés</li>
              </ul>
            </div>
            <div className="dv-comp-col">
              <h3>Lo que pone Devaffi</h3>
              <ul className="dv-lista">
                <li>La red de afiliados y el alta de cada vendedor</li>
                <li>Tu panel para publicar, ver tus credenciales de API y tus liquidaciones</li>
                <li>El seguimiento del referido: el link pasa por nuestro redirect y vos sólo guardás el identificador</li>
                <li>El checkout, el reparto entre las tres partes y la liquidación por transferencia</li>
                <li>El aviso a tu sistema cuando el pago está confirmado, con reintentos si estás caído</li>
                <li>La API, su documentación pública y la prueba automática de tu conexión</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="dv-sec" id="requisitos">
        <div className="dv-cont">
          <Cab
            eyebrow="¿Tu producto encaja?"
            titulo="Qué tiene que cumplir para entrar al catálogo"
            lead="No es burocracia: cada punto está porque sin él la red no puede vender tu producto o el afiliado no puede cobrar."
          />
          <div className="dv-grid dv-grid--3 dv-rev">
            {REQUISITOS.map(([ic, t, p], i) => (
              <article className="dv-card" key={t}>
                <span className={'dv-card-ico' + (i % 2 ? ' dv-card-ico--verde' : '')}><Icono n={ic} /></span>
                <span className="dv-card-kick">Requisito 0{i + 1}</span>
                <h3 className="dv-h3">{t}</h3>
                <p>{p}</p>
              </article>
            ))}
          </div>
          <p className="dv-nota" style={{ textAlign: 'center' }}>
            El contrato técnico completo —endpoints, firma, errores y ejemplos— está en la{' '}
            <a className="dv-link" href="/docs/api">documentación de la API</a>.
          </p>
        </div>
      </section>

      {/* El segmento incómodo va arriba de la FAQ a propósito: un developer que
          evalúa ceder margen lo primero que quiere saber es cuánta red hay del
          otro lado. Inflarlo se descubre el primer día en el panel. */}
      <section className="dv-sec dv-sec--suave" id="donde-estamos">
        <div className="dv-cont">
          <div className="dv-split">
            <div className="dv-rev">
              <span className="dv-eyebrow">Dónde está esto hoy</span>
              <h2 className="dv-h2">La red está arrancando, y <span className="dv-grad-txt">no te lo vamos a esconder</span></h2>
              <p className="dv-lead">
                No hay cientos de vendedores esperando tu producto. Hay un programa de afiliados
                abierto, la liquidación funcionando y un producto publicado —Vet 360iA, para
                veterinarias— con el que probamos el mecanismo antes de invitar a nadie.
              </p>
              <p>
                Entrar temprano tiene una ventaja concreta: sos el único de tu rubro en el catálogo, y
                los afiliados que se suman ahora te encuentran a vos.
              </p>
              <ul className="dv-lista">
                <li>El mecanismo <strong>ya está probado</strong> con un producto real, no es una idea</li>
                <li>No arriesgás plata: <strong>si no vende, no pagás</strong></li>
                <li>La integración la <strong>probás vos solo</strong>, sin reuniones ni esperas</li>
              </ul>
            </div>
            <div className="dv-caja dv-rev">
              <span className="dv-eyebrow">Lo que Devaffi no es</span>
              <p><strong>No es una adquisición ni una sociedad.</strong> No compramos tu empresa, no pedimos participación y no entramos en tus decisiones de producto.</p>
              <p><strong>No nos quedamos con tu cliente.</strong> El cobro puede pasar por nuestro checkout o seguir en el tuyo, pero el cliente usa tu producto, te escribe a vos y se va con vos si un día nos vamos nosotros.</p>
              <p><strong>No es exclusividad.</strong> Seguís vendiendo por tu cuenta y por los canales que ya tengas. Esto se suma, no reemplaza.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="dv-sec dv-sec--corta" id="niveles">
        <div className="dv-cont">
          <div className="dv-split">
            <div className="dv-rev">
              <span className="dv-eyebrow">Niveles</span>
              <h2 className="dv-h2">Publicar es gratis. Más vendedores, si los querés.</h2>
              <p className="dv-lead" style={{ marginBottom: 0 }}>
                Lo que se paga no es un tablero ni un reporte: es acceso a más vendedores. El nivel
                gratis alcanza para empezar; cada nivel pago suma lugares, productos y contactos de
                regalo para tu red.
              </p>
            </div>
            <div className="dv-rev"><Boton href={RUTAS.planes + '#developers'} v="claro" grande>Ver los niveles</Boton></div>
          </div>
        </div>
      </section>

      <section className="dv-sec dv-sec--suave" id="preguntas">
        <div className="dv-cont">
          <Cab eyebrow="Preguntas frecuentes" titulo="Las que haría cualquiera antes de ceder margen" />
          <div className="dv-rev"><Faq items={FAQ} /></div>
        </div>
      </section>

      <Geo items={[
        ['Hice un SaaS y no lo compra nadie, ¿cómo consigo clientes?', '#el-problema'],
        ['¿Cómo armo una red de revendedores para mi software?', '#como-funciona'],
        ['¿Qué comisión se le paga a un afiliado que vende software?', '#requisitos'],
        ['¿Me conviene contratar un vendedor o pagar comisión por venta?', '#el-problema'],
        ['¿Dónde publico mi software para que otros lo revendan en Argentina?', '#donde-estamos'],
      ]} />

      <section className="dv-sec dv-sec--corta dv-sec--borde" id="relacionados">
        <div className="dv-cont">
          <div className="dv-grid dv-grid--3 dv-rev">
            <a className="dv-card" href={RUTAS.afiliados}>
              <span className="dv-card-ico dv-card-ico--verde"><Icono n="personas" /></span>
              <h3 className="dv-h3">Programa de afiliados</h3>
              <p>Lo mismo, visto por el que sale a vender.</p>
            </a>
            <a className="dv-card" href="/docs/api">
              <span className="dv-card-ico"><Icono n="codigo" /></span>
              <h3 className="dv-h3">Documentación de la API</h3>
              <p>Credenciales, endpoints, firma y errores, con ejemplos.</p>
            </a>
            <a className="dv-card" href={RUTAS.planes + '#developers'}>
              <span className="dv-card-ico dv-card-ico--verde"><Icono n="estrella" /></span>
              <h3 className="dv-h3">Niveles</h3>
              <p>Qué suma cada nivel pago y cuánto cuesta, leído del panel.</p>
            </a>
          </div>
        </div>
      </section>

      <Cierre
        titulo="No hay entrevista: hay requisitos y un panel"
        texto="Te registrás con Google, publicás tu software y recibís tus credenciales de API. Conectás tu sistema, lo probás desde el panel y, con la ficha aprobada y los seis requisitos cumplidos, entra al catálogo."
      >
        <Boton href={APP} v="blanco" grande>Crear mi cuenta de developer</Boton>
        <Boton href={RUTAS.afiliados} v="borde-blanco" grande flecha={false}>Ver el lado del que vende</Boton>
      </Cierre>
    </Layout>
  );
}
