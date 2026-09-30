/* Render en el servidor, sólo para el build: lo usa scripts/prerender-devaffi.mjs.
   Importa las páginas directamente (sin import dinámico) para renderizarlas
   en Node y escribir el HTML dentro de cada archivo de dist/. */
import React from 'react';
import { renderToString } from 'react-dom/server';
import Inicio from './paginas/Inicio.jsx';
import Afiliados from './paginas/Afiliados.jsx';
import Developers from './paginas/Developers.jsx';
import Planes from './paginas/Planes.jsx';
import Nosotros from './paginas/Nosotros.jsx';
import Terminos from './paginas/Terminos.jsx';
import Privacidad from './paginas/Privacidad.jsx';
import Legales from './paginas/Legales.jsx';

const COMPONENTES = { inicio: Inicio, afiliados: Afiliados, developers: Developers, planes: Planes, nosotros: Nosotros, terminos: Terminos, privacidad: Privacidad, legales: Legales };

export function render(clave) {
  const C = COMPONENTES[clave];
  if (!C) throw new Error('Página de Devaffi desconocida: ' + clave);
  return renderToString(<C />);
}
