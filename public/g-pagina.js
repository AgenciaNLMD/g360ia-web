/* ===========================================================================
   g-pagina.js — el comportamiento de las páginas estáticas del sistema claro
   ===========================================================================
   Es el equivalente de lo que la home hace desde React (`secciones-home.jsx`),
   escrito en JS a secas para las páginas que son HTML servido tal cual.

   Tres cosas, ninguna imprescindible: si este archivo no carga, la página se
   lee entera igual. La barra queda transparente, el menú de teléfono no abre y
   las secciones aparecen todas visibles — que es exactamente el estado al que
   llegarían de todos modos.

   No hay scroll-snap acá. Las páginas `g-pagina` scrollean como cualquier
   documento; las Reglas 1 y 2 del CLAUDE.md describen el sistema viejo, que
   sigue vivo en las páginas `svc-page` que todavía no se migraron.

   Va en `public/` y no en la raíz: las páginas lo piden como `/g-pagina.js`, y
   Vite sólo copia `public/` al build (Regla 4).
   =========================================================================== */
(function () {
  'use strict';

  /* ── 1 · La barra ─────────────────────────────────────────────────────────
     Transparente mientras se ve el hero navy, blanca en cuanto empieza el
     contenido. El umbral se mide, no se escribe: es el alto real del hero
     menos la barra, así el cambio cae justo cuando el fondo deja de ser navy.
     Un número fijo acierta en un tamaño de pantalla y falla en el resto. */
  var nav = document.querySelector('.g-nav');
  var hero = document.querySelector('.g-pag-hero, .g-hero');

  if (nav) {
    var alCambiar = function () {
      var umbral = hero ? hero.offsetHeight - 80 : 300;
      nav.classList.toggle('is-solida', window.scrollY > umbral);
    };
    alCambiar();
    window.addEventListener('scroll', alCambiar, { passive: true });
    window.addEventListener('resize', alCambiar);

    /* ── El menú de teléfono ── */
    var boton = nav.querySelector('.g-hamb');
    var hoja = nav.querySelector('.g-nav-movil');

    if (boton && hoja) {
      var abrir = function (si) {
        hoja.hidden = !si;
        boton.setAttribute('aria-expanded', si ? 'true' : 'false');
        boton.setAttribute('aria-label', si ? 'Cerrar menú' : 'Abrir menú');
        /* Con la hoja abierta la barra va sólida siempre: la hoja es blanca y
           una barra transparente encima deja el logo blanco sobre blanco. */
        if (si) nav.classList.add('is-solida'); else alCambiar();
      };

      boton.addEventListener('click', function () { abrir(hoja.hidden); });

      /* Se cierra al scrollear. Una hoja desplegable que queda abierta tapando
         la página mientras el visitante baja es el error más común de este
         patrón. */
      window.addEventListener('scroll', function () {
        if (!hoja.hidden) abrir(false);
      }, { passive: true });

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && !hoja.hidden) { abrir(false); boton.focus(); }
      });
    }
  }

  /* ── 2 · Aparición al scrollear ───────────────────────────────────────────
     Un solo observador para todos los `.g-rev` de la página.

     Los dos casos que hay que contemplar y que se olvidan siempre: el visitante
     que pide menos animación, y el elemento que YA está en pantalla al cargar
     —se entró por un ancla, o el navegador restauró la posición—. En el segundo
     caso el observador no avisa nunca, porque sólo informa cambios, y si no
     queda scroll por delante el elemento se queda invisible para siempre. */
  var piezas = document.querySelectorAll('.g-rev');
  if (piezas.length) {
    var quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (quieto || !('IntersectionObserver' in window)) {
      for (var i = 0; i < piezas.length; i++) piezas[i].classList.add('is-in');
    } else {
      var obs = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (e) {
          if (!e.isIntersecting) return;
          e.target.classList.add('is-in');
          obs.unobserve(e.target);
        });
      }, { rootMargin: '0px 0px -10% 0px', threshold: 0.06 });

      for (var j = 0; j < piezas.length; j++) {
        var r = piezas[j].getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) piezas[j].classList.add('is-in');
        else obs.observe(piezas[j]);
      }
    }
  }

  /* ── 3 · El pie ───────────────────────────────────────────────────────────
     Una sola copia para todo el sitio, en `public/partials/footer.html`
     (Regla 4). Si el fetch falla, el hueco queda vacío y no rompe nada. */
  var hueco = document.getElementById('site-footer');
  if (hueco) {
    fetch('/partials/footer.html')
      .then(function (r) { return r.ok ? r.text() : ''; })
      .then(function (html) {
        if (!html) return;
        hueco.outerHTML = html;
        var y = document.getElementById('footer-year-text');
        if (y) y.textContent = '© ' + new Date().getFullYear() + ' Gestion360ia · Todos los derechos reservados';
      })
      .catch(function () { /* sin pie es mejor que con una excepción */ });
  }
})();
