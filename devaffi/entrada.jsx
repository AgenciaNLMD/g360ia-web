/* Entrada del navegador para todas las páginas de Devaffi.
 *
 * Cada HTML trae su contenido ya renderizado (el prerender del build), así que
 * lo normal es hidratar: React toma el HTML que ya está y le engancha los
 * eventos. En `npm run dev` no hay prerender y el contenedor llega vacío;
 * entonces se renderiza de cero. Cada página es su propio chunk. */
import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { PAGINAS } from './paginas.js';
import './devaffi.css';

const raiz = document.getElementById('dv-root');
const pagina = PAGINAS[document.body.dataset.dv];

if (raiz && pagina) {
  pagina.cargar().then(({ default: Pagina }) => {
    if (raiz.firstElementChild) hydrateRoot(raiz, <Pagina />);
    else createRoot(raiz).render(<Pagina />);
    aparecer();
  });
}

/* Aparición al scrollear. Se marca el documento recién acá: sin JS, o si esto
   falla, todo queda visible. El observador avisa también el estado inicial,
   así que lo que ya está en pantalla al cargar aparece enseguida. */
function aparecer() {
  const piezas = document.querySelectorAll('.dv-rev');
  if (!piezas.length || !('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.documentElement.classList.add('dv-js');
  const obs = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('is-vista'); obs.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  piezas.forEach((p) => obs.observe(p));
}
