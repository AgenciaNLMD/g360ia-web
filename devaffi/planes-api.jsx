/* Los números de los planes, leídos del panel.
 *
 * Ninguna página de Devaffi escribe un precio ni un límite: los pide a
 * app.g360ia.com.ar/api/planes (repo g360ia-PRM, app/api/planes/route.js), que
 * los saca de la misma tabla y la misma fórmula con las que el panel cobra. Un
 * número copiado acá envejecería solo hasta contradecir al panel (CLAUDE.md,
 * Regla 6).
 *
 * El prerender y el primer render del navegador muestran el texto de reserva
 * —que se lee bien sin número—, y recién después de hidratar se piden los
 * datos. Si la API no contesta, queda la reserva y las etiquetas dicen
 * «Próximamente». */
import React, { createContext, useContext, useEffect, useState } from 'react';

const API = 'https://app.g360ia.com.ar/api/planes';
const Ctx = createContext({});

function usd(n) {
  return n === 0 ? 'Gratis' : 'USD ' + Number(n).toLocaleString('es-AR');
}

function traducir(d) {
  const afi = d.afiliado || {}, dev = d.developer || {};
  const planes = afi.planes || [];
  const free = planes.find((p) => p.codigo === 'free');
  const pro = planes.find((p) => p.codigo === 'pro');
  const v = {}, e = {};

  if (free && free.softwaresPorSemana) v['afi-free-semana'] = String(free.softwaresPorSemana);
  if (pro) { v['afi-pro-precio'] = usd(pro.precioUsd) + ' por mes'; e['afi-pro'] = !!pro.disponible; }

  const paq = afi.paqueteContactos;
  if (paq) { v['afi-paquete'] = usd(paq.monto) + ' cada ' + paq.cantidad + ' contactos'; e['afi-paquete'] = !!paq.disponible; }
  const lugar = afi.extensionLugar;
  if (lugar) { v['afi-lugar'] = usd(lugar.monto) + ' por ' + lugar.dias + ' días más'; e['afi-lugar'] = !!lugar.disponible; }

  const reg = dev.regaloContactos;
  if (reg) { v['dev-regalo'] = usd(reg.monto) + ' cada ' + reg.cantidad + ' contactos'; e['dev-regalo'] = !!reg.disponible; }
  if (dev.diasPorPago) v['dev-dias'] = String(dev.diasPorPago);
  e['dev-niveles'] = !!dev.disponible;

  const lista = dev.niveles || [];
  const a = lista[lista.length - 2], b = lista[lista.length - 1];
  if (a && b) {
    /* Desde el último nivel la fórmula es lineal: la diferencia entre los dos
       últimos es lo que suma cada nivel siguiente. */
    v['dev-nivel-siguiente'] =
      'Y así sin techo: cada nivel más suma ' + usd(b.precioUsd - a.precioUsd) + ', ' +
      (b.cupoVendedores - a.cupoVendedores) + ' vendedores por producto y ' +
      (b.softwaresActivos - a.softwaresActivos) + ' softwares.';
  }
  if (lista[0]) {
    v['dev-nivel1-cupo'] = String(lista[0].cupoVendedores);
    v['dev-nivel1-softwares'] = String(lista[0].softwaresActivos);
  }
  const regalo = lista.find((n) => n.numerosPorVendedor > 0);
  if (regalo) v['dev-regalo-por-vendedor'] = String(regalo.numerosPorVendedor);

  return {
    valores: v,
    estados: e,
    niveles: lista.map((n) => [n.nombre, usd(n.precioUsd), n.cupoVendedores, n.softwaresActivos, n.numerosPorVendedor || '—']),
  };
}

export function PlanesProvider({ children }) {
  const [datos, setDatos] = useState({});
  useEffect(() => {
    let vivo = true;
    fetch(API, { credentials: 'omit' })
      .then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then((d) => { if (vivo) setDatos(traducir(d)); })
      .catch(() => { /* queda el texto de reserva */ });
    return () => { vivo = false; };
  }, []);
  return <Ctx.Provider value={datos}>{children}</Ctx.Provider>;
}

/* <Dato k="afi-pro-precio">cuota mensual</Dato> — el hijo es la reserva. */
export function Dato({ k, children }) {
  const { valores } = useContext(Ctx);
  return <>{(valores && valores[k]) || children}</>;
}

export function Estado({ k }) {
  const { estados } = useContext(Ctx);
  const si = !!(estados && estados[k]);
  return <span className={'dv-etiqueta' + (si ? '' : ' dv-etiqueta--gris')}>{si ? 'Disponible' : 'Próximamente'}</span>;
}

/* La tabla de niveles no se muestra hasta que hay datos: vacía no dice nada. */
export function TablaNiveles() {
  const { niveles } = useContext(Ctx);
  if (!niveles || !niveles.length) return null;
  return (
    <div className="dv-tabla-caja">
      <table className="dv-tabla">
        <thead>
          <tr>
            <th scope="col">Nivel</th>
            <th scope="col">Cada <Dato k="dev-dias">30</Dato> días</th>
            <th scope="col">Vendedores por producto</th>
            <th scope="col">Softwares</th>
            <th scope="col">Contactos de regalo por vendedor</th>
          </tr>
        </thead>
        <tbody>
          {niveles.map((fila) => (
            <tr key={fila[0]}>{fila.map((c, i) => <td key={i}>{c}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
