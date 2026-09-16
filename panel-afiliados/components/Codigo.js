"use client";

import { useState } from "react";

/* El link, con un botón para copiarlo.
   El estado «copiado» se muestra dos segundos y vuelve solo: un botón que queda
   diciendo «copiado» para siempre no dice nada la segunda vez que lo usás.

   `navigator.clipboard` no existe fuera de HTTPS y puede estar bloqueado, así
   que el `catch` deja el texto seleccionable a mano en vez de tragar el error. */
export default function Codigo({ link, alias }) {
  const [copiado, setCopiado] = useState(false);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(link);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      setCopiado(false);
    }
  }

  return (
    <div className="codigo-caja">
      <span>{link}</span>
      <button className="copiar" type="button" onClick={copiar}>
        {copiado ? "¡Copiado!" : "Copiar"}
      </button>
    </div>
  );
}
