/* Prerender de las páginas de Devaffi.
 *
 * Corre después de `vite build`. Levanta Vite en modo SSR, renderiza cada
 * página con React y escribe el resultado dentro del <div id="dv-root"> del
 * HTML que ya está en dist/. Así el contenido llega en el primer byte: lo
 * leen los buscadores y las IA que no ejecutan JavaScript, y el navegador
 * después sólo hidrata.
 *
 * Si una página no tiene el contenedor vacío que se espera, el build falla:
 * mejor enterarse acá que publicar una página en blanco. */
import { createServer } from 'vite';
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const VACIO = '<div id="dv-root"></div>';

const vite = await createServer({
  root,
  logLevel: 'error',
  server: { middlewareMode: true, hmr: false },
  appType: 'custom',
});

try {
  const { PAGINAS } = await vite.ssrLoadModule('/devaffi/paginas.js');
  const { render } = await vite.ssrLoadModule('/devaffi/ssr.jsx');

  for (const [clave, { html }] of Object.entries(PAGINAS)) {
    const archivo = resolve(root, 'dist', html);
    const fuente = readFileSync(archivo, 'utf8');
    if (!fuente.includes(VACIO)) throw new Error(`${html}: no encuentro ${VACIO}`);
    const cuerpo = render(clave);
    writeFileSync(archivo, fuente.replace(VACIO, `<div id="dv-root">${cuerpo}</div>`));
    console.log(`devaffi · ${html} · ${(cuerpo.length / 1024).toFixed(1)} kB prerenderizados`);
  }
} finally {
  await vite.close();
}
