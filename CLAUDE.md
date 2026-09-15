# Reglas del proyecto — G360ia website

## Regla 1 — Scroll snap en páginas de servicios (desktop Y mobile)

Todas las páginas en `/servicios/*.html` tienen `<body class="svc-page">`.
El CSS en `styles.css` aplica `scroll-snap-type: y mandatory` sobre `html:has(body.svc-page)`.
Cada sección (`.section`, `.bw-hero`, `.bw-cta-final`, `.faq-section`, `.seo-section`, etc.)
tiene `scroll-snap-align: start`, `scroll-snap-stop: always`, `height: 100vh; height: 100dvh`.

Usar SIEMPRE `100dvh` (con fallback `100vh`) — en móvil `100vh` incluye la barra del browser
y rompe el snap. `100dvh` es el viewport real visible.

El media query `@media (max-width: 1023px)` de overflow-y está excluido con
`:not(:has(body.svc-page))` para no pisar el snap en mobile.

**Al hacer cualquier corrección o agregar un nuevo segmento en una página de servicios,
asegurate de que el segmento tenga `height: 100vh; height: 100dvh` y que su contenido
esté estructurado en columnas para que entre en pantalla sin scroll interno.**

## Regla 2 — Sin scroll interno visible en ningún segmento (desktop Y mobile)

Ningún segmento de las páginas de servicios puede tener scrollbar visible.
`overflow: hidden` en todos los segmentos snap.
Si un segmento tiene mucho contenido, la solución es rediseñarlo en columnas,
reducir tamaño de fuente/espaciado, o dividir en dos segmentos separados.
Nunca resolver con `overflow-y: auto` o `overflow-y: scroll`.

## Regla 3 — Modales y scroll snap

El archivo `snap-manager.js` se carga en todas las páginas de servicios.
Convención de clases para modales abiertos: `is-open` sobre el elemento `.modal` o `[data-modal]`.
Cuando el usuario scrollea con un modal abierto: el modal se cierra, el salto de sección
se cancela ese tick. El siguiente scroll navega al segmento siguiente/anterior.

## Regla 4 — Footer compartido

El footer de todas las páginas de servicios y del blog se carga dinámicamente vía `fetch`
desde la URL `/partials/footer.html`. El archivo fuente vive en **`public/partials/footer.html`**
(tiene que estar en `public/` porque en producción Caddy sólo sirve `dist/`, y Vite únicamente
copia `public/` al build — si estuviera en la raíz, el `fetch` da 404 y el footer desaparece).
No editar el footer en cada página individualmente: para cambiarlo en todas, editar solo
`public/partials/footer.html`.

**La misma regla vale para cualquier archivo que una página pida por URL absoluta.**
`navbar-init.js` y `snap-manager.js` estuvieron en la raíz del repo hasta el 15-sep-2026 y
por eso daban **404 en producción**: las páginas los piden como `/navbar-init.js`, Vite no
los tocaba (los deja como referencia externa porque no son `type="module"`) y nunca llegaban
a `dist/`. Resultado: ninguna página de `/servicios` tenía barra de navegación en el sitio
publicado. Hoy viven en `public/`, junto a `blog-data.js` y `blog-cards.js`.

Regla práctica: si un `<script src="/algo.js">` o un `fetch('/algo')` nombra la ruta con
barra inicial, el archivo va en `public/`. Verificarlo después de `npm run build` con
`ls dist/algo.js` antes de dar por hecho que funciona.

## Regla 5 — SEO/GEO de artículos del blog (`/blog/*.html`)

Ver **`BLOG-TEMPLATE.md`** en la raíz del repo para la guía completa (objetivo del blog,
cómo clonar la plantilla, estructura obligatoria, imágenes, checklist de publicación).
Es el documento que debe seguir cualquier agente —humano o IA— que genere un artículo
nuevo, incluido el futuro módulo de calendario editorial del panel.

`blog/geo-vs-seo-posicionar-pyme-ia.html` es el artículo plantilla: toda nota nueva debe
replicar su misma base antes de publicarse. Resumen del checklist (detalle completo en
`BLOG-TEMPLATE.md`):

- JSON-LD `BlogPosting` con `mentions` y `about` (entidades reales del tema: marcas, conceptos,
  herramientas mencionadas), `BreadcrumbList`, y `FAQPage` si el artículo tiene preguntas frecuentes.
- Bloque `.bx-asked` con **5 preguntas de intención (GEO)** debajo de la FAQ: redactadas como las
  haría una persona al buscar/preguntarle a una IA, distintas de las FAQ, cada una enlazada por
  ancla (`#id`) a la sección que la responde. NO se marca como `FAQPage` (ver `BLOG-TEMPLATE.md`).
- `author` como `Person` (no `Organization` genérica) con `jobTitle`, `description` y `sameAs`
  a su LinkedIn — hoy el autor es Pablo Montenegro, fundador de Gestión 360 IA
  (https://www.linkedin.com/in/pablo-montenegr0/). Mismo dato en `<meta property="article:author">`
  y en la firma visible (`.bx-byline-name`) con link a LinkedIn (`rel="me"`).
- `og:image`/`twitter:image` propias del artículo (la imagen real de portada, no `og-image.jpg` genérico).
- Imágenes con `alt` descriptivo (nunca vacío salvo que sean puramente decorativas).
- **Al menos 1-2 enlaces salientes a fuentes externas de autoridad** (documentación oficial de
  Google Search Central, OpenAI, Anthropic, etc.) relacionados al tema concreto de la nota.
  No hardcodear una fuente genérica — elegir la fuente real y pertinente a lo que se está
  afirmando en ese párrafo, igual que se hizo en la nota de GEO vs SEO.
- Palabras/frases clave resaltadas (`.bx-kw` / `.bx-kw--strong`) con `data-service="<clave>"`
  apuntando al servicio real de `public/blog-data.js` (no a la etiqueta textual) para que el
  modal de relacionados funcione. Si el artículo introduce un servicio o tag nuevo, sumarlo
  primero a `services`/`posts` en `blog-data.js`.
- Artículo agregado a `posts` en `blog-data.js` con `slug`, `url`, `img`, `excerpt`, `services`,
  `cat`, `date` y `base` (visitas iniciales) — así entra solo en "Más leídos" y en los modales
  de servicio relacionado sin tocar código adicional.

## Regla 6 — Las tres patas del sitio y el kit `.pg-page`

El sitio vende tres cosas distintas a tres personas distintas, y la home es un **router de
intención**, no un catálogo: hero → tres puertas (`PUERTAS` en `data.jsx`) → servicios →
contacto. Cada puerta lleva a su rama y ahí se despliega el detalle.

| Rama | URL | Qué es | Dónde vive el detalle |
|---|---|---|---|
| Servicios | `/servicios` + `/servicios/<slug>` | trabajo a medida | este repo |
| Software propio | `/software` + `/software-para-<vertical>` | producto por cuota mensual | este repo, y el sitio del producto |
| Afiliados | `/afiliados` | reventa por comisión | el alta y la liquidación, en el panel del producto |

### Las cuatro páginas nuevas usan `class="svc-page pg-page"`

`svc-page` da el snap y los 100dvh por segmento (Reglas 1 y 2). `pg-page` habilita el **kit
de páginas** de `styles.css` (busca `KIT DE PÁGINAS — .pg-page`): `.pg-head`, `.pg-grid`,
`.pg-card`, `.pg-lista`, `.pg-pasos`, `.pg-cinta`, `.pg-shots`, `.pg-faq`, `.pg-geo`,
`.pg-calc`, `.pg-badge`, `.pg-migas`. Está separado en dos clases a propósito: las ocho
páginas de `/servicios` que ya están indexadas no lo heredan y su layout no se toca.

**Al agregar un segmento a una página `pg-page`, medir que entre en 100dvh en un teléfono**
(390×844 es el caso ajustado). La comprobación es una línea en la consola del navegador:

```js
Array.from(document.querySelectorAll('main > section')).map(s => {
  const c = s.querySelector('.container');
  return { id: s.id, corta: c.scrollHeight - c.clientHeight };
});
```

Cualquier `corta > 0` es contenido que se pierde sin que el usuario se entere (el segmento
tiene `overflow:hidden`). Se arregla como dice la Regla 2: dos columnas, tipografía más
chica, o partir el segmento en dos. Nunca con `overflow-y: auto`.

### Duplicación con el sitio del producto

`vet.g360ia.com.ar` tiene sus propias páginas de funciones y precios y su propio sitemap.
`/software-para-veterinarias` **no las repite**: cuenta el producto desde el lado de quien
lo construye y manda allá para el detalle, los precios y el alta. Su JSON-LD de
`SoftwareApplication` declara `url` apuntando a `vet.g360ia.com.ar` justamente para que la
entidad consolide en el sitio del producto. Toda vertical nueva sigue el mismo criterio.

Tampoco se declaran precios en esta página: salen de la base del producto por `/api/planes`
y cambian con un UPDATE. Un número escrito acá a mano se desactualiza solo, y un precio
incorrecto en datos estructurados es peor que ningún precio.

### Comisión de afiliados

El 20% de `/afiliados` es el porcentaje de entrada y tiene tres copias que deben coincidir:
`COMISION_PCT` en `data.jsx` (este repo), `COMISION_PCT` en `lib/afiliado-textos.js` del
turnero, y el DEFAULT de `afiliado.comision_pct` en su migración 090. El que manda es el de
la base. Si cambia, cambian los tres.

## Stack

- Vite 5 + React 18 (index.html es SPA React)
- Páginas de servicios: HTML estático con islands React montados via `<script type="module">`
- CSS: `styles.css` global con variables CSS (tema dark glassmorphism, navy + gold)
- Tailwind: solo utilitarios, `preflight: false`, escanea `*.jsx` y `components/**/*.jsx`
- Deploy: Easypanel con nixpacks.toml, Node 18
