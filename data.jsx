import React from 'react';

/* ===================== ICONS ===================== */
const Icon = {
  arrow: (p={}) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M5 12h14M13 6l6 6-6 6"/>
    </svg>
  ),
  arrowDown: (p={}) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 5v14M6 13l6 6 6-6"/>
    </svg>
  ),
  close: (p={}) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M18 6L6 18M6 6l12 12"/>
    </svg>
  ),
  menu: (p={}) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...p}>
      <path d="M4 7h16M4 12h16M4 17h16"/>
    </svg>
  ),
  check: (p={}) => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M5 12l5 5L20 7"/>
    </svg>
  ),
  /* Service icons - minimal abstract glyphs */
  consult: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12c0-5 4-9 9-9s9 4 9 9-4 9-9 9c-1.6 0-3.1-.4-4.4-1.1L3 21l1.1-4.6C3.4 15.1 3 13.6 3 12z"/>
      <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
      <path d="M8 12h.01M16 12h.01"/>
    </svg>
  ),
  web: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/>
      <path d="M21 21l-5.2-5.2"/>
    </svg>
  ),
  social: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 12c-2-2.8-4-4.5-6-4.5a4.5 4.5 0 000 9C8 16.5 10 14.8 12 12z"/>
      <path d="M12 12c2 2.8 4 4.5 6 4.5a4.5 4.5 0 000-9C16 7.5 14 9.2 12 12z"/>
    </svg>
  ),
  bot: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.2-.7.2-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.5-.5c.1-.2.2-.3.3-.5.1-.2 0-.4-.1-.5-.1-.1-.7-1.7-1-2.3-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.2 3.4 5.3 4.7.7.3 1.3.5 1.8.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3zM12 2C6.5 2 2 6.5 2 12c0 1.9.5 3.7 1.5 5.3L2 22l4.8-1.5C8.3 21.5 10.1 22 12 22c5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18c-1.7 0-3.4-.5-4.8-1.3l-.3-.2-3.4 1 1-3.3-.2-.3C3.5 14.4 3 13.2 3 12c0-5 4-9 9-9s9 4 9 9-4 9-9 9z"/>
    </svg>
  ),
  flow: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="8" width="16" height="11" rx="2"/>
      <circle cx="9.5" cy="13" r="1" fill="currentColor" stroke="none"/>
      <circle cx="14.5" cy="13" r="1" fill="currentColor" stroke="none"/>
      <path d="M9 17h6"/>
      <path d="M12 4v4"/>
      <path d="M2 14h2M20 14h2"/>
    </svg>
  ),
  code: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="7" y="2" width="10" height="20" rx="2"/>
      <circle cx="12" cy="17" r="1" fill="currentColor" stroke="none"/>
    </svg>
  ),
  seo: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="6.5"/>
      <path d="M20 20l-4-4M9 11h4M11 9v4"/>
    </svg>
  ),
  ads: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
      <path d="M15.54 8.46a5 5 0 010 7.07M19.07 4.93a10 10 0 010 14.14"/>
    </svg>
  ),
  palette: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C6.5 2 2 6.5 2 12c0 5.5 4.5 10 10 10 1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.4-.3-.4-.5-.8-.5-1.3 0-1.1.9-2 2-2h2.4c3.1 0 5.6-2.5 5.6-5.6C22 6.2 17.5 2 12 2z"/>
      <circle cx="6.5" cy="11.5" r="1" fill="currentColor" stroke="none"/>
      <circle cx="9.5" cy="7.5" r="1" fill="currentColor" stroke="none"/>
      <circle cx="14.5" cy="7" r="1" fill="currentColor" stroke="none"/>
      <circle cx="17.5" cy="11" r="1" fill="currentColor" stroke="none"/>
    </svg>
  ),
  google: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9"/>
      <path d="M17 12h-5v0a5 5 0 105-5"/>
    </svg>
  ),
  meta: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
    </svg>
  ),
  mail: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2"/>
      <path d="M3 7l9 6 9-6"/>
    </svg>
  ),
  whatsapp: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.2-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.5-.5c.1-.2.2-.3.3-.5.1-.2 0-.4-.1-.5-.1-.1-.7-1.7-1-2.3-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.2 3.4 5.3 4.7.7.3 1.3.5 1.8.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3z M12 2C6.5 2 2 6.5 2 12c0 1.9.5 3.7 1.5 5.3L2 22l4.8-1.5C8.3 21.5 10.1 22 12 22c5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18c-1.7 0-3.4-.5-4.8-1.3l-.3-.2-3.4 1 1-3.3-.2-.3C3.5 14.4 3 13.2 3 12c0-5 4-9 9-9s9 4 9 9-4 9-9 9z"/>
    </svg>
  ),
  map: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s7-6.5 7-12a7 7 0 10-14 0c0 5.5 7 12 7 12z"/>
      <circle cx="12" cy="10" r="2.5"/>
    </svg>
  ),
  clock: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9"/>
      <path d="M12 7v5l3 2"/>
    </svg>
  ),
  ig: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="0.7" fill="currentColor"/>
    </svg>
  ),
  li: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8.13H4.8V23H.22zM7.4 8.13h4.39v2.04h.06c.61-1.16 2.1-2.38 4.32-2.38 4.62 0 5.47 3.04 5.47 6.99V23h-4.57v-6.91c0-1.65-.03-3.77-2.3-3.77-2.3 0-2.66 1.8-2.66 3.65V23H7.4z"/>
    </svg>
  ),
  x: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zM17.083 19.77h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
};

/* ===================== DATA ===================== */
/* 7 tiles — orden = orden de render, posición de grilla definida en cada entrada */
const SERVICES = [
  {
    id: "software",
    icon: "code",
    bgImage: "software-bg.jpg.webp",
    grid: { col: "1/3", row: "1/3" },
    name: "Tu Aplicación o Software Propio",
    tag: "Producto",
    tagline: "Software a medida para resolver tu problema real",
    page: "/servicios/desarrollo-software.html",
    desc: "Construimos aplicaciones web, apps móviles, dashboards y sistemas internos pensados específicamente para tu operación. Tecnología moderna, escalable y mantenible.",
    includes: [
      "Aplicaciones web y plataformas",
      "Apps móviles (iOS y Android)",
      "Dashboards y paneles administrativos a medida",
      "APIs e integraciones entre sistemas",
      "Automatizaciones internas",
      "Mantenimiento y evolución del producto",
    ],
  },
  {
    id: "seo-web",
    icon: "google",
    bgImage: "web-bg.webp",
    grid: { col: "3/5", row: "1/2" },
    name: "Tu Sitio Web Moderno, Para Móvil y Pc",
    tag: "Posicionate en Google",
    tagline: "Aparecé primero en Google y convertí ese tráfico",
    page: "/servicios/sitios-web.html",
    desc: "Aparecé primero en Google y convertí ese tráfico con un sitio profesional, rápido y optimizado. Hosting, dominio y SEO técnico incluidos.",
    includes: [
      "SEO técnico, de contenido y local",
      "Diseño UX/UI a medida y responsive",
      "Alta de dominio y certificado SSL",
      "Hosting y panel de administración",
      "Reportes mensuales de posicionamiento",
    ],
  },
  {
    id: "social",
    icon: "meta",
    bgImage: "rrss-bg.webp",
    grid: { col: "3/4", row: "2/3" },
    page: "/servicios/social-media.html",
    name: "Destaca en las Redes Sociales",
    tag: "Social Media",
    tagline: "Presencia constante, contenido que conecta",
    desc: "Creamos y gestionamos tu presencia en Meta, Instagram, TikTok, YouTube y LinkedIn. Estrategia, contenido y crecimiento real.",
    includes: [
      "Estrategia de contenido por plataforma",
      "Diseño de piezas gráficas y video",
      "Calendario editorial mensual",
      "Community management",
      "Reportes de métricas y crecimiento",
    ],
  },
  {
    id: "ads",
    icon: "ads",
    bgImage: "ads-bg.webp",
    grid: { col: "4/5", row: "2/4" },
    page: "/servicios/ads.html",
    name: "Anuncios en Google & Redes Sociales",
    tag: "Campañas Publicitarias",
    tagline: "Inversión publicitaria con retorno medible",
    desc: "Campañas en Google, Meta, TikTok y LinkedIn. Optimizamos cada peso invertido para generar leads, ventas o reconocimiento.",
    includes: [
      "Estrategia de campañas por objetivo",
      "Creatividades y copys publicitarios",
      "Configuración de pixels y tracking",
      "Optimización continua con A/B testing",
      "Reportes con métricas claras y ROAS",
    ],
  },
  {
    id: "asistentes",
    icon: "flow",
    bgImage: "agentes-bg.webp",
    grid: { col: "1/2", row: "3/4" },
    name: "Agentes iA Atendiendo Tu Negocio",
    tag: "Inteligencia Artificial",
    tagline: "No un bot con reglas: un agente que razona y actúa",
    page: "/servicios/agentes-ia.html",
    desc: "Agentes que razonan en cada interacción, consultan tu CRM o base de conocimiento y ejecutan acciones reales.",
    includes: [
      "Diseño del system prompt y comportamiento",
      "Conexión con base de conocimiento (docs, CRM, ERP)",
      "Tools personalizadas: agendar, consultar, registrar",
      "Memoria conversacional e historial",
      "Logging, observabilidad e iteración continua",
    ],
  },
  {
    id: "chatbots",
    icon: "bot",
    bgImage: "bots-bg.webp",
    grid: { col: "2/3", row: "3/4" },
    name: "Bots de WhatsApp",
    tag: "Automatización",
    tagline: "Atención 24/7 sin contratar más personal",
    page: "/servicios/bots-whatsapp.html",
    desc: "Automatizamos conversaciones en WhatsApp: respuestas, atención al cliente, ventas y derivaciones. Conectado a tu CRM y herramientas.",
    includes: [
      "Conexión vía Evolution API (sin costo por mensaje)",
      "Flujos de atención, FAQs y bienvenida a medida",
      "Calificación y derivación automática de leads",
      "Integración con CRM o Google Sheets",
      "30 días de soporte incluido",
    ],
  },
  {
    id: "branding",
    icon: "palette",
    bgImage: "brand-bg.webp",
    grid: { col: "3/4", row: "3/4" },
    page: "/servicios/branding-uiux.html",
    name: "Desarrollamos la identidad de tu Marca, Producto o Servicio",
    tag: "Branding",
    tagline: "Identidad visual que genera confianza y conversión",
    desc: "Identidad visual e interfaces que generan confianza y conversión. Diseño con intención, no decoración.",
    includes: [
      "Diseño de identidad visual y branding",
      "UI/UX para web y aplicaciones",
      "Guías de estilo y sistema de diseño",
      "Piezas gráficas para redes y campañas",
    ],
  },
];

const PROCESS = [
  { num: "01", name: "Diagnóstico",  desc: "Entendemos tu negocio, tus objetivos y dónde están las oportunidades reales. Reunión inicial sin costo." },
  { num: "02", name: "Propuesta",    desc: "Te presentamos una solución concreta, con alcance, tiempos e inversión definida. Sin letra chica." },
  { num: "03", name: "Desarrollo",   desc: "Ejecutamos con sprints cortos, reportando avances semanales. Vos ves cómo evoluciona el proyecto en tiempo real." },
  { num: "04", name: "Soporte",      desc: "No te dejamos solo después del lanzamiento. Acompañamos, optimizamos y escalamos junto a vos." },
];

const CASES = [
  {
    metric: "+40", unit: "%", label: "Leads calificados",
    quote: "Implementamos un asistente IA para precalificar leads en WhatsApp y el equipo comercial pasó de filtrar a cerrar. Hoy llegan al vendedor solo los leads listos para comprar.",
    name: "Lucía Méndez", role: "Head of Growth, Inmobiliaria Norte", initials: "LM",
  },
  {
    metric: "−60", unit: "%", label: "Tiempo de atención",
    quote: "El chatbot resuelve el 70% de las consultas frecuentes sin intervención humana. Liberamos al equipo para tareas que sí necesitan a una persona.",
    name: "Martín Aguirre", role: "Director de Operaciones, Clínica Salud+", initials: "MA",
  },
  {
    metric: "3", unit: "× ventas", label: "En 6 meses",
    quote: "Rediseño del sitio + campañas + automatización del seguimiento. La combinación nos triplicó las ventas online manteniendo la misma inversión publicitaria.",
    name: "Sofía Romero", role: "CEO, Studio Verde", initials: "SR",
  },
];

const CLIENT_LOGOS = ["Norte Capital", "Salud+ Clínica", "Studio Verde", "Lumen Retail", "Astra Ventures", "Pampa Foods"];

export { Icon, SERVICES, PROCESS, CASES, CLIENT_LOGOS };
