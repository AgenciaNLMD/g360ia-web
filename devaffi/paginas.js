/* Qué página es cada HTML. La clave va en <body data-dv="..."> y el archivo
   de salida es el que genera Vite para ese HTML (ver vite.config.js). El
   prerender (scripts/prerender-devaffi.mjs) recorre esta misma lista. */
export const PAGINAS = {
  inicio:     { html: 'devaffi/index.html',     cargar: () => import('./paginas/Inicio.jsx') },
  afiliados:  { html: 'afiliados.html',         cargar: () => import('./paginas/Afiliados.jsx') },
  developers: { html: 'developers.html',        cargar: () => import('./paginas/Developers.jsx') },
  planes:     { html: 'planes.html',            cargar: () => import('./paginas/Planes.jsx') },
  nosotros:   { html: 'sobre-devaffi.html',     cargar: () => import('./paginas/Nosotros.jsx') },
  terminos:   { html: 'terminos-devaffi.html',  cargar: () => import('./paginas/Terminos.jsx') },
};
