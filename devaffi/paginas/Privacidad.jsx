/* /privacidad-devaffi — política de privacidad de Devaffi.
 *
 * Adapta /legal/privacidad al programa (cuentas, cobros, referidos) y suma lo
 * que ese documento no cubre: la prospección de negocios (#prospeccion). El
 * criterio de la prospección —datos de empresas antes que de personas, sólo
 * contacto comercial del rubro, baja simple, el vendedor responde por el uso—
 * sale de lo definido para la plataforma; si cambia, cambia acá y en el punto
 * 6.1 de /terminos-devaffi.
 *
 * Es noindex, igual que el resto de los legales. */
import React from 'react';
import { Layout, Migas, RUTAS, APP, MAIL, TEL, TEL_HREF } from '../componentes.jsx';

const INDICE = [
  ['responsable', 'Responsable del tratamiento'],
  ['alcance', 'Qué cubre y qué no'],
  ['cuentas', 'Datos de las cuentas'],
  ['referidos', 'Referidos, cookies y almacenamiento local'],
  ['prospeccion', 'Datos de prospección de negocios'],
  ['proveedores', 'Con quién se comparten'],
  ['conservacion', 'Conservación'],
  ['derechos', 'Derechos del titular'],
  ['seguridad', 'Seguridad'],
  ['menores', 'Menores de edad'],
  ['cambios', 'Cambios en esta política'],
];


export default function Privacidad() {
  return (
    <Layout actual="privacidad">
      <section className="dv-hero" style={{ paddingBottom: 48 }}>
        <div className="dv-cont dv-cont--angosto">
          <Migas actual="Privacidad" />
          <h1 className="dv-h1" style={{ maxWidth: 'none' }}>Política de privacidad</h1>
          <p className="dv-version">Versión 1.0 · Última actualización: septiembre de 2026</p>
          <p className="dv-hero-lead" style={{ marginBottom: 0 }}>
            Qué datos tratamos cuando alguien usa Devaffi —como vendedor, como developer o como
            negocio que recibe un contacto comercial—, para qué, con quién se comparten y cómo pedir
            que se corrijan o se borren.
          </p>
        </div>
      </section>

      <div className="dv-legal">
        <div className="dv-cont dv-cont--angosto">
          <nav className="dv-indice" aria-label="Índice">
            <ol>{INDICE.map(([id, t]) => <li key={id}><a href={'#' + id}>{t}</a></li>)}</ol>
          </nav>

          <h2 id="responsable">1. Responsable del tratamiento</h2>
          <p>
            El responsable de los datos que se tratan en Devaffi es su titular, identificado en el{' '}
            <a href={RUTAS.legales}>aviso legal</a>, con domicilio en Buenos Aires, República Argentina.
            Contacto para cualquier cuestión de datos personales:{' '}
            <a href={'mailto:' + MAIL}>{MAIL}</a> · <a href={TEL_HREF}>{TEL}</a>.
          </p>

          <h2 id="alcance">2. Qué cubre y qué no</h2>
          <ul>
            <li><strong>Cubre</strong> las páginas de Devaffi, el panel donde viven las cuentas de vendedores y developers, el seguimiento de referidos, los cobros y liquidaciones, y la prospección de negocios.</li>
            <li><strong>No cubre</strong> los datos que un negocio carga adentro de un software del catálogo. Ese software corre en la infraestructura de quien lo publica, que es el responsable de esa base y tiene su propia política.</li>
          </ul>

          <h2 id="cuentas">3. Datos de las cuentas</h2>
          <p>Quien crea una cuenta entrega estos datos, todos necesarios para que el programa funcione:</p>
          <div className="dv-tabla-caja">
            <table className="dv-tabla">
              <thead><tr><th>Dato</th><th>Para qué</th><th>Base legal</th></tr></thead>
              <tbody>
                <tr><td>Nombre, email y foto de la cuenta de Google</td><td>Crear la cuenta e iniciar sesión</td><td>Ejecución del contrato</td></tr>
                <tr><td>Código de referido</td><td>Atribuir las altas que origina el vendedor</td><td>Ejecución del contrato</td></tr>
                <tr><td>CBU, alias o cuenta de Mercado Pago</td><td>Pagar las liquidaciones</td><td>Ejecución del contrato</td></tr>
                <tr><td>Datos fiscales y comprobantes</td><td>Facturación y obligaciones impositivas</td><td>Obligación legal</td></tr>
                <tr><td>Cobros, comisiones y liquidaciones</td><td>Mostrar cobro por cobro lo devengado y respaldar cada pago</td><td>Contrato / obligación legal</td></tr>
                <tr><td>Versión de las condiciones aceptadas, con fecha</td><td>Acreditar qué aceptó cada uno al registrarse</td><td>Ejecución del contrato</td></tr>
                <tr><td>Número de WhatsApp conectado al CRM (vendedores Pro)</td><td>Enviar y recibir los mensajes del vendedor desde su propio número</td><td>Ejecución del contrato</td></tr>
                <tr><td>Ficha del producto, planes y datos técnicos de la API (developers)</td><td>Publicar el producto y activar los planes vendidos</td><td>Ejecución del contrato</td></tr>
              </tbody>
            </table>
          </div>
          <h3>3.1 Qué ve cada parte</h3>
          <ul>
            <li><strong>El vendedor</strong> ve las cuentas atribuidas a su código con los datos mínimos para identificarlas y el importe que le corresponde de cada cobro. No accede a lo que ese negocio carga dentro del software.</li>
            <li><strong>El developer</strong> recibe los datos necesarios para dar de alta al cliente y activarle el plan. Desde ahí, ese cliente es suyo y sus datos se rigen por la política del producto.</li>
            <li><strong>Devaffi</strong> ve el cobro y el reparto entre las partes, que es lo que permite liquidar sin que nadie dependa de la palabra del otro.</li>
          </ul>

          <h2 id="referidos">4. Referidos, cookies y almacenamiento local</h2>
          <p>
            El link de un vendedor pasa por Devaffi antes de llegar al sitio del producto. En ese paso se
            genera un <strong>identificador de la visita</strong> que viaja en la URL, y que el software
            del developer guarda junto a la cuenta si la persona se registra. Es lo que permite atribuir
            la venta aunque el pago llegue meses después.
          </p>
          <p>
            El panel usa una cookie de sesión, imprescindible para mantener la sesión iniciada. Las
            páginas pueden usar herramientas de análisis de tráfico que miden visitas de forma agregada;
            se pueden deshabilitar desde la configuración del navegador sin perder acceso al contenido.
          </p>

          <h2 id="prospeccion">5. Datos de prospección de negocios</h2>
          <p>
            Los vendedores con plan Pro, los que compran un paquete de contactos y los que reciben
            contactos de regalo de un developer obtienen en su CRM una lista de negocios del rubro al que
            apunta el software que venden. Este punto explica de dónde salen esos datos y cómo se tratan.
          </p>
          <h3>5.1 De dónde salen</h3>
          <p>
            Los contactos se obtienen de <strong>información publicada por los propios negocios</strong>{' '}
            en fuentes de acceso público —principalmente su ficha en Google Maps—, mediante búsquedas
            automatizadas por rubro y zona. Se recopilan sólo los datos que el negocio hizo públicos para
            ser contactado comercialmente: nombre comercial, rubro, ciudad y dirección, teléfono, sitio web y perfil de Instagram. Los negocios sin teléfono publicado no se incorporan.
          </p>
          <h3>5.2 El criterio</h3>
          <ul>
            <li><strong>Datos de empresas, no de personas.</strong> Se prioriza el dato del comercio o la empresa. No se buscan ni se completan datos personales de dueños o empleados.</li>
            <li><strong>Sólo para contacto comercial del rubro.</strong> Cada contacto se usa para ofrecer el software para el que se asignó, a un negocio del rubro al que ese software apunta. No se vende, no se cede y no se usa para publicidad masiva.</li>
            <li><strong>Un negocio, un vendedor.</strong> Cada negocio se asigna a un solo vendedor de toda la red: no lo contactan varios vendedores por el mismo motivo.</li>
            <li><strong>Baja simple.</strong> Cualquier negocio puede pedir que no lo contacten más, por la misma vía por la que lo contactaron o escribiendo a <a href={'mailto:' + MAIL}>{MAIL}</a>. Queda excluido de la prospección para toda la red.</li>
            <li><strong>Registro No Llame.</strong> La prospección respeta el Registro Nacional No Llame (Ley 26.951) y la Ley 25.326 de protección de datos personales.</li>
          </ul>
          <h3>5.3 Quién responde por el contacto</h3>
          <p>
            El vendedor es quien decide contactar a cada negocio y cómo hacerlo, y{' '}
            <strong>es responsable del uso que hace de cada contacto</strong>, en los términos del{' '}
            <a href={RUTAS.terminos + '#contactos'}>punto 6.1 de los términos</a>. Un uso indebido
            —spam, insistencia después de una baja, reventa de la lista— es causal de suspensión.
          </p>
          <h3>5.4 Si recibiste un contacto de un vendedor de Devaffi</h3>
          <p>
            Podés pedir en cualquier momento que no te contacten más, saber qué datos de tu negocio
            tenemos y de dónde salieron, corregirlos o pedir que se borren. Escribí a{' '}
            <a href={'mailto:' + MAIL}>{MAIL}</a> con el nombre del negocio y, si lo tenés, el número o
            el correo desde el que te escribieron.
          </p>

          <h2 id="proveedores">6. Con quién se comparten los datos</h2>
          <p>
            <strong>No vendemos ni cedemos datos personales.</strong> Los compartimos sólo con los
            proveedores necesarios para prestar el servicio, y sólo lo que cada uno necesita:
          </p>
          <ul>
            <li><strong>Google</strong> — inicio de sesión con cuenta de Google, fuente de las fichas públicas de negocios y análisis de tráfico.</li>
            <li><strong>Pasarelas de pago</strong> (Mercado Pago y dLocal Go) — cobro de las suscripciones y de los planes, y transferencias de liquidación.</li>
            <li><strong>Proveedor de WhatsApp</strong> — conexión del número del vendedor a su CRM.</li>
            <li><strong>Servicio de extracción de datos públicos</strong> — ejecuta las búsquedas automatizadas de fichas de negocios por rubro y ciudad.</li>
            <li><strong>Infraestructura</strong> — servidores donde corren las páginas, el panel y la API.</li>
            <li><strong>Developers del catálogo</strong> — reciben los datos necesarios para activar el plan del cliente que compró su producto.</li>
            <li><strong>Autoridades competentes</strong> — cuando una norma o una orden judicial lo exige.</li>
          </ul>
          <p>
            Algunos proveedores están fuera de la Argentina, por lo que puede haber una transferencia
            internacional de datos en los términos del artículo 12 de la Ley 25.326. Se trabaja con
            proveedores que ofrecen un nivel adecuado de protección y se transfiere sólo lo necesario.
          </p>

          <h2 id="conservacion">7. Conservación</h2>
          <ul>
            <li><strong>Cuentas:</strong> mientras estén activas. Dada de baja una cuenta, los registros de cobros, comisiones y liquidaciones se conservan por los plazos que exige la normativa contable e impositiva.</li>
            <li><strong>Contactos de prospección:</strong> mientras estén asignados y en uso por un vendedor. Los negocios que pidieron la baja se conservan sólo como exclusión, para no volver a contactarlos.</li>
            <li><strong>Analítica:</strong> datos agregados, según los plazos de la herramienta.</li>
          </ul>

          <h2 id="derechos">8. Derechos del titular</h2>
          <p>
            De acuerdo con la Ley 25.326, el titular de los datos puede acceder a ellos, pedir que se
            rectifiquen, que se supriman y oponerse a su tratamiento. Para hacerlo, escribí a{' '}
            <a href={'mailto:' + MAIL}>{MAIL}</a> con tu nombre (o el de tu negocio) y el pedido concreto.
            Respondemos en un plazo máximo de 10 días corridos para el acceso y de 5 días hábiles para la
            rectificación o supresión.
          </p>
          <p>
            También podés presentar un reclamo ante la <strong>Agencia de Acceso a la Información
            Pública</strong>, órgano de control de la Ley 25.326. Si el pedido es sobre datos cargados
            dentro de un software del catálogo, se dirige a quien lo publica; si nos llega a nosotros, lo
            derivamos y te avisamos.
          </p>

          <h2 id="seguridad">9. Seguridad</h2>
          <p>
            Usamos conexiones cifradas, credenciales de API que viven sólo en el servidor, acceso al panel
            restringido por rol y firmas para la comunicación entre sistemas. Aun así, ninguna transmisión
            por internet es absolutamente segura.
          </p>

          <h2 id="menores">10. Menores de edad</h2>
          <p>
            Devaffi está dirigido a mayores de 18 años. Si detectamos que una cuenta pertenece a un menor,
            se da de baja y se eliminan sus datos, salvo los que haya que conservar por obligación legal.
          </p>

          <h2 id="cambios">11. Cambios en esta política</h2>
          <p>
            Podemos actualizar esta política. Los cambios se publican en esta página con su fecha y su
            versión. Si un cambio afecta de forma sustancial a quienes tienen cuenta, se avisa además por{' '}
            <a href={APP} target="_blank" rel="noopener">el panel</a> y por correo.
          </p>
        </div>
      </div>
    </Layout>
  );
}
