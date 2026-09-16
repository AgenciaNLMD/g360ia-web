import { NextResponse } from "next/server";
import { unaFila } from "@/lib/db";
import { normalizarAlias } from "@/lib/alias";

export const dynamic = "force-dynamic";

/* El redirect de referido.
   ==========================================================================
   Existe para no depender de que cada developer externo implemente bien un
   `?ref=` a mano (decisión 6 del brief): el link pasa por acá, se registra, y
   recién después la persona llega al sitio del producto.

   Hoy hace la mitad del trabajo: valida que el código exista y redirige. El
   registro del click necesita la tabla `referido`, que llega con el catálogo —
   y guardarlo antes de tener contra qué asociarlo sería una tabla de datos
   sueltos que después hay que migrar.

   Un código que no existe NO da 404: manda a la vidriera. El que llega acá con
   un link mal tipeado es un cliente potencial, no un error de sistema. */
export async function GET(req, { params }) {
  const alias = normalizarAlias(params?.codigo || "");
  const vidriera = "https://g360ia.com.ar/afiliados";

  if (!alias) return NextResponse.redirect(vidriera, { status: 302 });

  let existe = null;
  try {
    existe = await unaFila(`SELECT alias FROM afiliado WHERE alias = $1`, [alias]);
  } catch (e) {
    /* Si la base no contesta, el visitante no tiene por qué enterarse: va a la
       vidriera igual. Lo que se pierde es la atribución, no la visita. */
    console.error("[r] base no disponible:", e.message);
  }

  const destino = new URL(existe ? "https://g360ia.com.ar/software" : vidriera);
  if (existe) destino.searchParams.set("ref", alias);
  return NextResponse.redirect(destino, { status: 302 });
}
