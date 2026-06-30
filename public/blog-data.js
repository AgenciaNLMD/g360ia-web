/* ============================================================
   BLOG · fuente de datos compartida (data-driven, no hardcodeada por artículo)
   - Cada artículo declara a qué SERVICIO(S) pertenece.
   - Las palabras/frases clave se relacionan por servicio (data-service en el HTML).
   - Para sumar un artículo nuevo: agregalo a POSTS con sus services. Nada más.
   ============================================================ */
window.BlogData = (function () {

  /* Servicios que ofrecemos (con su página) */
  var services = {
    seo:      { name: 'Posicionamiento SEO / GEO', url: '/servicios/seo.html' },
    web:      { name: 'Sitios web',                url: '/servicios/sitios-web.html' },
    bots:     { name: 'Bots de WhatsApp',          url: '/servicios/bots-whatsapp.html' },
    agentes:  { name: 'Agentes de IA',             url: '/servicios/agentes-ia.html' },
    social:   { name: 'Social Media',              url: '/servicios/social-media.html' },
    ads:      { name: 'Campañas / Ads',            url: '/servicios/ads.html' },
    software: { name: 'Desarrollo de software',    url: '/servicios/desarrollo-software.html' },
    branding: { name: 'Branding / UI-UX',          url: '/servicios/branding-uiux.html' }
  };

  /* Artículos del blog. `services` = a qué servicio se relaciona cada nota. */
  var posts = [
    { slug: 'geo-vs-seo-posicionar-pyme-ia', title: 'GEO vs SEO: cómo posicionar tu pyme en Google y en las IA', url: '/blog/geo-vs-seo-posicionar-pyme-ia', img: '/multimedia/geo-vs-seo.webp', excerpt: 'Qué es el GEO y cómo aparecer en las respuestas de ChatGPT, Gemini y Perplexity.', services: ['seo'], cat: 'Tendencias', date: '17 junio, 2026', base: 2380 },
    { slug: 'google-business-profile', title: 'Google Business Profile: optimizá tu ficha paso a paso', url: '/blog/google-business-profile', img: '/multimedia/google-business.webp', excerpt: 'Aparecé en Maps y en las búsquedas "cerca mío" de tu zona.', services: ['seo'], cat: 'Tutoriales', date: '14 junio, 2026', base: 960 },
    { slug: 'prompts-para-tu-negocio', title: 'Prompts para tu negocio: 10 plantillas que sí funcionan', url: '/blog/prompts-para-tu-negocio', img: '/multimedia/ia-prompts.webp', excerpt: 'Plantillas listas para redactar, vender y atender mejor con IA.', services: ['agentes'], cat: 'IA generativa', date: '13 junio, 2026', base: 870 },
    { slug: 'bots-whatsapp-cuando-automatizar', title: 'Bots de WhatsApp: cuándo automatizar y cuándo no', url: '/blog/bots-whatsapp-cuando-automatizar', img: '/multimedia/automatizacion.webp', excerpt: 'Qué conviene resolver con un bot y qué dejar siempre a una persona.', services: ['bots'], cat: 'Automatización', date: '8 junio, 2026', base: 540 }
  ];

  var KEY = 'bx-views';
  function readViews() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
  function withViews() {
    var v = readViews();
    return posts.map(function (p) {
      var o = {}; for (var k in p) o[k] = p[k];
      o.views = (p.base || 0) + (v[p.slug] || 0);
      return o;
    });
  }

  return {
    services: services,
    posts: posts,
    /* suma +1 visita al artículo actual (contador interno por navegador) */
    bump: function (slug) { var v = readViews(); v[slug] = (v[slug] || 0) + 1; try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) {} },
    /* más leídos (por visitas), excluyendo el actual */
    mostRead: function (excludeSlug, limit) {
      return withViews().filter(function (p) { return p.slug !== excludeSlug; })
        .sort(function (a, b) { return b.views - a.views; })
        .slice(0, limit || 8);
    },
    /* artículos relacionados a un SERVICIO, excluyendo el actual */
    byService: function (service, excludeSlug) {
      return withViews().filter(function (p) { return p.services.indexOf(service) !== -1 && p.slug !== excludeSlug; });
    }
  };
})();
