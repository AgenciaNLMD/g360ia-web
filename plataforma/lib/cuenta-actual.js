/* Quién está entrando, del lado del servidor.
   ==========================================================================
   Lee la cookie firmada y trae la fila. Devuelve `null` si no hay sesión, si la
   firma no cierra o si la cuenta ya no existe — ese último caso importa: una
   cookie válida de una cuenta borrada no puede dejar pasar a nadie. */
import { cookies } from "next/headers";
import { unaFila } from "@/lib/db";
import { COOKIE, leerCookie } from "@/lib/sesion";

export async function cuentaActual() {
  const id = leerCookie(cookies().get(COOKIE)?.value);
  if (!id) return null;

  return unaFila(
    `SELECT id, email, nombre, foto_url, rol, alias, creado_en
       FROM cuenta
      WHERE id = $1`,
    [id]
  );
}

/** A qué panel va cada rol. Un solo lugar: si mañana hay un tercero, se agrega
    acá y todas las redirecciones se enteran. */
export function panelDe(rol) {
  return rol === "developer" ? "/developer" : "/afiliado";
}
