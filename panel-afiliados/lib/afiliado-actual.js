/* Quién está entrando, del lado del servidor.
   ==========================================================================
   Lee la cookie firmada y trae la fila. Devuelve `null` si no hay sesión, si la
   firma no cierra o si la cuenta ya no existe —ese último caso importa: una
   cookie válida de una cuenta borrada no puede dejar pasar a nadie. */
import { cookies } from "next/headers";
import { unaFila } from "@/lib/db";
import { COOKIE, leerCookie } from "@/lib/sesion";

export async function afiliadoActual() {
  const cookie = cookies().get(COOKIE)?.value;
  const id = leerCookie(cookie);
  if (!id) return null;

  return unaFila(
    `SELECT id, email, nombre, foto_url, alias, telefono, cvu, cvu_titular, creado_en
       FROM afiliado
      WHERE id = $1`,
    [id]
  );
}
