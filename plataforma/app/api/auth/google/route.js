import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { perfilDesdeCode, urlDeConsentimiento } from "@/lib/google";
import { unaFila } from "@/lib/db";
import { armarCookie, cookieOpciones } from "@/lib/sesion";
import { panelDe } from "@/lib/cuenta-actual";
import { normalizarAlias, aliasValido } from "@/lib/alias";
import { CONDICIONES_VERSION } from "@/lib/programa";

export const dynamic = "force-dynamic";

/* La ida y la vuelta de Google, en una sola ruta.
   ==========================================================================
   Sin `code` es la ida: guarda qué venía a hacer la persona y manda al
   consentimiento. Con `code` es la vuelta: cambia el código por el perfil,
   busca o crea la cuenta, y deja la sesión.

   ── Entrar y registrarse llegan acá igual, y la diferencia es una sola ─────
   Si la persona venía de «Entrar» no mandó rol, y entonces la cuenta TIENE que
   existir: si no existe, no se inventa un rol por ella. Si venía de «Crear
   cuenta» mandó rol, y si ya existía se ignora — el rol se elige una vez.

   ── Por qué el rol y el alias viajan en cookie y no en el `state` ──────────
   El `state` vuelve del navegador y podría venir modificado. El `state` queda
   para lo único que tiene que hacer: probar que esta vuelta corresponde a una
   ida nuestra (anti-CSRF). */

const COOKIE_ESTADO = "g360_oauth";
const COOKIE_INTENCION = "g360_intencion";

function urlDeVuelta(req) {
  /* Idéntica en la ida y en la vuelta, y declarada en Google Cloud. Se arma del
     origen público y no de `req.url`, que detrás del proxy llega como
     http://127.0.0.1. */
  const base = process.env.APP_URL || new URL(req.url).origin;
  return `${base.replace(/\/+$/, "")}/api/auth/google`;
}

function alaPuerta(req, error) {
  const base = process.env.APP_URL || new URL(req.url).origin;
  const url = new URL(base);
  if (error) url.searchParams.set("error", error);
  return NextResponse.redirect(url, { status: 303 });
}

export async function GET(req) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const tarro = cookies();

  /* ── IDA ───────────────────────────────────────────────────────────── */
  if (!code) {
    if (url.searchParams.get("error")) return alaPuerta(req, "google");

    const rol = url.searchParams.get("rol");
    const intencion = {
      rol: rol === "afiliado" || rol === "developer" ? rol : null,
      alias: normalizarAlias(url.searchParams.get("alias") || ""),
    };

    const estado = crypto.randomBytes(16).toString("base64url");

    /* Si faltan las credenciales, `urlDeConsentimiento` tira. Es un error del
       servidor, no de quien entra, pero el que lo ve es la persona: mejor un
       mensaje en la puerta que una pantalla de 500 con un stack. El log queda
       para el que despliega. */
    let destino;
    try {
      destino = urlDeConsentimiento(urlDeVuelta(req), estado);
    } catch (e) {
      console.error("[auth] mal configurado:", e.message);
      return alaPuerta(req, "sin_configurar");
    }

    const respuesta = NextResponse.redirect(destino, { status: 303 });
    const opciones = {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 600, // lo que tarda un consentimiento, no más
    };
    respuesta.cookies.set(COOKIE_ESTADO, estado, opciones);
    respuesta.cookies.set(COOKIE_INTENCION, JSON.stringify(intencion), opciones);
    return respuesta;
  }

  /* ── VUELTA ────────────────────────────────────────────────────────── */
  const esperado = tarro.get(COOKIE_ESTADO)?.value;
  const recibido = url.searchParams.get("state");
  if (!esperado || !recibido || esperado !== recibido) return alaPuerta(req, "estado");

  let perfil;
  try {
    perfil = await perfilDesdeCode(code, urlDeVuelta(req));
  } catch (e) {
    console.error("[auth] Google falló:", e.message);
    return alaPuerta(req, "google");
  }

  let intencion = { rol: null, alias: "" };
  try {
    intencion = JSON.parse(tarro.get(COOKIE_INTENCION)?.value || "{}");
  } catch {
    /* Cookie ilegible: se trata como si viniera de «Entrar». Si la cuenta
       existe, entra igual; si no, cae en `falta_registro`, que es el mensaje
       correcto para alguien que no completó el alta. */
  }

  let cuenta;
  try {
    cuenta = await unaFila(`SELECT id, rol FROM cuenta WHERE email = $1`, [perfil.email]);

    if (!cuenta) {
      if (!intencion.rol) return alaPuerta(req, "falta_registro");
      if (intencion.rol !== "afiliado" && intencion.rol !== "developer") {
        return alaPuerta(req, "rol_invalido");
      }

      let alias = null;
      if (intencion.rol === "afiliado") {
        alias = normalizarAlias(intencion.alias || "");
        if (!aliasValido(alias)) return alaPuerta(req, "alias_invalido");
        const yaEsta = await unaFila(`SELECT 1 FROM cuenta WHERE alias = $1`, [alias]);
        if (yaEsta) return alaPuerta(req, "alias_tomado");
      }

      cuenta = await unaFila(
        `INSERT INTO cuenta (email, nombre, foto_url, rol, alias, condiciones_version)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id, rol`,
        [perfil.email, perfil.nombre, perfil.foto, intencion.rol, alias, CONDICIONES_VERSION]
      );
      console.log("[auth] cuenta nueva:", perfil.email, "·", intencion.rol);
    } else {
      await unaFila(
        `UPDATE cuenta SET ultimo_acceso = now(), nombre = $2, foto_url = $3
          WHERE id = $1 RETURNING id`,
        [cuenta.id, perfil.nombre, perfil.foto]
      );
    }
  } catch (e) {
    /* La carrera real: dos pestañas con el mismo alias al mismo tiempo. El
       UNIQUE de la base decide, y acá se traduce a un mensaje entendible en vez
       de un 500. */
    if (e?.code === "23505") return alaPuerta(req, "alias_tomado");
    console.error("[auth] base falló:", e.message);
    return alaPuerta(req, null);
  }

  const base = process.env.APP_URL || new URL(req.url).origin;
  const respuesta = NextResponse.redirect(new URL(panelDe(cuenta.rol), base), { status: 303 });
  respuesta.cookies.set(cookieOpciones.name, armarCookie(cuenta.id), cookieOpciones);
  respuesta.cookies.delete(COOKIE_ESTADO);
  respuesta.cookies.delete(COOKIE_INTENCION);
  return respuesta;
}
