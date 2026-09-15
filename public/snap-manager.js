/**
 * snap-manager.js
 * Gestiona el scroll snap en páginas de servicios (body.svc-page).
 *
 * Reglas:
 * - Ningún segmento tiene scroll interno visible.
 * - El scroll salta de segmento completo a segmento completo.
 * - Si hay un modal abierto al hacer scroll, se cierra y se cancela
 *   el salto (el próximo scroll navega al segmento siguiente/anterior).
 */

(function () {
  if (!document.body.classList.contains('svc-page')) return;

  /* ── Detecta modal abierto por convención de clases ── */
  function getOpenModal() {
    return (
      document.querySelector('.modal.is-open') ||
      document.querySelector('[data-modal].is-open') ||
      document.querySelector('.bw-modal--open') ||
      null
    );
  }

  function closeModal(modal) {
    modal.classList.remove('is-open', 'bw-modal--open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    // dispara evento por si el componente React necesita sincronizar estado
    modal.dispatchEvent(new CustomEvent('modal:close', { bubbles: true }));
  }

  /* ── Wheel: cierra modal y bloquea el salto ese tick ── */
  let modalJustClosed = false;

  window.addEventListener('wheel', function (e) {
    const modal = getOpenModal();
    if (modal) {
      e.preventDefault();
      e.stopPropagation();
      closeModal(modal);
      modalJustClosed = true;
      setTimeout(() => { modalJustClosed = false; }, 400);
    }
  }, { passive: false });

  /* ── Touch: misma lógica para móvil ── */
  let touchStartY = 0;
  let touchHandled = false;

  window.addEventListener('touchstart', function (e) {
    touchStartY = e.touches[0].clientY;
    touchHandled = false;
  }, { passive: true });

  window.addEventListener('touchmove', function (e) {
    const modal = getOpenModal();
    if (modal && !touchHandled) {
      e.preventDefault();
      closeModal(modal);
      touchHandled = true;
    }
  }, { passive: false });

  window.addEventListener('touchend', function (e) {
    touchHandled = false;
  }, { passive: true });

  /* ── Teclado: flechas y PageUp/PageDown también cierran modal ── */
  window.addEventListener('keydown', function (e) {
    const navKeys = ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Space'];
    if (!navKeys.includes(e.key)) return;
    const modal = getOpenModal();
    if (modal) {
      e.preventDefault();
      closeModal(modal);
    }
  });

  /* ── Entrada del hero ──────────────────────────────────────────────────
     `body.svc-page .bw-hero-text` arranca en opacity:0 y sólo se ve cuando
     el hero tiene la clase `hero-in`. Quien la agregaba era un <script>
     inline copiado página por página, así que la página que no lo tenía
     —servicios/seo.html— mostraba el hero en blanco, y cualquier página
     nueva heredaba el mismo problema. Vive acá porque este archivo ya se
     carga en todas las svc-page.

     Sólo agrega la clase, nunca la saca: las páginas que todavía tienen su
     script inline la quitan y la vuelven a poner para repetir la animación
     al volver a la sección, y este observador no les pisa ese ciclo. */
  (function () {
    var hero = document.querySelector(".bw-hero");
    if (!hero) return;
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) e.target.classList.add("hero-in");
      });
    }, { threshold: 0.2 });
    obs.observe(hero);
  })();

  /* ── FAQ de las páginas .pg-page: una sola abierta a la vez ──────────
     El segmento mide 100dvh con overflow:hidden (Regla 2). Seis respuestas
     abiertas a la vez no entran y la última quedaría cortada sin que se vea
     que hay más. Abrir una cierra las otras, así el alto del bloque no crece
     más allá de una respuesta.

     Va acotado a `.pg-faq`: las ocho páginas de /servicios tienen su propio
     acordeón (`.bw-faq`) con su propia lógica y no se tocan. */
  (function () {
    var faqs = document.querySelectorAll(".pg-faq");
    Array.prototype.forEach.call(faqs, function (faq) {
      var items = faq.querySelectorAll("details");
      Array.prototype.forEach.call(items, function (item) {
        item.addEventListener("toggle", function () {
          if (!item.open) return;
          Array.prototype.forEach.call(items, function (otro) {
            if (otro !== item) otro.open = false;
          });
        });
      });
    });
  })();
})();
