import { NextResponse } from "next/server";
import { cookieOpciones } from "@/lib/sesion";

export const dynamic = "force-dynamic";

/* Cerrar sesión es borrar la cookie. No hay nada del lado del servidor que
   invalidar —la sesión ES la cookie firmada—, que es la contracara del diseño
   sin tabla de sesiones que explica `lib/sesion.js`. */
export async function POST(req) {
  const base = process.env.APP_URL || new URL(req.url).origin;
  const respuesta = NextResponse.redirect(new URL("/", base), { status: 303 });
  respuesta.cookies.set(cookieOpciones.name, "", { ...cookieOpciones, maxAge: 0 });
  return respuesta;
}
