"use client";

import { useId, useState } from "react";

/* Dónde cobra el afiliado.
   ==========================================================================
   Se guarda con un fetch y no con un submit entero porque es un formulario que
   la persona va a tocar una vez y corregir otra: recargar la página para
   confirmar un campo que ya estaba a la vista es ruido.

   El CVU no se valida por dígito verificador acá. Se comprueba el largo —22 para
   CVU, o un alias— y nada más: un CVU con formato perfecto puede ser igual de
   ajeno, así que la verificación real es la primera transferencia. Validar de
   más sólo rechazaría alias válidos que no tienen forma de número. */
export default function FormCvu({ cvu, titular }) {
  const idCvu = useId();
  const idTit = useId();

  const [valores, setValores] = useState({ cvu: cvu || "", titular: titular || "" });
  const [estado, setEstado] = useState("quieto"); // quieto | guardando | listo | error
  const [error, setError] = useState(null);

  const cambiar = (campo) => (e) => {
    setValores((v) => ({ ...v, [campo]: e.target.value }));
    setEstado("quieto");
  };

  async function guardar(e) {
    e.preventDefault();
    setEstado("guardando");
    setError(null);

    try {
      const r = await fetch("/api/afiliado/cvu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(valores),
      });
      const cuerpo = await r.json().catch(() => ({}));
      if (!r.ok) {
        setError(cuerpo.error || "No se pudo guardar. Probá de nuevo.");
        setEstado("error");
        return;
      }
      setEstado("listo");
    } catch {
      setError("No se pudo contactar al servidor. Revisá la conexión.");
      setEstado("error");
    }
  }

  return (
    <form onSubmit={guardar}>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}

      <label className="campo" htmlFor={idCvu}>
        <span className="campo__et">CVU o alias</span>
        <input
          id={idCvu}
          value={valores.cvu}
          onChange={cambiar("cvu")}
          placeholder="mi.alias.mp"
          maxLength={60}
          autoComplete="off"
          disabled={estado === "guardando"}
        />
      </label>

      <label className="campo" htmlFor={idTit}>
        <span className="campo__et">Titular de la cuenta</span>
        <input
          id={idTit}
          value={valores.titular}
          onChange={cambiar("titular")}
          placeholder="Nombre y apellido como figura en el banco"
          maxLength={120}
          autoComplete="off"
          disabled={estado === "guardando"}
        />
      </label>

      <button className="boton" type="submit" disabled={estado === "guardando"}>
        {estado === "guardando" ? "Guardando…" : estado === "listo" ? "Guardado ✓" : "Guardar"}
      </button>
    </form>
  );
}
