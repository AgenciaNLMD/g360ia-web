import { redirect } from "next/navigation";
import { cuentaActual, panelDe } from "@/lib/cuenta-actual";
import Salir from "@/components/Salir";

export const dynamic = "force-dynamic";

/* El panel del afiliado.
   Por ahora sólo confirma que entraste y muestra tu código. Lo que va a tener
   —tu link, los negocios que trajiste, tus comisiones y dónde cobrás— llega
   cuando exista el catálogo. Se dice, no se simula con tarjetas vacías. */
export default async function PanelAfiliado() {
  const cuenta = await cuentaActual();
  if (!cuenta) redirect("/");
  if (cuenta.rol !== "afiliado") redirect(panelDe(cuenta.rol));

  return (
    <main className="panel">
      <header className="panel__barra">
        <span className="marca">Gestion<span className="num">360</span><span className="ia">.iA</span></span>
        <Salir />
      </header>
      <div className="panel__cuerpo">
        <div className="tarjeta">
          <h2>Hola, {cuenta.nombre.split(" ")[0]}</h2>
          <p>Tu cuenta de afiliado está activa y tu código ya es tuyo.</p>
          <p className="codigo-caja">g360ia.com.ar/r/<strong>{cuenta.alias}</strong></p>
        </div>
        <div className="tarjeta">
          <p className="aviso">
            <strong>El panel todavía está en construcción.</strong> Acá van a estar los
            negocios que traigas, tus comisiones y dónde te las transferimos. Te avisamos
            a {cuenta.email} cuando abra.
          </p>
        </div>
      </div>
    </main>
  );
}
