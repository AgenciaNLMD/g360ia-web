/**
 * navbar-init.js
 * Inyecta el topbar en todas las páginas svc-page.
 * - Desktop: glass topbar con anchors + dropdown servicios, se oculta 3s tras scroll
 * - Mobile: logo fijo + hamburguesa → panel lateral derecho
 * Lee data-nav-label en cada sección para construir los anchors de la página.
 */
(function () {
  if (!document.body.classList.contains('svc-page')) return;

  const SERVICES = [
    { label: 'Software a medida',  href: '/servicios/desarrollo-software.html' },
    { label: 'Sitios web',         href: '/servicios/sitios-web.html' },
    { label: 'SEO',                href: '/servicios/seo.html' },
    { label: 'Social Media',       href: '/servicios/social-media.html' },
    { label: 'Campañas ADS',       href: '/servicios/ads.html' },
    { label: 'Agentes IA',         href: '/servicios/agentes-ia.html' },
    { label: 'Bots WhatsApp',      href: '/servicios/bots-whatsapp.html' },
    { label: 'Branding & UI/UX',   href: '/servicios/branding-uiux.html' },
  ];

  /* ─────────── HTML ─────────── */
  const ddHTML = SERVICES.map(s =>
    `<li><a href="${s.href}" class="svc-dd-link">${s.label}</a></li>`
  ).join('');

  const panelServicesHTML = SERVICES.map(s =>
    `<li><a href="${s.href}" class="svc-panel-link">${s.label}</a></li>`
  ).join('');

  document.body.insertAdjacentHTML('afterbegin', `
    <!-- ── TOPBAR ── -->
    <nav id="svc-nav" class="svc-nav" aria-label="Navegación principal">
      <a href="/" class="svc-logo">
        <img src="/logo.webp" alt="G360ia" width="28" height="28" loading="lazy" />
        <span class="svc-logo-text">Gestion<span class="svc-num">360</span><span class="svc-ia">.iA</span></span>
      </a>

      <ul class="svc-anchors" id="svc-anchors" role="list"></ul>

      <div class="svc-nav-right">
        <div class="svc-services-wrap">
          <button class="svc-services-btn" id="svc-services-btn" aria-expanded="false">
            Servicios
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true">
              <path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <ul class="svc-dropdown" id="svc-dropdown" role="list">${ddHTML}</ul>
        </div>

        <a href="https://wa.me/5491125526561" target="_blank" rel="noopener" class="svc-nav-cta">
          WhatsApp →
        </a>

        <button class="svc-hamburger" id="svc-hamburger" aria-label="Abrir menú" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>

    <!-- ── OVERLAY ── -->
    <div class="svc-overlay" id="svc-overlay" aria-hidden="true"></div>

    <!-- ── PANEL MÓVIL ── -->
    <aside class="svc-panel" id="svc-panel" aria-hidden="true">
      <div class="svc-panel-head">
        <a href="/" class="svc-logo">
          <img src="/logo.webp" alt="G360ia" width="24" height="24" loading="lazy" />
          <span class="svc-logo-text">Gestion<span class="svc-num">360</span><span class="svc-ia">.iA</span></span>
        </a>
        <button class="svc-panel-close" id="svc-panel-close" aria-label="Cerrar menú">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>

      <div class="svc-panel-body">
        <div class="svc-panel-group">
          <p class="svc-panel-group-label">En esta página</p>
          <ul id="svc-panel-anchors" role="list"></ul>
        </div>
        <div class="svc-panel-group">
          <p class="svc-panel-group-label">Servicios</p>
          <ul role="list">${panelServicesHTML}</ul>
        </div>
      </div>

      <div class="svc-panel-foot">
        <a href="https://wa.me/5491125526561" target="_blank" rel="noopener" class="btn btn-gold">
          Consultanos por WhatsApp →
        </a>
      </div>
    </aside>
  `);

  /* ─────────── Referencias ─────────── */
  const navEl        = document.getElementById('svc-nav');
  const anchorsList  = document.getElementById('svc-anchors');
  const panelAnchors = document.getElementById('svc-panel-anchors');
  const hamburger    = document.getElementById('svc-hamburger');
  const panel        = document.getElementById('svc-panel');
  const overlay      = document.getElementById('svc-overlay');
  const panelClose   = document.getElementById('svc-panel-close');
  const servicesBtn  = document.getElementById('svc-services-btn');
  const dropdown     = document.getElementById('svc-dropdown');

  /* ─────────── Anchors: leer data-nav-label ─────────── */
  // Esperar a que React monte sus secciones (máx 1.5s)
  function buildAnchors() {
    const sections = Array.from(document.querySelectorAll('[data-nav-label]'));
    anchorsList.innerHTML = '';
    panelAnchors.innerHTML = '';

    sections.forEach((section, i) => {
      if (!section.id) section.id = 'svc-s' + i;
      const label = section.dataset.navLabel;
      const id    = section.id;

      // Desktop
      const li = document.createElement('li');
      li.innerHTML = `<a href="#${id}" class="svc-anchor" data-target="${id}">${label}</a>`;
      anchorsList.appendChild(li);

      // Panel móvil
      const pli = document.createElement('li');
      pli.innerHTML = `<a href="#${id}" class="svc-panel-anchor svc-panel-link" data-target="${id}">${label}</a>`;
      panelAnchors.appendChild(pli);
    });

    // Clicks — scroll suave compatible con snap
    document.querySelectorAll('[data-target]').forEach(a => {
      a.addEventListener('click', e => {
        e.preventDefault();
        const t = document.getElementById(a.dataset.target);
        if (t) t.scrollIntoView({ behavior: 'smooth' });
        if (a.closest('.svc-panel')) closePanel();
      });
    });

    // Active tracking con IntersectionObserver
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          document.querySelectorAll('[data-target]').forEach(a => {
            a.classList.toggle('is-active', a.dataset.target === entry.target.id);
          });
        }
      });
    }, { threshold: 0.5 });

    sections.forEach(s => io.observe(s));
  }

  // Construir inmediatamente y volver a intentar tras montar React
  buildAnchors();
  setTimeout(buildAnchors, 800);

  /* ─────────── Auto-hide (desktop + mobile) ─────────── */
  const isMobile = () => window.innerWidth < 768;
  let hideTimer = null;

  function showNav() { navEl.classList.remove('svc-nav--hidden'); }
  function hideNav() { navEl.classList.add('svc-nav--hidden'); }

  function scheduleHide() {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(hideNav, 1500);
  }

  // Entrada animada: arranca oculto, desliza hacia abajo, luego se oculta a los 1.5s
  navEl.classList.add('svc-nav--hidden');
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      showNav();
      scheduleHide();
    });
  });

  window.addEventListener('scroll', () => { showNav(); scheduleHide(); }, { passive: true });

  // Desktop: mostrar al acercar el mouse al tope
  document.addEventListener('mousemove', e => {
    if (isMobile()) return;
    if (e.clientY < 68) { showNav(); clearTimeout(hideTimer); }
  });

  /* ─────────── Dropdown servicios ─────────── */
  servicesBtn.addEventListener('click', e => {
    e.stopPropagation();
    const open = dropdown.classList.toggle('is-open');
    servicesBtn.setAttribute('aria-expanded', open);
    servicesBtn.classList.toggle('is-open', open);
  });
  document.addEventListener('click', () => {
    dropdown.classList.remove('is-open');
    servicesBtn.classList.remove('is-open');
    servicesBtn.setAttribute('aria-expanded', 'false');
  });

  /* ─────────── Panel móvil ─────────── */
  function openPanel() {
    panel.classList.add('is-open');
    overlay.classList.add('is-open');
    panel.setAttribute('aria-hidden', 'false');
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.classList.add('is-open');
  }
  function closePanel() {
    panel.classList.remove('is-open');
    overlay.classList.remove('is-open');
    panel.setAttribute('aria-hidden', 'true');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.classList.remove('is-open');
  }

  hamburger.addEventListener('click', () =>
    panel.classList.contains('is-open') ? closePanel() : openPanel()
  );
  panelClose.addEventListener('click', closePanel);
  overlay.addEventListener('click', closePanel);

  // Cerrar panel al scrollear
  window.addEventListener('wheel',      () => { if (panel.classList.contains('is-open')) closePanel(); }, { passive: true });
  window.addEventListener('touchmove',  () => { if (panel.classList.contains('is-open')) closePanel(); }, { passive: true });

})();
