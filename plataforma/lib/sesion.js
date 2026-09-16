/* La sesión: una cookie firmada, sin dependencias.
   ==========================================================================
   No hay tabla de sesiones ni librería de auth. La cookie lleva el id del
   afiliado y una firma HMAC-SHA256 sobre el contenido; el servidor la verifica
   en cada pedido. Alcanza porque lo único que hay que recordar entre pedidos es
   «quién sos», y sacarlo de la base en cada carga es una consulta de más para
   un dato que no cambia.

   Lo que esto NO da, dicho para que nadie lo descubra tarde: no hay revocación
   inmediata. Si hiciera falta cerrar sesiones a distancia —lo va a hacer falta
   el día que se maneje plata— se agrega una tabla de sesiones y esto pasa a ser
   sólo el transporte. Mientras tanto, la cookie dura 30 días y se renueva.

   `crypto` es el de Node, no una dependencia. */
import crypto from "node:crypto";

const COOKIE = "g360_afiliado";
const DIAS = 30;

function secreto() {
  const s = process.env.SESION_SECRETO;
  if (!s || s.length < 32) {
    throw new Error(
      "Falta SESION_SECRETO (mínimo 32 caracteres). Generá uno con: openssl rand -hex 32"
    );
  }
  return s;
}

function firmar(datos) {
  return crypto.createHmac("sha256", secreto()).update(datos).digest("base64url");
}

export function armarCookie(afiliadoId) {
  const vence = Date.now() + DIAS * 24 * 60 * 60 * 1000;
  const cuerpo = `${afiliadoId}.${vence}`;
  return `${cuerpo}.${firmar(cuerpo)}`;
}

/** Devuelve el id del afiliado, o null si la cookie falta, venció o no cierra. */
export function leerCookie(valor) {
  if (!valor) return null;
  const partes = valor.split(".");
  if (partes.length !== 3) return null;
  const [id, vence, firma] = partes;
  const cuerpo = `${id}.${vence}`;

  const esperada = Buffer.from(firmar(cuerpo));
  const recibida = Buffer.from(firma);
  /* Comparación de tiempo constante: un `===` filtra, por el tiempo que tarda
     en fallar, cuántos caracteres del principio acertó quien esté probando. */
  if (esperada.length !== recibida.length) return null;
  if (!crypto.timingSafeEqual(esperada, recibida)) return null;

  if (Number(vence) < Date.now()) return null;
  const n = Number(id);
  return Number.isInteger(n) && n > 0 ? n : null;
}

export const cookieOpciones = {
  name: COOKIE,
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: DIAS * 24 * 60 * 60,
};

export { COOKIE };
