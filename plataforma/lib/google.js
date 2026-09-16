/* El intercambio con Google, a mano.
   ==========================================================================
   Flujo de código de autorización: el navegador abre el consentimiento de
   Google y vuelve con un `code`; el servidor lo cambia por un `id_token` y de
   ahí saca el perfil. El `code` no sirve dos veces y viaja por el canal del
   servidor, así que el secreto del cliente nunca sale de acá.

   Se hace a mano y no con una librería de auth por una razón concreta: lo único
   que necesitamos de Google es el email verificado y el nombre. Una librería de
   sesiones completa traería adaptadores de base, tablas propias y un modelo de
   usuario que ya tenemos resuelto en `afiliado`.

   El `id_token` NO se verifica con la clave pública de Google porque no hace
   falta: no llega del navegador, lo devuelve Google por HTTPS a cambio de un
   code que sólo nosotros tenemos. Si algún día el token llegara del cliente,
   esto tiene que pasar a validar firma, `aud` e `iss` — y ahí sí conviene una
   librería. */

const TOKEN_URL = "https://oauth2.googleapis.com/token";

function config() {
  const id = process.env.GOOGLE_CLIENT_ID;
  const secreto = process.env.GOOGLE_CLIENT_SECRET;
  if (!id || !secreto) {
    throw new Error("Faltan GOOGLE_CLIENT_ID y/o GOOGLE_CLIENT_SECRET. Ver DESPLIEGUE.md.");
  }
  return { id, secreto };
}

function leerPayload(idToken) {
  const partes = String(idToken).split(".");
  if (partes.length !== 3) throw new Error("id_token con forma inesperada");
  return JSON.parse(Buffer.from(partes[1], "base64url").toString("utf8"));
}

/**
 * Cambia el `code` del navegador por el perfil de Google.
 * @param {string} code        el que devuelve el consentimiento
 * @param {string} redirectUri la MISMA que se usó al abrirlo, o Google rechaza
 * @returns {Promise<{email:string,nombre:string,foto:string|null}>}
 */
export async function perfilDesdeCode(code, redirectUri) {
  const { id, secreto } = config();

  const respuesta = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: id,
      client_secret: secreto,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  if (!respuesta.ok) {
    const detalle = await respuesta.text().catch(() => "");
    throw new Error(`Google rechazó el código (${respuesta.status}): ${detalle.slice(0, 200)}`);
  }

  const { id_token } = await respuesta.json();
  if (!id_token) throw new Error("Google no devolvió id_token");

  const p = leerPayload(id_token);

  /* Un email sin verificar es un email que alguien dice tener. Con el flujo de
     Google esto no debería pasar nunca, y justamente por eso conviene cortar
     acá si pasa, en vez de crear una cuenta a nombre de otro. */
  if (!p.email || p.email_verified === false) {
    throw new Error("La cuenta de Google no tiene el email verificado");
  }

  return {
    email: String(p.email).toLowerCase(),
    nombre: p.name || p.given_name || p.email.split("@")[0],
    foto: p.picture || null,
  };
}

/** La URL del consentimiento. `estado` vuelve tal cual y sirve de anti-CSRF. */
export function urlDeConsentimiento(redirectUri, estado) {
  const { id } = config();
  const q = new URLSearchParams({
    client_id: id,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    access_type: "online",
    prompt: "select_account",
    state: estado,
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${q}`;
}
