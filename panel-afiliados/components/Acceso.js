"use client";

import { useEffect, useId, useState } from "react";
import { normalizarAlias, aliasValido, ALIAS_LARGO_MAX } from "@/lib/alias";

/* El acceso: entrar y registrarse en la misma caja.
   ==========================================================================
   Es un solo botón de Google para los dos casos, y el servidor decide cuál es:
   si el email ya tiene cuenta entra, y si no la crea. Preguntarle a alguien
   «¿ya tenés cuenta?» antes de dejarlo pasar es hacerle recordar algo que el
   servidor ya sabe.

   ── Por qué el alias va ANTES del botón ────────────────────────────────────
   El consentimiento de Google se abre con el clic y la vuelta ya trae la cuenta
   creada: después del botón no hay un después donde pedir nada. Si el alias se
   pidiera al volver, habría que sostener un estado «cuenta a medio crear», que
   es exactamente el tipo de estado que después queda colgado.

   El campo está vacío para el que vuelve, y no pasa nada: sólo se manda si hay
   algo escrito, y el servidor lo ignora en quien ya tiene cuenta.

   ── La vista previa es el punto del formulario ─────────────────────────────
   El alias es lo único que la persona elige y lo único que después no se puede
   cambiar —ya está impreso en los flyers que repartió—. Se dibuja con la misma
   `normalizarAlias()` que valida el servidor: una versión aproximada acá sería
   prometer un link que el servidor después rechaza, o peor, guardar otro. */
export default function Acceso({ errorInicial }) {
  const idAlias = useId();
  const [alias, setAlias] = useState("");
  const [yendo, setYendo] = useState(false);
  const [origen, setOrigen] = useState("");

  /* En el servidor no hay `window`, así que el origen entra en el segundo
     render. Mientras tanto se dibuja el camino relativo, que ya dice lo que
     importa. */
  useEffect(() => setOrigen(window.location.origin), []);

  const limpio = normalizarAlias(alias);
  const valido = aliasValido(alias);

  function entrar() {
    setYendo(true);
    const q = new URLSearchParams();
    if (valido) q.set("alias", limpio);
    /* Navegación entera y no fetch: el consentimiento de Google es una página
       suya, no algo que se pueda pedir por detrás. */
    window.location.href = `/api/auth/google?${q}`;
  }

  return (
    <div className="caja">
      <h1 className="caja__titulo">Entrá a tu panel</h1>
      <p className="caja__bajada">
        Con tu cuenta de Google. Si todavía no sos afiliado, se crea en el mismo paso y tu
        código queda activo en el momento.
      </p>

      {errorInicial && (
        <p className="error" role="alert">
          {errorInicial}
        </p>
      )}

      <label className="campo" htmlFor={idAlias}>
        <span className="campo__et">Tu código de referido</span>
        <input
          id={idAlias}
          value={alias}
          onChange={(e) => setAlias(e.target.value)}
          placeholder="pablo"
          maxLength={ALIAS_LARGO_MAX}
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          disabled={yendo}
          aria-describedby={`${idAlias}-previa`}
        />
        <span className="campo__ay">
          Una palabra, la que uses para presentarte. Después no se puede cambiar: va impresa en
          todo lo que repartas. Si ya tenés cuenta, dejalo vacío.
        </span>
      </label>

      <p
        id={`${idAlias}-previa`}
        className={`previa${limpio ? "" : " previa--vacia"}`}
        aria-live="polite"
      >
        {limpio ? (
          <>
            {origen || ""}/r/<strong>{limpio}</strong>
          </>
        ) : (
          "Escribí tu código y acá vas a ver el link que vas a repartir."
        )}
      </p>

      <div className="separador">tu acceso</div>

      <button type="button" className="boton-google" onClick={entrar} disabled={yendo}>
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <path fill="#4285F4" d="M45.1 24.5c0-1.6-.1-2.8-.4-4H24v7.3h12.1c-.2 2-1.6 5-4.5 7l6.9 5.4c4.1-3.8 6.6-9.4 6.6-15.7z" />
          <path fill="#34A853" d="M24 46c5.9 0 10.9-2 14.5-5.3l-6.9-5.4c-1.9 1.3-4.4 2.2-7.6 2.2-5.8 0-10.7-3.8-12.5-9.1l-7.1 5.5C8 41.3 15.4 46 24 46z" />
          <path fill="#FBBC05" d="M11.5 28.4c-.5-1.4-.7-2.9-.7-4.4s.3-3 .7-4.4l-7.1-5.5C2.9 17 2 20.4 2 24s.9 7 2.4 9.9l7.1-5.5z" />
          <path fill="#EA4335" d="M24 10.3c4.1 0 6.9 1.8 8.5 3.3l6.2-6C34.9 4.1 29.9 2 24 2 15.4 2 8 6.7 4.4 14.1l7.1 5.5c1.8-5.3 6.7-9.3 12.5-9.3z" />
        </svg>
        {yendo ? "Abriendo Google…" : "Continuar con Google"}
      </button>

      <p className="condiciones">
        Al entrar aceptás las condiciones del programa: el reparto de cada cuota es{" "}
        <strong>50% para quien hizo el software, 20% para vos y 30% para Gestión 360 IA</strong>,
        y no se negocia por producto.
      </p>

      <p className="volver">
        ¿Todavía estás decidiendo? <a href="https://g360ia.com.ar/afiliados">Leé cómo funciona</a>
      </p>

      <nav className="legal" aria-label="Legales">
        <a href="https://g360ia.com.ar/legal/terminos">Términos</a>
        <span aria-hidden="true">·</span>
        <a href="https://g360ia.com.ar/legal/privacidad">Privacidad</a>
      </nav>
    </div>
  );
}
