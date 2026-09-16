import { redirect } from "next/navigation";
import Acceso from "@/components/Acceso";
import { afiliadoActual } from "@/lib/afiliado-actual";
import { PASOS, PROMESAS, PCT_AFILIADO } from "@/lib/programa";

export const dynamic = "force-dynamic";

/* La pantalla de entrada.
   ==========================================================================
   Una simbiosis de las dos pantallas que Vet tiene separadas: informa como su
   landing de afiliados y deja entrar como su login. Van juntas porque a esta
   URL llegan dos personas distintas —el que vuelve a su panel y el que recién
   hizo clic desde la vidriera— y mandar a cualquiera de los dos a una segunda
   pantalla es perder al otro.

   Lo que se cuenta acá es el resumen, no la vidriera entera: g360ia.com.ar/afiliados
   sigue siendo la que explica, la que se indexa y la que pelea el buscador.
   Repetirla completa sería partir la misma señal en dos dominios. */
export default async function Entrada({ searchParams }) {
  const afiliado = await afiliadoActual();
  if (afiliado) redirect("/panel");

  return (
    <main className="entrada">
      <section className="entrada__info">
        <a className="marca" href="https://g360ia.com.ar">
          Gestion<span className="num">360</span><span className="ia">.iA</span>
        </a>

        <span className="volanta">Programa de afiliados</span>
        <h2 className="titulo">
          Vendé software<br />
          y <em>cobrá todos los meses</em>
        </h2>
        <p className="bajada">
          Elegís del catálogo, compartís tu código de referido y cobrás un porcentaje de cada
          cuota que paguen los negocios que traés — mes a mes, mientras sigan suscriptos.
        </p>

        <div className="cinta">
          <div className="cinta__n">{PCT_AFILIADO}%</div>
          <p className="cinta__t">
            <strong>de cada pago, todos los meses, en todo el catálogo.</strong> Es el mismo
            porcentaje para todos los productos: no tenés que comparar comisiones para elegir
            cuál vender, sólo cuál le sirve más al negocio que tenés enfrente.
          </p>
        </div>

        <ol className="pasos">
          {PASOS.map((p) => (
            <li className="paso" key={p.n}>
              <span className="paso__n" aria-hidden="true">{p.n}</span>
              <div>
                <p className="paso__t">{p.titulo}</p>
                <p className="paso__d">{p.texto}</p>
              </div>
            </li>
          ))}
        </ol>

        <ul className="promesas">
          {PROMESAS.map((t) => (
            <li key={t}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6"
                   strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12l5 5L20 7" />
              </svg>
              {t}
            </li>
          ))}
        </ul>
      </section>

      <section className="entrada__acceso">
        <Acceso errorInicial={mensajeDeError(searchParams?.error)} />
      </section>
    </main>
  );
}

/* Los errores vuelven de Google como un parámetro en la URL, así que el texto
   se arma acá y no en el cliente: el cliente no debería tener que saber qué
   códigos existen. Cualquier código desconocido cae en un mensaje genérico —
   mostrarle a la persona el código crudo no la ayuda a resolver nada. */
function mensajeDeError(codigo) {
  if (!codigo) return null;
  const mensajes = {
    alias_tomado:
      "Ese código ya lo está usando otro afiliado. Probá con otro y volvé a entrar.",
    alias_invalido:
      "El código tiene que empezar con una letra o un número y tener al menos dos caracteres.",
    falta_alias:
      "Sos nuevo acá, así que necesitás elegir tu código de referido antes de continuar.",
    google: "Google no pudo confirmar tu cuenta. Probá de nuevo.",
    estado: "El acceso venció mientras estabas en Google. Volvé a intentarlo.",
  };
  return mensajes[codigo] ?? "No pudimos completar el acceso. Probá de nuevo en un momento.";
}
