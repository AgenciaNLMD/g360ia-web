/* ============================================================
   BLOG · tarjetas + carrusel "Más leídos" (mobile) + modal de palabra clave
   Requiere blog-data.js cargado antes. No hardcodeado: lee window.BlogData.
   Página debe declarar:
     - <body data-blog-slug="slug-del-articulo-actual">
     - contenedor "Más leídos": #bx-rank-list (desktop) + #bx-rank-carousel (mobile)
     - palabras clave: <span class="bx-kw" data-service="seo">...</span>
       (data-service admite varios separados por coma: data-service="agentes,bots")
     - modal: #bx-kw-modal (markup en blog-kw-modal.html o ya incluido en la página)
   ============================================================ */
(function () {
  if (!window.BlogData) return;

  var CURRENT = document.body.getAttribute('data-blog-slug') || '';

  /* registra la visita del artículo actual */
  if (CURRENT) window.BlogData.bump(CURRENT);

  function esc(s) {
    return String(s == null ? '' : s).replace(/[<>&]/g, function (c) { return { '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]; });
  }

  function cardHTML(p) {
    return '' +
      '<a class="bx-card" href="' + p.url + '">' +
        '<span class="bx-card-thumb"><img src="' + p.img + '" alt="' + esc(p.title) + '" loading="lazy" /></span>' +
        '<span class="bx-card-body">' +
          '<span class="bx-card-cat">' + esc(p.cat) + '</span>' +
          '<span class="bx-card-title">' + esc(p.title) + '</span>' +
          '<span class="bx-card-excerpt">' + esc(p.excerpt) + '</span>' +
          '<span class="bx-card-read">Leer <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>' +
        '</span>' +
      '</a>';
  }

  /* ---------- Más leídos: lista (PC) + carrusel (mobile) ---------- */
  (function () {
    var list = document.getElementById('bx-rank-list');
    var carousel = document.getElementById('bx-rank-carousel');
    if (!list && !carousel) return;

    var items = window.BlogData.mostRead(CURRENT, 8);

    if (list) {
      list.innerHTML = items.slice(0, 5).map(function (p, i) {
        return '<a class="bx-rank-item" href="' + p.url + '">' +
               '<span class="bx-rank-num">' + (i + 1) + '</span>' +
               '<span class="bx-rank-main">' +
                 '<span class="bx-rank-title">' + esc(p.title) + '</span>' +
                 '<span class="bx-rank-meta"><span class="bx-rank-cat">' + esc(p.cat) + '</span> · ' + esc(p.date) + '</span>' +
               '</span></a>';
      }).join('');
    }

    if (carousel) {
      carousel.innerHTML = items.map(cardHTML).join('');
    }
  })();

  /* ---------- Modal de palabra/frase clave (relación por SERVICIO) ---------- */
  (function () {
    var modal = document.getElementById('bx-kw-modal');
    var kws = Array.prototype.slice.call(document.querySelectorAll('[data-service]'));
    if (!modal || !kws.length) return;

    var titleEl = modal.querySelector('#bx-kw-modal-title');
    var bodyEl = modal.querySelector('#bx-kw-modal-body');

    function open(serviceKeys) {
      var seen = {};
      var results = [];
      serviceKeys.forEach(function (svc) {
        window.BlogData.byService(svc, CURRENT).forEach(function (p) {
          if (!seen[p.slug]) { seen[p.slug] = true; results.push(p); }
        });
      });
      results.sort(function (a, b) { return b.views - a.views; });

      var serviceNames = serviceKeys
        .map(function (svc) { return window.BlogData.services[svc] ? window.BlogData.services[svc].name : svc; })
        .filter(function (v, i, arr) { return arr.indexOf(v) === i; });
      var label = serviceNames.join(' y ');

      if (titleEl) titleEl.textContent = label ? 'Artículos relacionados al servicio "' + label + '"' : 'Artículos relacionados';
      if (bodyEl) {
        bodyEl.innerHTML = results.length
          ? results.map(cardHTML).join('')
          : '<p class="bx-kw-modal-empty">Todavía no hay más notas sobre este tema. Mirá nuestro blog completo.</p>';
      }
      modal.classList.add('is-open');
      document.body.classList.add('bx-modal-lock');
    }
    function close() {
      modal.classList.remove('is-open');
      document.body.classList.remove('bx-modal-lock');
    }

    kws.forEach(function (el) {
      el.setAttribute('role', 'button');
      el.setAttribute('tabindex', '0');
      var svc = el.getAttribute('data-service').split(',').map(function (s) { return s.trim(); }).filter(Boolean);
      function trigger() { open(svc); }
      el.addEventListener('click', trigger);
      el.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); trigger(); } });
    });

    Array.prototype.slice.call(modal.querySelectorAll('[data-close]')).forEach(function (b) { b.addEventListener('click', close); });
    modal.addEventListener('click', function (e) { if (e.target === modal) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  })();
})();
