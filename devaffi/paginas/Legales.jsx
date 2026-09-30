/* /legales-devaffi — la puerta a los legales y el aviso legal.
 *
 * Tres documentos: este aviso (quién es el titular y reglas de uso del
 * sitio), los términos del programa y la política de privacidad, que incluye
 * la prospección. Es el único lugar, además del pie, que nombra a la empresa
 * titular: la ley pide identificarla. noindex, como el resto de los legales. */
import React from 'react';
import { Layout, Migas, Icono, Flecha, RUTAS, MAIL, TEL, TEL_HREF } from '../componentes.jsx';

const DOCS = [
  ['libro', 'Términos del programa', 'Las reglas para vendedores y developers: comisión, cupos, atribución, requisitos, cobros y conducta.', RUTAS.terminos],
  ['escudo', 'Política de privacidad', 'Qué datos se tratan, para qué, con quién se comparten y cómo ejercer tus derechos.', RUTAS.privacidad],
  ['diana', 'Datos de prospección', 'De dónde salen los contactos de negocios que reciben los vendedores, cómo se usan y cómo pedir la baja.', RUTAS.privacidad + '#prospeccion'],
];

export default function Legales() {
  return (
    <Layout actual="legales">
      <section className="dv-hero" style={{ paddingBottom: 48 }}>
        <div className="dv-cont dv-cont--angosto">
          <Migas actual="Legales" />
          <h1 className="dv-h1" style={{ maxWidth: 'none' }}>Legales</h1>
          <p className="dv-hero-lead" style={{ marginBottom: 0 }}>
            Todo lo que regula el uso de Devaffi, escrito para que se entienda. Si tenés una duda que
            no está respondida acá, escribinos.
          </p>
        </div>
      </section>

      <section className="dv-sec dv-sec--corta dv-sec--suave">
        <div className="dv-cont dv-cont--angosto">
          <div className="dv-grid">
            {DOCS.map(([ic, t, p, h]) => (
              <a className="dv-card" href={h} key={t} style={{ flexDirection: 'row', gap: 18, alignItems: 'flex-start' }}>
                <span className="dv-card-ico" style={{ marginBottom: 0, flex: 'none' }}><Icono n={ic} /></span>
                <span style={{ flex: 1 }}>
                  <h2 className="dv-h3" style={{ marginBottom: 4 }}>{t}</h2>
                  <p style={{ margin: 0 }}>{p}</p>
                </span>
                <span className="dv-card-mas" style={{ paddingTop: 10, marginTop: 0 }}><Flecha /></span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <div className="dv-legal">
        <div className="dv-cont dv-cont--angosto">
          <h2 id="aviso-legal" style={{ marginTop: 0 }}>Aviso legal</h2>

          <h3>Titular</h3>
          <p>
            Devaffi y estas páginas son de titularidad de <strong>Gestión 360 IA</strong>, con domicilio
            en Buenos Aires, República Argentina. Contacto:{' '}
            <a href={'mailto:' + MAIL}>{MAIL}</a> · <a href={TEL_HREF}>{TEL}</a>. Los datos de
            inscripción fiscal se informan en la facturación de cada operación y a pedido por ese correo.
          </p>

          <h3>Uso del sitio</h3>
          <p>
            El acceso a estas páginas es libre y gratuito. Su contenido tiene carácter informativo: no
            constituye asesoramiento legal, contable ni financiero, y no es una oferta en los términos del
            artículo 972 del Código Civil y Comercial de la Nación. Las calculadoras son estimaciones para
            dimensionar, no proyecciones de ingresos. Al usar el sitio te comprometés a no intentar acceder
            a sistemas o datos que no estén publicados y a no automatizar consultas más allá del uso
            razonable de una persona.
          </p>

          <h3>Precios</h3>
          <p>
            Los precios de los planes son los que muestra el panel al momento de contratar; la página de{' '}
            <a href={RUTAS.planes}>planes</a> los lee de ahí. Los precios de cada software del catálogo
            son los que publica su developer.
          </p>

          <h3>Propiedad intelectual</h3>
          <p>
            La marca Devaffi, su logo, los textos, el diseño y el código de estas páginas están protegidos
            por la legislación argentina e internacional. Su reproducción o uso requiere autorización
            previa y por escrito. Las marcas y capturas de los productos del catálogo son de sus
            respectivos developers.
          </p>

          <h3>Enlaces externos</h3>
          <p>
            Algunas páginas enlazan a sitios de terceros —los productos del catálogo, las pasarelas de
            pago, la documentación de proveedores—. No respondemos por su contenido ni por sus políticas.
          </p>

          <h3>Ley aplicable</h3>
          <p>
            Rige la legislación de la República Argentina. Para cualquier controversia son competentes los
            tribunales ordinarios de la Ciudad Autónoma de Buenos Aires, salvo que una norma de orden
            público disponga otra cosa.
          </p>

          <p className="dv-version" style={{ marginTop: 32 }}>
            Última actualización: septiembre de 2026
          </p>
        </div>
      </div>
    </Layout>
  );
}
