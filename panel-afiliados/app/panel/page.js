import { redirect } from "next/navigation";
import { afiliadoActual } from "@/lib/afiliado-actual";
import { linkDeReferido } from "@/lib/alias";
import { PCT_AFILIADO } from "@/lib/programa";
import Codigo from "@/components/Codigo";
import FormCvu from "@/components/FormCvu";

export const dynamic = "force-dynamic";

/* El panel del afiliado, en su primera versión.
   ==========================================================================
   Tiene lo que ya existe de verdad —tu código y dónde cobrás— y dice con todas
   las letras lo que todavía no. El catálogo se ve cuando haya productos
   publicados; dibujar una grilla vacía con un «próximamente» adentro de cada
   tarjeta sería simular un producto que no está.

   Es la diferencia entre una sala de espera honesta y una cáscara. */
export default async function Panel() {
  const afiliado = await afiliadoActual();
  if (!afiliado) redirect("/");

  const base = process.env.APP_URL || "https://afiliados.g360ia.com.ar";
  const link = linkDeReferido(base, afiliado.alias);

  return (
    <main className="panel">
      <header className="panel__barra">
        <a className="marca" href="/" style={{ margin: 0 }}>
          Gestion<span className="num">360</span><span className="ia">.iA</span>
        </a>
        <form action="/api/auth/logout" method="post">
          <button className="panel__salir" type="submit">Salir</button>
        </form>
      </header>

      <div className="panel__cuerpo">
        <div className="tarjeta">
          <h2>Hola, {afiliado.nombre.split(" ")[0]}</h2>
          <p>
            Tu cuenta está activa y tu código ya es tuyo. Abajo está el link que vas a
            repartir: quien se registre desde ahí queda anotado como tuyo aunque se decida
            meses después, porque el código no vence.
          </p>
          <Codigo link={link} alias={afiliado.alias} />
        </div>

        <div className="tarjeta">
          <h2>Dónde cobrás</h2>
          <p>
            Las comisiones se liquidan una vez por mes, por transferencia. Cargá el CVU o
            alias a tu nombre — si la cuenta no es tuya, la transferencia se traba y la
            comisión queda esperando.
          </p>
          <FormCvu cvu={afiliado.cvu} titular={afiliado.cvu_titular} />
        </div>

        <div className="tarjeta">
          <h2>El catálogo</h2>
          <p className="aviso">
            <strong>Todavía no hay productos publicados.</strong> El catálogo abre cuando entre
            el primero, y te vamos a avisar al mail con el que entraste. Mientras tanto tu
            código ya funciona: si traés un negocio ahora, la comisión del {PCT_AFILIADO}% te
            corresponde igual desde su primera cuota.
          </p>
        </div>
      </div>
    </main>
  );
}
