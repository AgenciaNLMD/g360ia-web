import { redirect } from "next/navigation";
import { cuentaActual, panelDe } from "@/lib/cuenta-actual";
import Salir from "@/components/Salir";

export const dynamic = "force-dynamic";

/* El panel del developer.
   Mismo criterio que el del afiliado: confirma el alta y dice qué falta. Lo que
   va a tener —cargar la ficha del producto, el webhook, el CVU y ver las
   liquidaciones— llega con el resto de la plataforma. */
export default async function PanelDeveloper() {
  const cuenta = await cuentaActual();
  if (!cuenta) redirect("/");
  if (cuenta.rol !== "developer") redirect(panelDe(cuenta.rol));

  return (
    <main className="panel">
      <header className="panel__barra">
        <span className="marca">Gestion<span className="num">360</span><span className="ia">.iA</span></span>
        <Salir />
      </header>
      <div className="panel__cuerpo">
        <div className="tarjeta">
          <h2>Hola, {cuenta.nombre.split(" ")[0]}</h2>
          <p>Tu cuenta de developer está activa.</p>
        </div>
        <div className="tarjeta">
          <p className="aviso">
            <strong>El panel todavía está en construcción.</strong> Acá vas a cargar la ficha
            de tu producto, la URL del webhook de activación y tu CVU, y a ver tus
            liquidaciones. Te avisamos a {cuenta.email} cuando abra.
          </p>
        </div>
      </div>
    </main>
  );
}
