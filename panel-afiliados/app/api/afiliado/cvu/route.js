import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { consultar } from "@/lib/db";
import { COOKIE, leerCookie } from "@/lib/sesion";

export const dynamic = "force-dynamic";

const limpiar = (v, largo) =>
  typeof v === "string" ? v.trim().slice(0, largo) : "";

/* Guardar dónde cobra el afiliado.
   La sesión se lee de la cookie firmada y el id sale de ahí — nunca del cuerpo
   del pedido. Aceptar un `afiliado_id` del cliente sería dejar que cualquiera
   cambie el CVU de cualquier otro, que es la forma más directa de que las
   comisiones terminen en la cuenta equivocada. */
export async function POST(req) {
  const id = leerCookie(cookies().get(COOKIE)?.value);
  if (!id) return NextResponse.json({ error: "Sesión vencida" }, { status: 401 });

  let cuerpo;
  try {
    cuerpo = await req.json();
  } catch {
    return NextResponse.json({ error: "Pedido inválido" }, { status: 400 });
  }

  const cvu = limpiar(cuerpo.cvu, 60);
  const titular = limpiar(cuerpo.titular, 120);

  /* Los dos juntos o ninguno: un CVU sin titular no se puede transferir, y un
     titular sin CVU no es nada. Vaciar los dos es una forma válida de borrar. */
  if ((cvu && !titular) || (!cvu && titular)) {
    return NextResponse.json(
      { error: "Cargá el CVU y el titular, o dejá los dos vacíos." },
      { status: 400 }
    );
  }

  try {
    await consultar(
      `UPDATE afiliado SET cvu = $2, cvu_titular = $3 WHERE id = $1`,
      [id, cvu || null, titular || null]
    );
  } catch (e) {
    console.error("[cvu] no se pudo guardar:", e.message);
    return NextResponse.json({ error: "No se pudo guardar" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
