import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { perfilDesdeCode, urlDeConsentimiento } from "@/lib/google";
import { unaFila } from "@/lib/db";
import { armarCookie, cookieOpciones } from "@/lib/sesion";
import { normalizarAlias, aliasValido } from "@/lib/alias";
import { CONDICIONES_VERSION } from "@/lib/programa";

export const dynamic = "force-dynamic";

/* La ida y la vuelta de Google, en una sola ruta.
   ==========================================================================
   Sin `code` es la ida: guarda el alias elegido y manda al consentimiento.
   Con `code` es la vuelta: cambia el código por el perfil, busca o crea la
   cuenta, y deja la sesión.

   ── Por qué el alias viaja en una cookie y no en el `state` ────────────────
   El `state` vuelve del navegador y podría venir modificado. Que alguien se
   cambie su propio alias no es un ataque interesante, pero tampoco hay motivo
   para aceptar del cliente un dato que podemos guardar nosotros. El `state`
   queda para lo único que tiene que hacer: probar que esta vuelta corresponde a
   una ida nuestra (anti-CSRF).

   ── Buscar o crear, sin preguntar ──────────────────────────────────────────
   Un solo botón para entrar y para registrarse. El email de Google es la
   identidad: si ya existe, entra; si no, se crea con el alias que eligió. */

const COOKIE_ESTADO = "g360_oauth";
const COOKIE_ALIAS = "g360_alias";

function urlDeVuelta(req) {
  /* La `redirect_uri` tiene que ser idéntica en la ida y en la vuelta, y estar
     declarada en Google Cloud. Se arma desde el origen público y no desde
     `req.url`, que detrás del proxy de Easypanel llega como http://127.0.0.1. */
  const base = process.env.APP_URL || new URL(req.url).origin;
  return `${base.replace(/\/+$/, "")}/api/auth/google`;
}

function alaEntrada(req, error) {
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
    if (url.searchParams.get("error")) return alaEntrada(req, "google");

    const estado = crypto.randomBytes(16).toString("base64url");
    const alias = normalizarAlias(url.searchParams.get("alias") || "");

    const respuesta = NextResponse.redirect(
      urlDeConsentimiento(urlDeVuelta(req), estado),
      { status: 303 }
    );
    const opciones = {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 600, // diez minutos: lo que tarda un consentimiento, no más
    };
    respuesta.cookies.set(COOKIE_ESTADO, estado, opciones);
    respuesta.cookies.set(COOKIE_ALIAS, alias, opciones);
    return respuesta;
  }

  /* ── VUELTA ────────────────────────────────────────────────────────── */
  const esperado = tarro.get(COOKIE_ESTADO)?.value;
  const recibido = url.searchParams.get("state");
  if (!esperado || !recibido || esperado !== recibido) {
    return alaEntrada(req, "estado");
  }

  let perfil;
  try {
    perfil = await perfilDesdeCode(code, urlDeVuelta(req));
  } catch (e) {
    console.error("[auth] Google falló:", e.message);
    return alaEntrada(req, "google");
  }

  let cuenta;
  try {
    cuenta = await unaFila(`SELECT id FROM afiliado WHERE email = $1`, [perfil.email]);

    if (!cuenta) {
      const alias = normalizarAlias(tarro.get(COOKIE_ALIAS)?.value || "");
      if (!alias) return alaEntrada(req, "falta_alias");
      if (!aliasValido(alias)) return alaEntrada(req, "alias_invalido");

      const yaEsta = await unaFila(`SELECT 1 FROM afiliado WHERE alias = $1`, [alias]);
      if (yaEsta) return alaEntrada(req, "alias_tomado");

      cuenta = await unaFila(
        `INSERT INTO afiliado (email, nombre, foto_url, alias, condiciones_version)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id`,
        [perfil.email, perfil.nombre, perfil.foto, alias, CONDICIONES_VERSION]
      );
      console.log("[auth] afiliado nuevo:", perfil.email, "·", alias);
    } else {
      await unaFila(
        `UPDATE afiliado SET ultimo_acceso = now(), nombre = $2, foto_url = $3
          WHERE id = $1 RETURNING id`,
        [cuenta.id, perfil.nombre, perfil.foto]
      );
    }
  } catch (e) {
    /* La carrera real: dos pestañas del mismo alias al mismo tiempo. El UNIQUE
       de la base es el que decide, y acá se traduce a un mensaje entendible en
       vez de un 500. */
    if (e?.code === "23505") return alaEntrada(req, "alias_tomado");
    console.error("[auth] base falló:", e.message);
    return alaEntrada(req, null);
  }

  const base = process.env.APP_URL || new URL(req.url).origin;
  const respuesta = NextResponse.redirect(new URL("/panel", base), { status: 303 });
  respuesta.cookies.set(cookieOpciones.name, armarCookie(cuenta.id), cookieOpciones);
  respuesta.cookies.delete(COOKIE_ESTADO);
  respuesta.cookies.delete(COOKIE_ALIAS);
  return respuesta;
}
