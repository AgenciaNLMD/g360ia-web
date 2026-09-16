import { redirect } from "next/navigation";
import Acceso from "@/components/Acceso";
import { cuentaActual, panelDe } from "@/lib/cuenta-actual";

export const dynamic = "force-dynamic";

/* La puerta de la plataforma.
   ==========================================================================
   Una sola para los dos lados. Quien ya entró no la ve: cae directo en el panel
   que le toca según su rol.

   Lo que NO hace esta página es explicar el programa. Eso ya está en
   g360ia.com.ar/afiliados y en /developers, que son públicas, se indexan y
   pelean el buscador. Repetirlo acá sería competirles con una página que lleva
   noindex — y a quien llega hasta este dominio ya le vendieron la idea: viene a
   entrar, no a leerla de nuevo. */
export default async function Puerta({ searchParams }) {
  const cuenta = await cuentaActual();
  if (cuenta) redirect(panelDe(cuenta.rol));

  return (
    <main className="puerta">
      <a className="marca" href="https://g360ia.com.ar">
        Gestion<span className="num">360</span><span className="ia">.iA</span>
      </a>

      <Acceso errorInicial={mensajeDeError(searchParams?.error)} />

      <nav className="legal" aria-label="Legales">
        <a href="https://g360ia.com.ar/afiliados">Cómo funciona</a>
        <span aria-hidden="true">·</span>
        <a href="https://g360ia.com.ar/legal/terminos">Términos</a>
        <span aria-hidden="true">·</span>
        <a href="https://g360ia.com.ar/legal/privacidad">Privacidad</a>
      </nav>
    </main>
  );
}

/* Los errores vuelven de Google como un parámetro en la URL, así que el texto se
   arma acá: el cliente no debería tener que saber qué códigos existen. Un código
   desconocido cae en el genérico — mostrarle el código crudo a la persona no la
   ayuda a resolver nada. */
function mensajeDeError(codigo) {
  if (!codigo) return null;
  const mensajes = {
    alias_tomado: "Ese código ya lo está usando otro afiliado. Probá con otro.",
    alias_invalido:
      "El código tiene que empezar con letra o número y tener al menos dos caracteres.",
    falta_registro:
      "Esa cuenta de Google todavía no está registrada. Creá tu cuenta desde «Primera vez».",
    rol_invalido: "Elegí si venís a vender o a publicar antes de crear la cuenta.",
    google: "Google no pudo confirmar tu cuenta. Probá de nuevo.",
    estado: "El acceso venció mientras estabas en Google. Volvé a intentarlo.",
    sin_configurar:
      "El acceso todavía no está habilitado. Escribinos y lo resolvemos en el momento.",
  };
  return mensajes[codigo] ?? "No pudimos completar el acceso. Probá de nuevo en un momento.";
}
