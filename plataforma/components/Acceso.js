"use client";

import { useId, useState } from "react";
import { normalizarAlias, aliasValido, ALIAS_LARGO_MAX } from "@/lib/alias";
import { PCT_AFILIADO, PCT_DEVELOPER } from "@/lib/programa";

/* La puerta: entrar de un lado, registrarse del otro.
   ==========================================================================
   Es el mismo patrón que el login de Vet —dos caras y un panel que se desliza
   tapando una— con una diferencia: del lado de registrarse hay que elegir a qué
   venís, porque todavía no existís y el sistema no tiene cómo saberlo.

   ── Por qué entrar NO pregunta el lado ─────────────────────────────────────
   El email de Google ya dice quién sos: si tu cuenta es de developer, el
   servidor te manda a tu panel sin consultarte. Preguntarlo sería hacerle
   recordar a la persona un dato que la base ya tiene, y darle la chance de
   equivocarse en algo que no admite error.

   ── Por qué el alias va ANTES del botón ────────────────────────────────────
   El consentimiento de Google se abre con el clic y la vuelta ya trae la cuenta
   creada: después del botón no hay un después donde pedir nada. Si se pidiera al
   volver habría que sostener un estado «cuenta a medio crear», que es
   exactamente el tipo de estado que después queda colgado.

   `activo` es la única fuente de verdad —false = entrar, true = registrarse— y
   baja como `data-activo` para que el CSS haga la animación. Las caras ocultas
   van con `inert` para que no atrapen el foco por detrás del panel. */
export default function Acceso({ errorInicial }) {
  const idAlias = useId();
  const [activo, setActivo] = useState(false);
  const [rol, setRol] = useState("afiliado");
  const [alias, setAlias] = useState("");
  const [yendo, setYendo] = useState(false);

  const limpio = normalizarAlias(alias);
  const necesitaAlias = rol === "afiliado";
  const puedeCrear = !necesitaAlias || aliasValido(alias);

  function ir(registrando) {
    setYendo(true);
    const q = new URLSearchParams();
    if (registrando) {
      q.set("rol", rol);
      if (necesitaAlias) q.set("alias", limpio);
    }
    /* Navegación entera y no fetch: el consentimiento de Google es una página
       suya, no algo que se pueda pedir por detrás. */
    window.location.href = `/api/auth/google?${q}`;
  }

  return (
    <div className="auth" data-activo={activo ? "si" : "no"}>
      {errorInicial && (
        <p className="auth__error" role="alert">
          {errorInicial}
        </p>
      )}

      <div className="auth__shell">
        {/* ── Cara: entrar ─────────────────────────────────────────── */}
        <div className="auth__cara auth__cara--entrar" inert={activo ? "" : undefined}>
          <h1 className="auth__titulo">Entrar</h1>
          <p className="auth__sub">
            Con la cuenta de Google con la que te registraste. Te llevamos a tu panel.
          </p>
          <BotonGoogle onClick={() => ir(false)} yendo={yendo} texto="Entrar con Google" />
        </div>

        {/* ── Cara: registrarse ────────────────────────────────────── */}
        <div className="auth__cara auth__cara--crear" inert={activo ? undefined : ""}>
          <h1 className="auth__titulo">Crear cuenta</h1>
          <p className="auth__sub">¿A qué venís?</p>

          <div className="roles" role="radiogroup" aria-label="Tipo de cuenta">
            <button
              type="button"
              role="radio"
              aria-checked={rol === "afiliado"}
              className={`rol${rol === "afiliado" ? " rol--elegido" : ""}`}
              onClick={() => setRol("afiliado")}
            >
              <span className="rol__t">Vengo a vender</span>
              <span className="rol__d">
                Presentás el software del catálogo con tu código y cobrás el {PCT_AFILIADO}% de
                cada cuota, todos los meses.
              </span>
            </button>

            <button
              type="button"
              role="radio"
              aria-checked={rol === "developer"}
              className={`rol${rol === "developer" ? " rol--elegido" : ""}`}
              onClick={() => setRol("developer")}
            >
              <span className="rol__t">Vengo a publicar</span>
              <span className="rol__d">
                Publicás tu software y una red de afiliados lo vende. Te queda el{" "}
                {PCT_DEVELOPER}% de cada cuota.
              </span>
            </button>
          </div>

          {necesitaAlias && (
            <>
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
                />
                <span className="campo__ay">
                  Una palabra, la que uses para presentarte. Después no se puede cambiar.
                </span>
              </label>

              <p className={`previa${limpio ? "" : " previa--vacia"}`} aria-live="polite">
                {limpio ? (
                  <>
                    g360ia.com.ar/r/<strong>{limpio}</strong>
                  </>
                ) : (
                  "Escribí tu código y acá vas a ver el link que vas a repartir."
                )}
              </p>
            </>
          )}

          <BotonGoogle
            onClick={() => ir(true)}
            yendo={yendo}
            disabled={!puedeCrear}
            texto="Crear cuenta con Google"
          />

          <p className="auth__condiciones">
            Al crear la cuenta aceptás el reparto de cada cuota:{" "}
            <strong>{PCT_DEVELOPER}% para quien hizo el software, {PCT_AFILIADO}% para el
            afiliado y 30% para Gestión 360 IA</strong>. No se negocia por producto.
          </p>
        </div>

        {/* ── El panel que se desliza ──────────────────────────────── */}
        <div className="auth__overlay" aria-hidden="true">
          <div className="auth__overlay-cara auth__overlay-cara--izq">
            <p className="auth__overlay-t">¿Ya tenés cuenta?</p>
            <p className="auth__overlay-d">Entrá y seguí donde lo dejaste.</p>
            <button type="button" className="auth__fantasma" onClick={() => setActivo(false)}>
              Entrar
            </button>
          </div>
          <div className="auth__overlay-cara auth__overlay-cara--der">
            <p className="auth__overlay-t">¿Primera vez?</p>
            <p className="auth__overlay-d">
              Creá tu cuenta en un minuto. Sin costo y sin exclusividad.
            </p>
            <button type="button" className="auth__fantasma" onClick={() => setActivo(true)}>
              Crear cuenta
            </button>
          </div>
        </div>
      </div>

      {/* En teléfono el panel deslizante no entra, así que el cambio de cara es
          este link. Se oculta en escritorio, donde el overlay ya lo hace. */}
      <p className="auth__cambiar">
        {activo ? (
          <>
            ¿Ya tenés cuenta?{" "}
            <button type="button" onClick={() => setActivo(false)}>Entrar</button>
          </>
        ) : (
          <>
            ¿Primera vez?{" "}
            <button type="button" onClick={() => setActivo(true)}>Crear cuenta</button>
          </>
        )}
      </p>
    </div>
  );
}

function BotonGoogle({ onClick, yendo, disabled, texto }) {
  return (
    <button
      type="button"
      className="boton-google"
      onClick={onClick}
      disabled={yendo || disabled}
    >
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path fill="#4285F4" d="M45.1 24.5c0-1.6-.1-2.8-.4-4H24v7.3h12.1c-.2 2-1.6 5-4.5 7l6.9 5.4c4.1-3.8 6.6-9.4 6.6-15.7z" />
        <path fill="#34A853" d="M24 46c5.9 0 10.9-2 14.5-5.3l-6.9-5.4c-1.9 1.3-4.4 2.2-7.6 2.2-5.8 0-10.7-3.8-12.5-9.1l-7.1 5.5C8 41.3 15.4 46 24 46z" />
        <path fill="#FBBC05" d="M11.5 28.4c-.5-1.4-.7-2.9-.7-4.4s.3-3 .7-4.4l-7.1-5.5C2.9 17 2 20.4 2 24s.9 7 2.4 9.9l7.1-5.5z" />
        <path fill="#EA4335" d="M24 10.3c4.1 0 6.9 1.8 8.5 3.3l6.2-6C34.9 4.1 29.9 2 24 2 15.4 2 8 6.7 4.4 14.1l7.1 5.5c1.8-5.3 6.7-9.3 12.5-9.3z" />
      </svg>
      {yendo ? "Abriendo Google…" : texto}
    </button>
  );
}
