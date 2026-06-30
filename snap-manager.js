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
})();
