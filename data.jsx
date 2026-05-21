/* global React */
const { useState, useEffect, useRef, useCallback, useMemo } = React;

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
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="14" rx="2"/>
      <path d="M3 9h18M7 6.5h.01M10 6.5h.01"/>
    </svg>
  ),
  social: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="6" r="2.5"/>
      <circle cx="18" cy="6" r="2.5"/>
      <circle cx="12" cy="18" r="2.5"/>
      <path d="M7.5 7.8l3 7.8M16.5 7.8l-3 7.8"/>
    </svg>
  ),
  bot: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="6" width="16" height="12" rx="3"/>
      <path d="M9 11v1M15 11v1M9 15h6M12 2v4"/>
    </svg>
  ),
  flow: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="5" cy="5" r="2"/>
      <circle cx="19" cy="12" r="2"/>
      <circle cx="5" cy="19" r="2"/>
      <path d="M7 5h6a4 4 0 014 4v1M17 14v1a4 4 0 01-4 4H7"/>
    </svg>
  ),
  code: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 8l-4 4 4 4M16 8l4 4-4 4M14 6l-4 12"/>
    </svg>
  ),
  seo: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="6.5"/>
      <path d="M20 20l-4-4M9 11h4M11 9v4"/>
    </svg>
  ),
  ads: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11l14-6v14L3 13z"/>
      <path d="M7 13v4M20 11h2"/>
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
const SERVICES = [
  {
    id: "consultoria",
    icon: "consult",
    name: "Consultoría IA",
    tag: "Estrategia",
    tagline: "Estrategia para que la IA trabaje a favor de tu negocio",
    desc: "Identificamos dónde la IA puede generar impacto real: reducir costos, automatizar procesos, mejorar decisiones o potenciar la experiencia de tus clientes.",
    includes: [
      "Diagnóstico de procesos y oportunidades",
      "Roadmap de implementación IA",
      "Selección de herramientas y modelos",
      "Capacitación a equipos",
      "Acompañamiento estratégico continuo",
    ],
  },
  {
    id: "sitios",
    icon: "web",
    name: "Sitios web con alta y alojamiento",
    tag: "Desarrollo",
    tagline: "Sitios que venden, no solo se ven lindos",
    page: "/servicios/sitios-web",
    desc: "Sitios profesionales con diseño dinámico, hosting incluido, dominio configurado y todo listo desde el día uno. Mobile-first, rápidos y optimizados para conversión.",
    includes: [
      "Diseño UX/UI a medida y responsive",
      "Diseños dinámicos e interactivos",
      "Alta de dominio y configuración",
      "Hosting y certificado SSL",
      "Panel para que actualices contenido vos mismo",
      "Mantenimiento y soporte técnico",
    ],
  },
  {
    id: "redes",
    icon: "social",
    name: "Redes sociales",
    tag: "Contenido",
    tagline: "Presencia constante, contenido que conecta",
    desc: "Gestionamos tus redes con estrategia, contenido y comunidad. Creatividad humana + herramientas de IA para producir más, mejor y más rápido.",
    includes: [
      "Estrategia de contenido por plataforma",
      "Diseño de piezas gráficas y video",
      "Calendario editorial mensual",
      "Community management",
      "Reportes de métricas y crecimiento",
    ],
  },
  {
    id: "chatbots",
    icon: "bot",
    name: "Bots de WhatsApp",
    tag: "Automatización",
    tagline: "Atención 24/7 sin contratar más personal",
    page: "/servicios/bots-whatsapp",
    desc: "Bots de WhatsApp que responden consultas frecuentes, califican leads y agendan reuniones automáticamente, siguiendo flujos predefinidos. Operativo en 48 horas.",
    includes: [
      "Conexión vía Evolution API (sin costo por mensaje)",
      "Flujos de atención, FAQs y bienvenida a medida",
      "Calificación y derivación automática de leads",
      "Integración con CRM o Google Sheets",
      "Panel para ver conversaciones en tiempo real",
      "30 días de soporte incluido",
    ],
  },
  {
    id: "asistentes",
    icon: "flow",
    name: "Agentes IA conversacionales",
    tag: "IA Generativa",
    tagline: "No un bot con reglas: un agente que razona y actúa",
    page: "/servicios/agentes-ia",
    desc: "Agentes IA que razonan en cada conversación, consultan tu CRM o base de conocimiento y ejecutan acciones reales. Para casos donde un bot con árboles de decisión se queda corto.",
    includes: [
      "Diseño del system prompt y comportamiento del agente",
      "Conexión con base de conocimiento (docs, CRM, ERP)",
      "Tools personalizadas: agendar, consultar stock, registrar",
      "Memoria conversacional e historial",
      "Logging, observabilidad e iteración continua",
    ],
  },
  {
    id: "software",
    icon: "code",
    name: "Software, apps móviles y dashboards",
    tag: "Producto",
    tagline: "Software a medida para resolver tu problema real",
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
    id: "seo",
    icon: "seo",
    name: "SEO",
    tag: "Posicionamiento",
    tagline: "Que te encuentren cuando te buscan",
    desc: "Optimizamos tu sitio para aparecer primero en Google ante las búsquedas que importan para tu negocio. SEO técnico, de contenido y local.",
    includes: [
      "Auditoría SEO técnica",
      "Investigación de palabras clave",
      "Optimización on-page y de contenidos",
      "SEO local (Google Maps / negocio)",
      "Reportes mensuales de posicionamiento",
    ],
  },
  {
    id: "ads",
    icon: "ads",
    name: "ADS",
    tag: "Performance",
    tagline: "Inversión publicitaria con retorno medible",
    desc: "Diseñamos y gestionamos campañas en Google, Meta, TikTok y LinkedIn. Optimizamos cada peso invertido para generar leads, ventas o reconocimiento.",
    includes: [
      "Estrategia de campañas por objetivo",
      "Creatividades y copys publicitarios",
      "Configuración de pixels y tracking",
      "Optimización continua con A/B testing",
      "Reportes con métricas claras y ROAS",
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

Object.assign(window, { Icon, SERVICES, PROCESS, CASES, CLIENT_LOGOS });
