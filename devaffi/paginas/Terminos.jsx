/* /terminos-devaffi — las condiciones del programa, con la marca Devaffi.
 *
 * OJO: repite las reglas de los puntos 7 a 11 de /legal/terminos, reescritas
 * para Devaffi (sin nombrarlos: la marca titular sólo aparece en el punto 2 y
 * en el pie). Las dos páginas tienen
 * que decir lo mismo: si cambia una regla del programa en g360ia-PRM/planes.md,
 * se tocan las dos y se sube la versión de las dos (CLAUDE.md, Reglas 6 y 9).
 * Ninguna fija un porcentaje: el número vive en las condiciones que cada uno
 * acepta al registrarse (CONDICIONES_VERSION en g360ia-PRM).
 *
 * Es noindex, igual que los legales de /legal. */
import React from 'react';
import { Layout, Migas, RUTAS, APP, MAIL, TEL, TEL_HREF } from '../componentes.jsx';

const INDICE = [
  ['alcance', 'Qué cubre este documento'],
  ['titular', 'Quién opera Devaffi'],
  ['afiliados', 'Programa de afiliados'],
  ['developers', 'Publicar software en el catálogo'],
  ['liquidaciones', 'Cobros, liquidaciones e impuestos'],
  ['planes', 'Planes y niveles pagos'],
  ['conducta', 'Conducta prohibida'],
  ['baja', 'Suspensión y baja de cuentas'],
  ['propiedad', 'Propiedad intelectual'],
  ['datos', 'Datos personales'],
  ['responsabilidad', 'Responsabilidad'],
  ['cambios', 'Cambios en estos términos'],
  ['ley', 'Ley aplicable y jurisdicción'],
];

const Panel = () => <a href={APP} target="_blank" rel="noopener">el panel de Devaffi</a>;

export default function Terminos() {
  return (
    <Layout actual="terminos">
      <section className="dv-hero" style={{ paddingBottom: 48 }}>
        <div className="dv-cont dv-cont--angosto">
          <Migas actual="Términos del programa" />
          <h1 className="dv-h1" style={{ maxWidth: 'none' }}>Términos del programa</h1>
          <p className="dv-version">Versión 1.1 · Última actualización: septiembre de 2026</p>
          <p className="dv-hero-lead" style={{ marginBottom: 0 }}>
            Las reglas de Devaffi para los que venden software del catálogo y para los que publican
            el suyo. Están escritas para que se entiendan sin abogado: cada punto dice qué pasa y por qué.
          </p>
        </div>
      </section>

      <div className="dv-legal">
        <div className="dv-cont dv-cont--angosto">
          <nav className="dv-indice" aria-label="Índice">
            <ol>{INDICE.map(([id, t]) => <li key={id}><a href={'#' + id}>{t}</a></li>)}</ol>
          </nav>

          <h2 id="alcance">1. Qué cubre este documento</h2>
          <p>
            Estos términos regulan el uso de las páginas de Devaffi y la participación en el
            programa: como <strong>afiliado</strong>, que vende software del catálogo con un código de
            referido, o como <strong>developer</strong>, que publica su software para que la red lo venda.
          </p>
          <p>
            <strong>Lo vinculante es lo que cada uno acepta al crear su cuenta</strong> en <Panel />, que
            queda registrado con la versión vigente en ese momento. Esta página es el resumen público y
            permanente de esas reglas; si se contradijeran, prevalece lo aceptado en el panel.
          </p>
          <p>
            Cada software del catálogo tiene <strong>sus propios términos de uso y su propia política de
            privacidad</strong>, publicados en el sitio del producto. Contratar un producto implica
            aceptar los suyos.
          </p>
          <p>
            <strong>Calculadoras y simulaciones.</strong> Las calculadoras de estas páginas son
            estimaciones para dimensionar, no proyecciones de ingresos. Los valores son supuestos del
            usuario: no prometemos ningún resultado económico ni garantizamos ventas, clientes ni
            permanencia de suscriptores. El contenido tiene carácter informativo y no configura una
            oferta en los términos del artículo 972 del Código Civil y Comercial de la Nación.
          </p>

          <h2 id="titular">2. Quién opera Devaffi</h2>
          <p>
            Devaffi (en adelante «Devaffi» o «nosotros») es una marca de titularidad de{' '}
            <strong>Gestión 360 IA</strong>, con domicilio en Buenos Aires, República Argentina, que
            opera la plataforma, el panel, el cobro y la liquidación. Más datos en el{' '}
            <a href={RUTAS.legales}>aviso legal</a>. Contacto:{' '}
            <a href={'mailto:' + MAIL}>{MAIL}</a>. Los datos de
            inscripción fiscal se informan en la facturación de cada operación y a pedido por ese correo.
          </p>

          <h2 id="afiliados">3. Programa de afiliados</h2>
          <p>
            El programa permite recomendar software del catálogo con un código de referido y cobrar un
            porcentaje de cada cuota que pague el cliente traído.
          </p>
          <h3>3.1 Alta</h3>
          <ul>
            <li>El alta es self-service, gratuita y sin entrevista ni aprobación previa.</li>
            <li>Se requiere ser mayor de 18 años y tener capacidad para contratar.</li>
            <li>Una persona o empresa tiene <strong>una sola cuenta de afiliado</strong>. Las cuentas duplicadas se unifican o se dan de baja.</li>
            <li>Los datos de la cuenta —identidad, situación fiscal y cuenta de cobro— deben ser propios, reales y estar actualizados.</li>
          </ul>
          <h3>3.2 Comisión</h3>
          <ul>
            <li>
              El afiliado percibe <strong>un porcentaje de cada cuota efectivamente cobrada</strong> al
              cliente que trajo, mientras esa suscripción siga activa. <strong>Cada producto define su
              propio porcentaje</strong>, publicado en su ficha del catálogo antes de que el afiliado tome
              el link. No es el mismo número para todo el catálogo.
            </li>
            <li>
              <strong>Rige el porcentaje que estaba vigente cuando ese cliente pagó por primera vez, y vale
              un año</strong> desde ese primer cobro, mientras el cliente siga pagando. Lo que decide es
              cuándo empezó a pagar, no cuándo pagó.
            </li>
            <li>
              <strong>Si el developer sube la comisión, la suba se aplica enseguida</strong> —también a los
              clientes que ya venían pagando— y el cobro siguiente abre un año nuevo con ese número.{' '}
              <strong>Si la baja, el cliente que ya pagaba se queda con el suyo</strong> hasta que se
              cumpla su año; los que empiecen a pagar después entran con el número nuevo.
            </li>
            <li>
              Un mismo afiliado puede tener dos clientes del mismo producto con porcentajes distintos. El
              panel muestra, cliente por cliente, qué porcentaje rige y hasta cuándo.
            </li>
            <li>
              <strong>El developer no puede cambiar su comisión más de dos veces cada 30 días</strong>, y
              cada cambio se les avisa a todos los afiliados que tengan ese producto tomado, por correo y en
              el panel, el mismo día.
            </li>
            <li>
              Se calcula sobre el precio del plan que el cliente tiene contratado, <strong>según los precios
              que el developer cargó en su ficha</strong>. No se devenga sobre planes gratuitos, períodos de
              prueba ni cuotas bonificadas.
            </li>
            <li>
              Una cuota reembolsada, rechazada o revertida por contracargo no genera comisión; si ya se
              liquidó, se descuenta de la liquidación siguiente. <strong>La baja del cliente a mitad de un
              período ya devengado no devuelve esa comisión.</strong>
            </li>
            <li>Si el cliente da de baja, deja de generar comisión. Si vuelve a suscribirse con la misma cuenta, vuelve a generarla.</li>
            <li>No hay tope de comisiones ni exclusividad.</li>
          </ul>
          <h3>3.3 Cupo por producto</h3>
          <p>
            Cada producto admite un número limitado de afiliados a la vez, que informa su ficha. Tomar un
            link ocupa uno de esos lugares, y el lugar se libera solo si no se usa: es lo que impide que un
            producto quede muerto con todos sus lugares tomados por gente que nunca salió a vender.
          </p>
          <ul>
            <li>
              <strong>Altas acumuladas.</strong> Desde que toma el link, el afiliado tiene que traer al
              menos el mínimo que fija ese producto cada 15 días, de forma acumulada. El mínimo lo define el
              developer y está a la vista antes de tomar el link.
            </li>
            <li><strong>Una suscripción paga antes de los 30 días.</strong> Un alta gratuita la abre cualquiera; lo que sostiene el programa es que alguien pague.</li>
            <li>
              <strong>Después de la primera venta paga, cada negocio nuevo que paga suma 45 días</strong> de
              lugar, contados desde su primer pago; las renovaciones de clientes anteriores no cuentan. Si
              pasan 45 días sin uno, el lugar se libera y el afiliado no puede volver a tomar ese producto
              durante 10 días. Mientras todavía tiene el lugar, puede mantenerlo 45 días más pagando la
              extensión que informa el panel.
            </li>
            <li>El aviso de vencimiento sale tres días antes, por correo y en el panel.</li>
            <li>
              <strong>Perder el lugar no es perder lo traído.</strong> Los clientes que entraron por su link
              se le siguen liquidando mientras paguen, con la garantía del punto 3.2 intacta.
            </li>
          </ul>
          <h3>3.4 Atribución</h3>
          <ul>
            <li>
              El link del afiliado <strong>pasa por la plataforma</strong> antes de llegar al sitio del
              producto. En ese paso se genera un identificador propio de esa visita, que viaja en la URL y
              que el software del developer guarda junto a la cuenta cuando el cliente se registra.
            </li>
            <li>
              <strong>Ese identificador queda atado a esa cuenta de forma permanente</strong>, y a un solo
              afiliado. No vence, no depende de cookies del navegador y no se reescribe.
            </li>
            <li>
              Si el cliente llega por el link pero se registra más tarde entrando directo al sitio del
              producto, esa venta no se atribuye. La atribución nace con el registro, no con la visita.
            </li>
            <li>
              No se atribuyen clientes que ya eran clientes del producto, ni las altas de la propia cuenta del
              afiliado, de su empresa o de personas bajo su control (auto-referencia).
            </li>
            <li>La atribución se resuelve con el registro del panel. Ante una discrepancia, ese registro es la fuente y se revisa a pedido del afiliado.</li>
          </ul>
          <h3>3.5 Rol del afiliado</h3>
          <p>
            El afiliado <strong>presenta y acompaña</strong>. La demostración, la puesta en marcha, el
            soporte, la facturación y el cobro son de quien publica el producto. El afiliado no representa a
            Devaffi ni al developer, no es empleado, agente ni socio, no puede asumir obligaciones
            en nombre de ninguno, y actúa por cuenta propia a su exclusivo riesgo comercial e impositivo.
          </p>
          <p>
            El precio que paga el cliente es el mismo con código de referido o sin él: la comisión sale del
            margen de quien publica el producto, no de un recargo.
          </p>

          <h2 id="developers">4. Publicar software en el catálogo</h2>
          <h3>4.1 Reparto</h3>
          <p>
            De cada cuota efectivamente cobrada se descuentan <strong>dos comisiones</strong>: la de la
            plataforma y la del afiliado que trajo al cliente. El resto es del developer.
          </p>
          <p>
            <strong>La comisión de la plataforma es la misma para todo el catálogo y no se negocia</strong>:
            no es una participación en el negocio del developer, es lo que cuesta mover la plata —la pasarela
            de pago se queda con la mayor parte de ese número—.
          </p>
          <p>
            <strong>La comisión del afiliado la elige cada developer</strong>, dentro del techo que deja la
            anterior, y queda publicada en la ficha del catálogo. Al cargarla se le muestran, como
            referencia, el promedio y el máximo que paga su rubro.
          </p>
          <p>
            <strong>Esta página no fija ninguno de los dos números.</strong> Los porcentajes vigentes son los
            de las condiciones que cada uno acepta al registrarse, y están a la vista en el panel junto a
            cada cobro y cada liquidación.
          </p>
          <p>
            Cambiar la comisión del afiliado tiene las reglas del punto 3.2. <strong>Los precios de los
            planes se cambian a lo sumo una vez cada 30 días</strong>: el precio publicado en la ficha es el
            que se usa para calcular la comisión. Publicar no tiene costo de alta ni cuota de permanencia.
          </p>
          <h3>4.2 Requisitos de admisión</h3>
          <ul>
            <li>El producto se cobra por suscripción, mensual o anual.</li>
            <li>Da de alta un cliente sin intervención manual (multitenant o aprovisionamiento automático).</li>
            <li>Está terminado, en uso por clientes reales que pagan, y con soporte a cargo del developer.</li>
            <li><strong>Guarda el identificador del afiliado</strong> junto a cada cuenta que llega por un link del programa, y avisa el alta.</li>
            <li>Tiene cargado un <strong>endpoint de estado</strong>: dado ese identificador, contesta en qué plan está esa cuenta. Se consulta a diario.</li>
            <li><strong>Su botón de contratar manda al circuito del catálogo a los clientes que llegaron por un afiliado</strong>, y a su propio checkout a todos los demás.</li>
            <li>Tiene sus planes cargados en la ficha con los <strong>precios reales</strong>, idénticos a los que cobra.</li>
            <li>Le sirve a un rubro identificable.</li>
            <li>El reparto del punto 4.1 le cierra.</li>
          </ul>
          <p>
            Los puntos técnicos —guardar el identificador, el endpoint de estado y el botón— <strong>no
            admiten excepción</strong>: sin ellos, un cliente traído por un afiliado puede contratar meses
            después dentro del software sin que nadie se entere, y ese afiliado no cobra nunca. El webhook de
            activación es obligatorio para los productos que cobran por el circuito del catálogo. La
            especificación está en la <a href="/docs/api">documentación de la API</a>.
          </p>
          <h3>4.3 Cómo se verifica una venta</h3>
          <ul>
            <li>
              <strong>Cobra el catálogo.</strong> El cliente traído por un afiliado paga por la pasarela de
              la plataforma y el reparto se hace sobre ese cobro. El developer recibe su parte por
              liquidación y su sistema recibe el aviso de activación.
            </li>
            <li>
              <strong>Cobra el developer.</strong> Sigue cobrando con su propia pasarela y su propia marca. Se
              consulta a diario el endpoint de estado por cada cuenta traída por un afiliado, y la comisión de
              esas cuentas se debita del saldo del punto 4.4.
            </li>
          </ul>
          <p>
            <strong>El precio nunca se le pregunta al developer.</strong> El endpoint contesta qué plan tiene
            la cuenta; el importe sale de los precios que él mismo publicó. Declarar un plan distinto del
            contratado es un incumplimiento del punto 7.
          </p>
          <p>
            <strong>Si el endpoint deja de responder durante 24 horas, el producto sale del catálogo</strong>{' '}
            y vuelve cuando el developer lo reconecta. Las comisiones devengadas hasta ese momento se
            liquidan igual.
          </p>
          <h3>4.4 Saldo del developer</h3>
          <p>
            El developer que cobra por su cuenta mantiene un <strong>saldo prepago</strong>, del que se
            debitan las comisiones de los clientes que le trajeron los afiliados. El afiliado cobra de dinero
            que ya está acreditado, nunca de una deuda pendiente.
          </p>
          <ul>
            <li>El saldo se carga desde el panel y se debita a medida que se devengan las comisiones.</li>
            <li><strong>Si el saldo llega a cero, el producto sale del catálogo</strong> y vuelve en cuanto se recarga. Los clientes ya suscriptos no se ven afectados y sus comisiones se siguen devengando.</li>
            <li>El panel muestra cada movimiento: qué se cargó, qué se debitó, por qué cliente y por qué período.</li>
          </ul>
          <h3>4.5 Qué pone cada parte</h3>
          <ul>
            <li>
              <strong>El developer:</strong> el producto y su infraestructura, la demo, la puesta en marcha,
              el soporte, la ficha con sus planes y precios reales, el identificador del afiliado guardado en
              cada cuenta, el endpoint de estado, el botón de contratar y los datos de cobro. Responde por la
              veracidad de la ficha y de lo que contesta el endpoint, por la legalidad del producto y por el
              tratamiento de los datos de sus clientes.
            </li>
            <li>
              <strong>La plataforma:</strong> la red de afiliados y su alta, el panel, la generación y el
              seguimiento del identificador de cada cliente traído, la consulta diaria del estado, el cálculo
              de la comisión sobre los precios publicados, el cobro cuando pasa por el catálogo, la
              liquidación por transferencia y el aviso al sistema del developer cuando el pago se confirma,
              con reintentos.
            </li>
          </ul>
          <h3>4.6 Qué no es</h3>
          <p>
            Publicar en el catálogo <strong>no es una adquisición, una sociedad, una exclusividad ni una
            cesión de clientes</strong>. El producto sigue siendo del developer y corre en su infraestructura;
            el cliente usa su marca y le escribe a él. El developer puede seguir vendiendo por sus propios
            canales.
          </p>
          <h3>4.7 Baja del catálogo</h3>
          <p>
            Cualquiera de las partes puede retirar el producto del catálogo avisando por escrito. El retiro{' '}
            <strong>no afecta a los clientes ya suscriptos</strong>: sus cuotas se siguen cobrando y
            repartiendo en las mismas condiciones mientras la suscripción siga activa, y la garantía del
            punto 3.2 sigue corriendo para cada uno hasta que se cumpla su año.
          </p>
          <p>
            Retirar el producto <strong>no cancela las comisiones ya devengadas ni el saldo adeudado</strong>.
            Si el developer deja de contestar el endpoint de estado después del retiro, las comisiones de los
            clientes que siguieran activos se calculan con el último plan informado, hasta que se cumpla el
            año de cada uno o hasta que se acredite que la suscripción terminó. El saldo no consumido se
            devuelve a pedido, descontadas las comisiones pendientes de liquidar.
          </p>

          <h2 id="liquidaciones">5. Cobros, liquidaciones e impuestos</h2>
          <ul>
            <li>
              <strong>Quién cobra.</strong> Según lo que elija cada developer (punto 4.3). En los dos casos{' '}
              <strong>el afiliado cobra lo mismo, en la misma fecha y calculado igual</strong>: sobre el
              precio del plan publicado en la ficha, con el porcentaje del punto 3.2.
            </li>
            <li><strong>Cuándo se liquida.</strong> Una vez por mes, por transferencia a la cuenta que cada uno cargó en su panel (CBU, alias o cuenta de Mercado Pago). Sólo se liquida lo efectivamente cobrado y acreditado.</li>
            <li><strong>Trazabilidad.</strong> El panel muestra cobro por cobro qué corresponde a cada parte y qué está liquidado o pendiente. Ese registro es la base de la liquidación y puede observarse dentro de los 30 días de emitida.</li>
            <li><strong>Datos de cobro.</strong> Cargar mal el CBU o el alias es responsabilidad de quien lo carga. Las transferencias rechazadas se reintentan en la liquidación siguiente, una vez corregidos los datos.</li>
            <li><strong>Mínimo de liquidación.</strong> Los saldos menores al mínimo que informe el panel se acumulan para el mes siguiente. No se pierden.</li>
            <li><strong>Impuestos.</strong> Cada parte es responsable de su situación fiscal, de emitir los comprobantes que correspondan y de las retenciones aplicables. Los porcentajes del programa se entienden siempre sobre importes netos.</li>
            <li><strong>Moneda.</strong> Las operaciones se realizan en pesos argentinos, salvo que el producto informe otra cosa.</li>
          </ul>

          <h2 id="planes">6. Planes y niveles pagos</h2>
          <p>
            El plan Pro del vendedor, los paquetes de contactos, la extensión del lugar, los niveles del
            developer y el regalo de contactos son <strong>opcionales</strong>: ninguno hace falta para
            vender, cobrar comisiones o estar publicado, y ninguno cambia las comisiones.
          </p>
          <p>
            Sus precios, cupos y plazos son los que muestra el panel al momento de contratar; la página{' '}
            <a href={RUTAS.planes}>Planes</a> los lee de ahí. Se expresan en dólares y se cobran en pesos al
            tipo de cambio del día. Los niveles del developer se pagan por período sin débito automático: si
            no se renuevan, la cuenta vuelve al nivel gratuito.
          </p>
          <h3 id="contactos">6.1 Uso de los contactos de prospección</h3>
          <p>
            Los contactos que el vendedor recibe por la prospección —por su plan, por un paquete o de
            regalo de un developer— son datos de negocios obtenidos de fuentes públicas, tratados como
            describe la <a href={RUTAS.privacidad + '#prospeccion'}>política de privacidad</a>. Al
            usarlos, el vendedor se obliga a:
          </p>
          <ul>
            <li><strong>Usarlos sólo para ofrecer el software</strong> del catálogo para el que se le asignaron, al rubro correspondiente. No se pueden revender, ceder, exportar a otras bases ni usar para otro fin.</li>
            <li><strong>Respetar la baja.</strong> Si un negocio pide no ser contactado, no se lo vuelve a contactar por ningún canal, y se lo marca en el CRM para que quede excluido.</li>
            <li><strong>Respetar el Registro Nacional No Llame</strong> (Ley 26.951) y la Ley 25.326 de protección de datos personales en cada contacto que hace.</li>
            <li>Identificarse con su nombre en el primer mensaje y decir de dónde obtuvo el dato si el negocio lo pregunta.</li>
          </ul>
          <p>
            <strong>El vendedor es responsable del uso que hace de cada contacto.</strong> Cada negocio
            se le asigna a un solo vendedor de la red, así que un uso indebido se atribuye sin
            ambigüedad y es causal de suspensión en los términos del punto 8.
          </p>

          <h2 id="conducta">7. Conducta prohibida</h2>
          <p>Estas reglas aplican a afiliados y developers. Está prohibido:</p>
          <ul>
            <li>Prometer funciones, precios, plazos o resultados que el producto no tiene.</li>
            <li>Presentarse como empleado, representante legal o socio de Devaffi o de un developer.</li>
            <li>Enviar spam por cualquier canal —correo, WhatsApp, SMS, redes— o comprar bases de contactos para difundir el código.</li>
            <li>Registrar dominios, perfiles, cuentas o aplicaciones que usen la marca Devaffi o la de un producto del catálogo sin autorización escrita.</li>
            <li>Pujar por esas marcas en campañas de búsqueda pagas, ni usarlas como dominio visible del anuncio.</li>
            <li>Generar altas artificiales, auto-referencias, cuentas duplicadas o cualquier maniobra para devengar comisiones sin una venta real.</li>
            <li>Ofrecer el producto como marca blanca propia.</li>
            <li><strong>Declarar un plan distinto</strong> del que el cliente tiene contratado, o informar como dada de baja una cuenta que sigue activa, para reducir o evitar la comisión del afiliado.</li>
            <li><strong>No informar el alta</strong> de un cliente que llegó por el link de un afiliado, o no guardar su identificador, para que esa venta quede fuera del programa.</li>
            <li>Desviar al checkout propio a un cliente traído por un afiliado cuando el producto se publicó con cobro por el catálogo, o crear planes que no se ofrecen a nadie para declarar en ellos a clientes que pagan otro.</li>
            <li>Dar de baja y volver a crear la cuenta de un cliente para desvincularla del afiliado que lo trajo.</li>
            <li>Publicar software que infrinja derechos de terceros, que no cumpla la normativa aplicable o cuyo funcionamiento no se corresponda con su ficha.</li>
          </ul>
          <p>
            Las comisiones devengadas por operaciones que incumplan este punto no se liquidan, y si ya se
            liquidaron se descuentan de la liquidación siguiente. <strong>Cuando el incumplimiento es del
            developer y dejó a un afiliado sin cobrar una venta real, la comisión se devenga igual</strong> y
            se debita de su saldo, con el producto suspendido hasta que quede saldada.
          </p>

          <h2 id="baja">8. Suspensión y baja de cuentas</h2>
          <ul>
            <li><strong>Baja voluntaria.</strong> Cualquiera puede dar de baja su cuenta cuando quiera, desde el panel o escribiendo a <a href={'mailto:' + MAIL}>{MAIL}</a>. Los saldos devengados y cobrados hasta ese momento se liquidan normalmente.</li>
            <li><strong>Suspensión.</strong> Podemos suspender una cuenta ante un incumplimiento del punto 7, una sospecha razonable de fraude o un pedido de autoridad competente, mientras dure la revisión. Se informa por escrito y con el motivo.</li>
            <li><strong>Baja por incumplimiento.</strong> Confirmado el incumplimiento, la cuenta se da de baja y se pierden las comisiones asociadas a las operaciones afectadas. Las comisiones por ventas legítimas anteriores se liquidan.</li>
            <li><strong>Efecto sobre el cliente.</strong> La baja de un afiliado no afecta al cliente que trajo: su suscripción sigue igual y las comisiones dejan de devengarse.</li>
          </ul>

          <h2 id="propiedad">9. Propiedad intelectual</h2>
          <p>
            La marca Devaffi, su logo y los contenidos de estas páginas son propiedad de su titular (punto 2). El material
            de venta que se entrega a los afiliados se licencia para promocionar los productos del catálogo
            mientras la cuenta esté activa, sin derecho a modificarlo de forma que altere lo que el producto
            hace. Cada developer conserva todos los derechos sobre su software y su marca, y autoriza a
            mostrar su nombre, su logo, sus capturas y su ficha en el catálogo y en el material de la red
            mientras el producto esté publicado.
          </p>

          <h2 id="datos">10. Datos personales</h2>
          <p>
            El tratamiento de datos personales se describe en la{' '}
            <a href={RUTAS.privacidad}>Política de Privacidad</a>, que forma parte de estos términos: qué
            datos se recolectan en el programa de afiliados y developers y en la prospección, con qué finalidad, con quién se
            comparten y cómo ejercer los derechos de la Ley 25.326. Los datos que los clientes cargan dentro
            de un software del catálogo se rigen por la política de ese producto, y el responsable de su
            tratamiento es quien lo publica.
          </p>

          <h2 id="responsabilidad">11. Responsabilidad</h2>
          <p>
            No garantizamos la disponibilidad continua ni la ausencia de errores del sitio ni del panel, y no
            respondemos por interrupciones o fallas de servicios de terceros —pasarelas de pago, proveedores
            de nube o de mensajería— de los que depende el funcionamiento.
          </p>
          <p>
            En ningún caso respondemos por lucro cesante, pérdida de oportunidades comerciales, expectativas
            de comisión no concretadas o daños indirectos. Nuestra responsabilidad total frente a un afiliado o
            un developer se limita a los importes efectivamente devengados a su favor y no liquidados. Nada de
            esto limita la responsabilidad que no pueda excluirse según la Ley 24.240 de Defensa del
            Consumidor y demás normas de orden público.
          </p>

          <h2 id="cambios">12. Cambios en estos términos</h2>
          <p>
            Podemos actualizar estos términos. Los cambios se publican en esta página con su fecha y su número
            de versión. <strong>La versión que rige para cada afiliado o developer es la que aceptó al
            registrarse</strong>, que queda guardada en su cuenta. Cuando un cambio afecta el reparto, la forma
            de liquidación o los requisitos de admisión, se informa por el panel y por correo, y la nueva
            versión rige a partir de su aceptación. Si no se acepta, la cuenta puede darse de baja sin
            penalidad y las comisiones devengadas se liquidan igual.
          </p>

          <h2 id="ley">13. Ley aplicable y jurisdicción</h2>
          <p>
            Estos términos se rigen por la legislación de la República Argentina. Para cualquier controversia,
            las partes se someten a los tribunales ordinarios de la Ciudad Autónoma de Buenos Aires, salvo que
            una norma de orden público disponga otra competencia. Si alguna cláusula resultara inválida, las
            demás siguen vigentes.
          </p>
          <p>
            Consultas sobre este documento:{' '}
            <a href={'mailto:' + MAIL}>{MAIL}</a>.
          </p>
        </div>
      </div>
    </Layout>
  );
}
