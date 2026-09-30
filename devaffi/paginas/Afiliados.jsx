/* /afiliados — la red vista por el que sale a vender.
 *
 * Es la otra cara de /developers: comparten vocabulario a propósito (catálogo,
 * link de referido, comisión recurrente) y se enlazan entre sí. Si cambia el
 * mecanismo, cambian las dos (CLAUDE.md, Regla 6).
 *
 * Ningún porcentaje ni precio está escrito acá. La calculadora tiene la
 * comisión como un control más porque cada producto define la suya. */
import React, { useState } from 'react';
import {
  Layout, Boton, Cab, Chips, Faq, faqLd, JsonLd, Geo, Migas, Cierre, Icono, Flecha,
  APP, VET, WA, RUTAS, SITIO, migasLd,
} from '../componentes.jsx';

const URL = SITIO + RUTAS.afiliados;

const FAQ = [
  {
    q: '¿Qué software puedo vender como afiliado?',
    a: ['Todo lo que esté publicado en el catálogo. Hoy está Vet 360iA, y el catálogo se está abriendo a sistemas de otros developers que entran con su propia comisión. No hay exclusividad: podés vender uno, varios o todos, y seguir vendiendo lo que ya vendías por fuera de Devaffi. Lo que sí hay es un **cupo de vendedores por producto**: tomar un link ocupa un lugar, y el lugar se libera solo si no se usa. Si un producto está lleno, marcás **«Lo quiero vender»** y te avisamos cuando se abra un lugar, por orden de llegada.'],
  },
  {
    q: '¿Cuánto cobra un afiliado de Devaffi?',
    a: [
      'Un porcentaje de cada pago que hace el negocio que trajiste, mes a mes o año a año según el plan que haya contratado. **Cada producto define el suyo** y lo publica en su ficha antes de que tomes el link, junto con cuánta plata te deja por mes cada negocio — que es el número que de verdad sirve para comparar, porque un porcentaje alto sobre una cuota chica deja menos que uno bajo sobre una grande.',
      '**El porcentaje que regía cuando tu cliente pagó por primera vez te queda garantizado un año**, aunque el developer lo baje después. Si lo sube, la suba entra enseguida y arranca un año nuevo. Cada cambio te llega por correo y a la campanita de tu panel el mismo día, y lo ves cobro por cobro, con el monto que te corresponde de cada uno.',
    ],
  },
  {
    q: '¿Hasta cuándo la cobro?',
    a: ['Mientras ese cliente siga pagando la suscripción. Si da de baja, deja de generar comisión; si vuelve, vuelve a generarla. No hay un plazo que se cumpla ni una cantidad máxima de comisiones. Lo que se revisa una vez por año, en la fecha del primer pago de cada cliente, es el porcentaje: hasta entonces te queda fijo el que tenía cuando empezó a pagar.'],
  },
  {
    q: '¿Tengo que invertir algo para entrar?',
    a: [
      'No. No se compra stock, no se paga una licencia de vendedor, y crear la cuenta es gratis y queda lista en el momento. El plan gratis alcanza para vender y cobrar; el [plan Pro](/planes#vendedores), con CRM, WhatsApp conectado y prospección de negocios, es opcional.',
      'Lo que sí hay es un **ritmo para conservar el lugar** en cada producto: traer el mínimo de altas que fija su ficha cada 15 días, y lograr una suscripción paga antes de los 30. Después, **cada negocio nuevo que paga te da 45 días más**: si pasan 45 días sin uno, el lugar se libera y ese producto no se puede volver a tomar por 10 días, salvo que lo mantengas pagando la extensión que te muestra el panel. Y si el lugar se libera, **no perdés lo que ya trajiste**: esos clientes se te siguen liquidando mientras paguen.',
    ],
  },
  {
    q: '¿Necesito saber de sistemas o programar?',
    a: ['No. Lo que hace falta es conocer negocios del rubro. La demostración, la puesta en marcha, el soporte y la facturación las hace quien publica el producto; vos presentás y acompañás.'],
  },
  {
    q: '¿El cliente paga más caro por entrar con mi código?',
    a: ['No. El precio es el mismo con código de referido o sin él: la comisión sale del margen de quien publica el producto, no de un recargo. Si costara más entrar por un afiliado, el afiliado estaría vendiendo en contra — y lo primero que perdería es la confianza que hace que esto funcione.'],
  },
  {
    q: '¿Y si alguien usa mi código y se suscribe tres meses después?',
    a: ['La venta es tuya si esa persona se registró con tu link: desde el alta, la cuenta queda atada a vos para siempre y la comisión se cobra cuando pague, sea cuando sea. Lo que tiene que estar vigente es tu lugar en el producto el día que se registra.'],
  },
  {
    q: '¿Cuándo y cómo me pagan?',
    a: ['El segundo viernes de cada mes, por transferencia. En tu panel cargás el CBU, el alias o el celular de Mercado Pago donde querés recibirla, y ves qué comisiones están liquidadas y cuáles siguen pendientes.'],
  },
  {
    q: 'Tengo un software propio, ¿puedo publicarlo en el catálogo?',
    a: ['Sí, y tiene su propia página: [Developers](/developers). Si desarrollás un sistema que se cobra por suscripción y querés que lo venda una red de afiliados en vez de armar un equipo comercial, ahí está el acuerdo explicado — qué comisión se paga, qué tiene que cumplir el producto y cómo se liquida.'],
  },
  {
    q: '¿Puedo usar el mismo email con el que ya soy cliente de un sistema?',
    a: ['No. Una cuenta de Google es de un negocio cliente o de un vendedor, no las dos cosas — así el sistema sabe a qué panel entrás sin preguntártelo. Si tenés un negocio que usa el sistema y además querés vender, registrate con otra cuenta.'],
  },
  {
    q: '¿Puedo venderlo bajo mi propia marca?',
    a: ['Hoy no. El programa es de comisión: el cliente contrata con la marca del producto y vos cobrás tu porcentaje de cada cuota. Si lo que buscás es revender con tu marca, escribinos y lo conversamos como un acuerdo aparte.'],
  },
  {
    q: '¿Esto es marketing multinivel?',
    a: ['No. No se gana por sumar afiliados debajo tuyo ni hay una pirámide de reclutados: se gana exclusivamente por los negocios que se suscriben con tu link. Si no trae clientes, un afiliado no genera ingresos para nadie, empezando por él.'],
  },
];

const PASOS = [
  ['Elegís qué vender', 'El catálogo vive dentro de tu panel: entrás y ves todos los productos con su ficha, sus capturas y su demo. Te quedás con los que tengan sentido para los negocios que ya tratás — uno, varios o todos, sin exclusividad.'],
  ['Creás tu cuenta', 'Entrás con tu cuenta de Google y aceptás las condiciones. Sin formularios largos ni aprobación que esperar: queda lista en el momento. Dónde cobrás lo cargás después, en tu perfil.'],
  ['Compartís tu link', 'Por cada producto que tomás se te genera tu link. Se lo mandás por WhatsApp al negocio, lo ponés en tu perfil o lo repartís en un flyer. Quien se registre desde ahí queda anotado como tuyo para siempre, aunque pague meses después.'],
  ['Cobrás todos los meses', 'Cuando ese negocio se suscribe, empezás a cobrar la comisión que ese producto publica, sobre cada cuota. No es un pago único: se repite mientras siga usando el sistema. Se liquida el segundo viernes de cada mes, por transferencia.'],
];

const LD = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': URL + '#page',
    url: URL,
    name: 'Programa de afiliados de Devaffi',
    description: 'Red de venta de software por comisión recurrente: el afiliado elige productos del catálogo de Devaffi, los presenta con su link de referido y cobra un porcentaje de cada suscripción que trae, mes a mes, mientras el cliente siga activo.',
    inLanguage: 'es-AR',
    isPartOf: { '@id': SITIO + RUTAS.inicio + '#org' },
    about: [
      { '@type': 'Thing', name: 'Marketing de afiliados' },
      { '@type': 'Thing', name: 'Reventa de software' },
      { '@type': 'Thing', name: 'Comisión recurrente' },
      { '@type': 'Thing', name: 'Canal de venta de software' },
    ],
    mentions: [
      { '@type': 'SoftwareApplication', '@id': 'https://vet.g360ia.com.ar/#app', name: 'Vet 360iA', url: VET, applicationCategory: 'BusinessApplication' },
      { '@type': 'Thing', name: 'Software como servicio (SaaS)' },
      { '@type': 'Thing', name: 'Código de referido' },
    ],
    significantLink: [VET, SITIO + RUTAS.developers, APP],
  },
  migasLd('Afiliados'),
  {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'Cómo vender software y cobrar una comisión recurrente con Devaffi',
    description: 'Los cuatro pasos para empezar a vender software por suscripción como afiliado de Devaffi y cobrar un porcentaje de cada cuota mientras el cliente siga suscripto.',
    inLanguage: 'es-AR',
    totalTime: 'PT10M',
    estimatedCost: { '@type': 'MonetaryAmount', currency: 'ARS', value: '0' },
    step: PASOS.map(([n, t], i) => ({ '@type': 'HowToStep', position: i + 1, name: n, text: t, url: URL + '#como-funciona' })),
  },
  faqLd(FAQ),
];

const pesos = (n) => '$' + Math.round(n).toLocaleString('es-AR');

/* La cuota y la comisión son controles y no números fijos: los precios salen
   de la base de cada producto y la comisión la define cada developer. Arranca
   en 20% porque es el orden de magnitud habitual, no el de nadie. */
function Calculadora() {
  const [clientes, setClientes] = useState(5);
  const [cuota, setCuota] = useState(40000);
  const [pct, setPct] = useState(20);
  const mes = clientes * cuota * pct / 100;
  return (
    <div className="dv-calc dv-rev" id="cuanto-se-gana">
      <label htmlFor="calc-clientes">Clientes que traés <b>{clientes}</b></label>
      <input id="calc-clientes" type="range" min="1" max="40" step="1" value={clientes} onChange={(e) => setClientes(+e.target.value)} />
      <label htmlFor="calc-cuota">Cuota mensual de cada uno <b>{pesos(cuota)}</b></label>
      <input id="calc-cuota" type="range" min="10000" max="150000" step="5000" value={cuota} onChange={(e) => setCuota(+e.target.value)} />
      <label htmlFor="calc-pct">Comisión que paga ese software <b>{pct}%</b></label>
      <input id="calc-pct" type="range" min="5" max="50" step="1" value={pct} onChange={(e) => setPct(+e.target.value)} />
      <div className="dv-calc-res">
        <div className="dv-calc-fila"><span>Tu comisión, cada mes</span><b>{pesos(mes)}</b></div>
        <div className="dv-calc-fila dv-calc-total"><span>En doce meses</span><b className="dv-grad-txt">{pesos(mes * 12)}</b></div>
      </div>
      <p className="dv-nota">
        La comisión no es un número nuestro: la pone cada producto y está en su ficha antes de que
        tomes el link. Supone que los clientes entran el primer mes y que ninguno da de baja, así
        que es una estimación para dimensionar y no una proyección de ingresos: lo que se cobra de
        verdad es lo que el panel muestra cobro por cobro.
      </p>
    </div>
  );
}

export default function Afiliados() {
  return (
    <Layout actual="afiliados">
      {LD.map((d, i) => <JsonLd key={i} datos={d} />)}

      <section className="dv-hero">
        <div className="dv-cont">
          <div className="dv-split">
            <div>
              <Migas actual="Afiliados" />
              <span className="dv-pildora"><i />Vender software · Comisión recurrente</span>
              <h1 className="dv-h1">Vendé software y <span className="dv-grad-txt">cobrá todos los meses</span></h1>
              <p className="dv-hero-lead">
                Elegís del catálogo, compartís tu código de referido y cobrás un porcentaje de cada
                cuota que paguen los negocios que traés — mes a mes, mientras sigan suscriptos. Sin
                comprar nada y sin saber programar.
              </p>
              <div className="dv-hero-ctas">
                <Boton href={APP} grande>Crear mi cuenta de afiliado</Boton>
                <Boton href="#catalogo" v="claro" grande flecha={false}>Ver qué se puede vender</Boton>
              </div>
              <Chips items={['Sin inversión inicial', 'Sin exclusividad', 'Sin saber programar', 'La comisión, a la vista antes de elegir']} />
            </div>
            <Calculadora />
          </div>
        </div>
      </section>

      <section className="dv-sec dv-sec--suave" id="como-funciona">
        <div className="dv-cont">
          <Cab
            eyebrow="Cómo funciona"
            titulo={<>Cuatro pasos, <span className="dv-grad-txt">y ninguno es una capacitación</span></>}
            lead="Del registro al primer link activo pasan diez minutos. Lo que viene después es lo de siempre: hablar con gente que ya conocés."
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
            <div className="dv-cinta-n dv-grad-txt">12</div>
            <p>
              <strong>meses con el porcentaje que te prometieron, por cada cliente.</strong> Cada
              producto define cuánto paga y lo publica en su ficha antes de que tomes el link, junto
              con cuánta plata te deja por mes cada negocio. El número que regía cuando tu cliente
              pagó por primera vez <strong>te queda un año aunque el developer lo baje después</strong>,
              y si lo sube, la suba entra enseguida.
            </p>
          </div>
        </div>
      </section>

      {/* El catálogo va arriba: es lo primero que quiere ver alguien que evalúa
          entrar a una red de venta. Y sólo se nombra lo que se puede contratar
          hoy — ningún producto de partner se nombra antes de estar publicado. */}
      <section className="dv-sec" id="catalogo">
        <div className="dv-cont">
          <Cab
            eyebrow="El catálogo"
            titulo={<>Qué se puede vender <span className="dv-grad-txt">y qué está entrando</span></>}
            lead="La idea es que esta red venda buen software, sea de quien sea. Acá está lo que hay publicado hoy, dicho sin inflar."
          />
          <div className="dv-grid dv-grid--3 dv-rev">
            <a className="dv-card" href={VET} target="_blank" rel="noopener">
              <span className="dv-etiqueta">Disponible</span>
              <h3 className="dv-h3">Vet 360iA</h3>
              <p>El sistema de gestión completo para una veterinaria: agenda de turnos, ficha de clientes y mascotas, historia clínica, facturación, inventario y un bot de WhatsApp que atiende y agenda solo.</p>
              <p>Es el que hoy tiene el programa abierto y la liquidación funcionando. Se paga por mes, así que la comisión se repite por mes.</p>
              <span className="dv-card-mas">Ver el producto <Flecha /></span>
            </a>
            <article className="dv-card">
              <span className="dv-etiqueta dv-etiqueta--gris">Entrando al catálogo</span>
              <h3 className="dv-h3">Software de otros developers</h3>
              <p>El catálogo se está abriendo a sistemas de otras empresas que se cobran por suscripción y que quieren una red de venta en vez de un equipo comercial propio.</p>
              <p>Entran con su nombre, su ficha y la comisión que cada uno decide pagar, y se venden con la misma cuenta. Todavía no hay ninguno publicado: el día que lo haya, aparece en tu panel.</p>
            </article>
            <article className="dv-card">
              <span className="dv-etiqueta dv-etiqueta--gris">En construcción</span>
              <h3 className="dv-h3">Las verticales que vienen</h3>
              <p>Vet 360iA es la primera vertical de una base que ya resuelve turnos, fichas, facturación y WhatsApp — consultorios, estudios, comercios y talleres son adaptaciones de semanas.</p>
              <p>Si conocés bien un rubro y creés que ahí hay mercado, <a className="dv-link" href={WA} target="_blank" rel="noopener">decínoslo</a>: el que trae la idea suele ser el que después la vende.</p>
            </article>
          </div>
          <div className="dv-caja dv-caja--tinte dv-rev" style={{ marginTop: 24 }}>
            <p>
              <strong>Una sola cuenta para todo.</strong> Cada producto que tomás te da su link, y los
              que se sumen mañana los tomás desde la misma cuenta, sin volver a registrarte ni perder
              los clientes que ya trajiste. Dónde cobrás lo cargás una vez y por ahí te entra todo,
              venga del producto que venga.
            </p>
          </div>
        </div>
      </section>

      <section className="dv-sec dv-sec--suave" id="la-diferencia">
        <div className="dv-cont">
          <div className="dv-split">
            <div className="dv-rev">
              <span className="dv-eyebrow">Por qué vender software</span>
              <h2 className="dv-h2">Vender una vez y cobrar una vez es <span className="dv-grad-txt">el peor negocio del mundo</span></h2>
              <p className="dv-lead">
                La mayoría de los que venden algo empiezan cada mes en cero. El software que se paga
                por mes rompe esa lógica: el cliente que trajiste en marzo te sigue pagando en agosto
                sin que hagas nada nuevo, y el que traés en agosto <strong>se suma</strong> al de marzo
                en vez de reemplazarlo.
              </p>
              <ul className="dv-lista">
                <li>El esfuerzo de una venta <strong>se cobra muchas veces</strong>, no una</li>
                <li>Los clientes <strong>se acumulan</strong>: cada mes arrancás más arriba</li>
                <li>No hay stock que financiar, ni entrega que coordinar, ni postventa que atender</li>
              </ul>
            </div>
            <div className="dv-caja dv-rev">
              <span className="dv-eyebrow">La misma venta, dos modelos</span>
              <p><strong>Comisión única.</strong> Vendés, cobrás, y el mes que viene ese cliente vale cero. Para ganar lo mismo en enero tenés que volver a vender lo mismo.</p>
              <p><strong>Comisión recurrente.</strong> Vendés, cobrás, y el mes que viene ese cliente sigue valiendo lo mismo. Diez clientes bien atendidos pesan más que cincuenta operaciones sueltas.</p>
              <p><strong>La contracara, dicha de frente.</strong> Un cliente que da de baja deja de generar comisión. Por eso conviene vender a quien realmente lo necesita: acá el que se queda es el que te paga.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="dv-sec" id="para-quien">
        <div className="dv-cont">
          <Cab
            eyebrow="Para quién es"
            titulo={<>Los que mejor venden esto <span className="dv-grad-txt">no son vendedores</span></>}
            lead="Son gente a la que el dueño del negocio ya le atiende el teléfono. La confianza está hecha; lo único que falta es tener algo bueno para ofrecerle."
          />
          <div className="dv-grid dv-grid--4 dv-rev">
            {[
              ['camion', 'Proveedores e insumos', 'Si visitás treinta negocios del mismo rubro todos los meses, ya tenés la ruta hecha. Presentar un sistema no te agrega una visita: te agrega un tema en la que ya hacías.'],
              ['planilla', 'Contadores y estudios', 'Sufrís de primera mano el desorden de tus clientes. Un sistema que ordena la facturación te ahorra trabajo a vos también, y encima te paga por recomendarlo.'],
              ['llave2', 'Técnicos y soporte', 'El que arregla la computadora del mostrador sabe qué falta. Es a quien el dueño le pregunta «¿y esto con qué lo hago?» — y la respuesta ahora te deja una comisión.'],
              ['personas', 'Agencias y consultores', 'Ya le armás la web o las campañas a negocios de un rubro. Sumar el sistema de gestión te agrega una línea de ingreso que no depende de horas facturadas.'],
            ].map(([ic, t, p], i) => (
              <article className="dv-card" key={t}>
                <span className={'dv-card-ico' + (i % 2 ? ' dv-card-ico--verde' : '')}><Icono n={ic} /></span>
                <h3 className="dv-h3">{t}</h3>
                <p>{p}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="dv-sec dv-sec--suave" id="que-es">
        <div className="dv-cont">
          <Cab eyebrow="Para que quede claro" titulo="Qué es este programa y qué no es" />
          <div className="dv-comp dv-rev">
            <div className="dv-comp-col dv-comp-col--si">
              <h3>Lo que sí es</h3>
              <ul className="dv-lista">
                <li>Una comisión sobre cada cuota, que se repite mientras el cliente siga suscripto</li>
                <li>Un catálogo de software, propio y de otros developers, que se vende con una sola cuenta</li>
                <li>Un link por producto que registra al cliente para siempre, aunque contrate meses después</li>
                <li>Un panel donde ves cobro por cobro qué te corresponde y qué está liquidado</li>
                <li>Productos terminados, con soporte y facturación de quien los publica</li>
              </ul>
            </div>
            <div className="dv-comp-col">
              <h3>Lo que no es</h3>
              <ul className="dv-lista dv-lista--no">
                <li>Un negocio de reclutar vendedores: no se gana por sumar gente, se gana por vender</li>
                <li>Una franquicia ni una licencia: no hay canon, ni territorio que comprar</li>
                <li>Ingreso pasivo automático: el link no vende solo, lo vendés vos hablando con gente</li>
                <li>Marca blanca — el cliente contrata con la marca del producto, no con la tuya</li>
                <li>Un catálogo infinito: hoy hay un producto publicado y lo decimos sin vueltas</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="dv-sec" id="que-ponen">
        <div className="dv-cont">
          <div className="dv-split">
            <div className="dv-rev">
              <span className="dv-eyebrow">Qué pone quien publica el producto</span>
              <h2 className="dv-h2">No vendés solo: <span className="dv-grad-txt">vendés acompañado</span></h2>
              <p className="dv-lead">
                El miedo razonable de cualquiera que recomienda un sistema es quedar pegado si después
                algo no funciona. Por eso el trabajo técnico y comercial no es tuyo.
              </p>
              <ul className="dv-lista">
                <li><strong>La demostración al cliente</strong>, en vivo y con sus datos si hace falta</li>
                <li><strong>La puesta en marcha</strong> y la migración desde las planillas que ya usa</li>
                <li><strong>El soporte del día a día</strong>, directo con el negocio</li>
                <li><strong>La facturación</strong> de la cuota, todos los meses</li>
              </ul>
            </div>
            <div className="dv-caja dv-caja--tinte dv-rev">
              <span className="dv-eyebrow">Tu única tarea</span>
              <p><strong>Presentar y acompañar.</strong> Decirle al dueño que existe, pasarle tu link y avisar si quiere una demo. De ahí en adelante entra el equipo del producto.</p>
              <p>Vos ponés la relación con el negocio, que es lo único que no se puede tercerizar. El producto, la puesta en marcha, el soporte y la factura son de quien lo publica; el cobro y tu comisión, de Devaffi.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="dv-sec dv-sec--corta dv-sec--suave" id="planes">
        <div className="dv-cont">
          <div className="dv-split">
            <div className="dv-rev">
              <span className="dv-eyebrow">Planes del vendedor</span>
              <h2 className="dv-h2">Vender es gratis. Las herramientas, opcionales.</h2>
              <p className="dv-lead" style={{ marginBottom: 0 }}>
                El plan gratis alcanza para vender y cobrar. El Pro suma un CRM, tu WhatsApp conectado
                y negocios reales del rubro para contactar.
              </p>
            </div>
            <div className="dv-rev"><Boton href={RUTAS.planes + '#vendedores'} v="claro" grande>Ver los planes</Boton></div>
          </div>
        </div>
      </section>

      <section className="dv-sec" id="preguntas">
        <div className="dv-cont">
          <Cab eyebrow="Preguntas frecuentes" titulo="Las incómodas también" />
          <div className="dv-rev"><Faq items={FAQ} /></div>
        </div>
      </section>

      <Geo items={[
        ['¿Cómo puedo ganar dinero vendiendo software sin ser programador?', '#como-funciona'],
        ['¿Qué es una comisión recurrente y en qué se diferencia de una comisión por venta?', '#la-diferencia'],
        ['¿Dónde consigo software de gestión para revender a mis clientes?', '#catalogo'],
        ['¿Cuánto se gana con un programa de afiliados de software en Argentina?', '#cuanto-se-gana'],
        ['¿Los programas de afiliados de SaaS son marketing multinivel?', '#que-es'],
      ]} />

      <section className="dv-sec dv-sec--corta dv-sec--borde" id="relacionados">
        <div className="dv-cont">
          <div className="dv-grid dv-grid--3 dv-rev">
            <a className="dv-card" href="/blog/programa-afiliados-software-comision-recurrente">
              <span className="dv-card-ico"><Icono n="precio" /></span>
              <h3 className="dv-h3">Comisión recurrente</h3>
              <p>Cómo se gana de verdad con afiliados de software.</p>
            </a>
            <a className="dv-card" href="/blog/vender-software-sin-ser-programador">
              <span className="dv-card-ico dv-card-ico--verde"><Icono n="libro" /></span>
              <h3 className="dv-h3">Vender software</h3>
              <p>La guía para el que no es programador.</p>
            </a>
            <a className="dv-card" href={RUTAS.developers}>
              <span className="dv-card-ico"><Icono n="codigo" /></span>
              <h3 className="dv-h3">La otra cara</h3>
              <p>El mismo mecanismo visto por el que construye el software.</p>
            </a>
          </div>
        </div>
      </section>

      <Cierre
        titulo="No hay entrevista ni prueba de admisión: hay un link y lo que hagas con él"
        texto="La cuenta se crea con Google y queda lista en el momento. En tu panel viven el catálogo, tus links, tus clientes, tus comisiones y la cuenta donde las cobrás."
      >
        <Boton href={APP} v="blanco" grande>Crear mi cuenta de afiliado</Boton>
        <Boton href={WA} v="borde-blanco" grande flecha={false}>Tengo una pregunta antes</Boton>
      </Cierre>
    </Layout>
  );
}
