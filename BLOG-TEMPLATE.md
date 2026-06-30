# Blog — plantilla y reglas para generar artículos (humano o IA)

> Documento de referencia para cualquier agente (humano o IA, incluyendo el futuro módulo
> de calendario editorial en el panel) que vaya a crear y publicar un artículo nuevo en
> `/blog/*.html`. Artículo base / plantilla viva: `blog/geo-vs-seo-posicionar-pyme-ia.html`.

## 0. Objetivo del blog (no perder de vista esto)

El blog **no es un blog de interés general**. Es una herramienta de **SEO y GEO** para que
Gestión 360 IA aparezca en Google y en las respuestas de IA generativas (ChatGPT, Gemini,
Perplexity, Copilot) cuando alguien busca algo relacionado a los **servicios que vendemos**.

Cada artículo nuevo tiene que:
- Estar temáticamente atado a uno o más servicios reales de `public/blog-data.js`
  (`seo`, `web`, `bots`, `agentes`, `social`, `ads`, `software`, `branding`).
- Empujar, directa o indirectamente, hacia esos servicios (CTA, enlaces internos,
  barra fija de servicio).
- Si un tema no se puede atar a ningún servicio actual, no se escribe — o primero se agrega
  el servicio nuevo a `blog-data.js`.

Si terceros encuentran valor en la nota además de eso, genial — pero no es el objetivo.

## 1. Dónde vive cada cosa

| Qué | Dónde |
|---|---|
| Metadata del artículo (slug, título, excerpt, imagen, categoría, fecha, servicios) | `public/blog-data.js` → array `posts` |
| Catálogo de servicios disponibles | `public/blog-data.js` → objeto `services` |
| Contenido redactado del artículo (HTML completo) | `blog/<slug>.html` (un archivo por artículo, clonado de la plantilla) |
| Reglas de scroll/snap/footer/modales del sitio en general | `CLAUDE.md` (Reglas 1-4) |
| Checklist SEO/GEO obligatorio por artículo | `CLAUDE.md` (Regla 5) + este documento |
| Imágenes | `public/multimedia/<slug>.webp` |

**No** hay backend ni CMS hoy: cada artículo es un `.html` estático commiteado al repo.
El "publicar" hoy es: el archivo existe + está enlazado desde `blog/index.html` y el
`sitemap.xml`. El futuro módulo del panel con calendario va a automatizar ese paso de
"enlazar llegada la fecha", pero el archivo en sí se arma con esta misma plantilla.

## 2. Cómo clonar la plantilla

1. Duplicar `blog/geo-vs-seo-posicionar-pyme-ia.html` → `blog/<nuevo-slug>.html`.
2. Reemplazar: `<title>`, meta description, canonical, todos los `og:*`/`twitter:*`,
   los 3 bloques JSON-LD (`BlogPosting`, `BreadcrumbList`, `FAQPage`), `data-cat` del body,
   `data-blog-slug` del body, breadcrumb visible, H1, badges, imagen de portada, tags row,
   todo el contenido de `.bx-content`, y el TOC del sidebar.
3. **No tocar**: el header (`.bx-header`), el footer (`#site-footer` + fetch a
   `/partials/footer.html`), el modal de chat (`#bx-modal`), el modal de palabra clave
   (`#bx-kw-modal`), la barra de servicio (`#bx-servicebar`), ni los `<script>` finales
   (`/blog-data.js`, `/blog-cards.js`, lógica de acordeones/TOC/share). Eso es compartido
   y ya funciona — clonarlo tal cual.
4. Dar de alta el artículo en `blog-data.js` → `posts` (slug, title, url, img, excerpt,
   services, cat, date, base de visitas iniciales en 0 o un número bajo realista).

## 3. Estructura obligatoria del contenido (`.bx-content`)

- **Intro** (`.bx-intro`): 1-2 párrafos sin acordeón, texto completo siempre visible.
- **Secciones en acordeón** (`.bx-acc`): el desarrollo del tema, una idea por acordeón,
  con `id` único para el TOC.
- Al menos **una tabla comparativa** o **una quote destacada** (`.bx-quote`) si el tema
  lo amerita — no es obligatorio en todos los artículos, sí recomendado.
- **FAQ** (`.bx-faq` + JSON-LD `FAQPage`): 4-6 preguntas reales que la gente buscaría,
  coherentes con las preguntas que un usuario le haría a una IA generativa sobre el tema.
- **Preguntas de intención / GEO** (`.bx-asked`, debajo de la FAQ): lista de **5 preguntas**
  redactadas como las haría una persona al buscar o al preguntarle a una IA ("¿Conviene
  poner un chatbot en mi WhatsApp?"). Sirven para ampliar el long-tail conversacional que
  cubre la nota. Reglas:
  - **Distintas a las FAQ** (más conversacionales / de buscador), para no canibalizarlas.
  - **Cada pregunta enlaza por ancla (`#id`) a la sección que la responde** — así no son
    decorativas: mejoran navegación y el answer-targeting para las IA.
  - **NO se marcan como `FAQPage`** (ya existe uno con pregunta+respuesta; duplicarlo con
    preguntas sin respuesta es schema inválido). Van como contenido visible, sin JSON-LD.
- **CTA final** (`.bx-art-cta`) apuntando al servicio principal del artículo
  (`/contacto?servicio=<clave>`).
- **TOC** (`#bx-toc`) con todos los `id` de las secciones.

## 4. Palabras/frases clave resaltadas → modal de relacionados

Envolver 3-6 palabras o frases clave del texto en:

```html
<span class="bx-kw" data-service="seo">SEO</span>
<span class="bx-kw--strong" data-service="agentes,bots">respuesta directa redactada por una IA</span>
```

Reglas:
- `data-service` apunta al **servicio real** (clave de `blog-data.js` → `services`),
  **no** a la palabra textual. Ej: la frase "agente que atiende WhatsApp" puede ir a
  `data-service="bots"`, no a una etiqueta "agente".
- Acepta varios servicios separados por coma si la frase toca más de un servicio.
- `bx-kw--strong` para el concepto central del artículo (más peso visual), `bx-kw` para
  menciones secundarias.
- No hace falta tocar JS: `blog-cards.js` ya detecta cualquier `[data-service]` de la
  página y arma el modal solo.

## 5. JSON-LD obligatorio (ver `geo-vs-seo-posicionar-pyme-ia.html` como referencia exacta)

- `BlogPosting` con `headline`, `description`, `image` (la del artículo, no genérica),
  `datePublished`/`dateModified` reales, `mentions` y `about` (entidades concretas del
  tema: marcas, herramientas, conceptos — no genérico), `articleSection`.
- `author` SIEMPRE como `Person`, no `Organization`:
  ```json
  "author": {
    "@type": "Person",
    "name": "Pablo Montenegro",
    "jobTitle": "AI Product Builder · Founder de SaaS para PyMEs",
    "description": "Fundador de Gestión 360 IA. Arquitectura · Producto · Automatización.",
    "url": "https://g360ia.com.ar/",
    "sameAs": ["https://www.linkedin.com/in/pablo-montenegr0/"]
  }
  ```
- `publisher`: Organization Gestión 360 IA (igual en todos los artículos, no cambia).
- `BreadcrumbList` con el título real del artículo en la última posición.
- `FAQPage` con las mismas preguntas que aparecen en `.bx-faq` (deben coincidir).

## 6. Enlaces salientes (autoridad externa)

Cada artículo necesita **1-2 enlaces salientes reales** a fuentes oficiales relevantes al
punto exacto que se está afirmando en ese párrafo (Google Search Central, documentación
oficial de OpenAI/Anthropic/Meta, etc.). No usar siempre la misma fuente genérica —
elegir la que corresponda al tema de la nota. `target="_blank" rel="noopener noreferrer"`.

## 7. Firma del autor visible

En `.bx-art-byline`, usar siempre:

```html
<span class="bx-avatar">PM</span>
<div class="bx-byline-name">
  <a href="https://www.linkedin.com/in/pablo-montenegr0/" target="_blank" rel="noopener noreferrer me" style="color:inherit">Pablo Montenegro</a>
</div>
```

## 8. Imágenes (opción B — banco de imágenes libres de derechos)

- **Origen**: el agente busca y trae imágenes de bancos libres de derechos (ej. Unsplash,
  Pexels, Pixabay u otro banco con licencia que permita uso comercial sin atribución
  obligatoria). No generar imágenes con IA por ahora.
- **Conversión obligatoria a `.webp`** antes de guardar — sea cual sea el formato original
  (jpg/png), nunca se commitea nada que no sea `.webp`.
- **Peso objetivo**: similar al actual (~20-40 KB para la portada, aspect ratio 16:9 o 21:8).
  No subir imágenes pesadas sin comprimir.
- **Nombre de archivo = slug del artículo**, ej. `public/multimedia/<slug>.webp`. Si el
  artículo necesita más de una imagen, sufijo numérico: `<slug>-2.webp`.
- **Licencia**: verificar que la imagen elegida permita uso comercial. Evitar bancos que
  exijan atribución visible en el artículo (rompe el diseño) salvo que se pueda cumplir
  fácilmente.
- Registrar la ruta final en `blog-data.js` → campo `img` del post, y usarla también en
  `og:image`/`twitter:image`/JSON-LD `image` del artículo (no la genérica del sitio).
- `alt` de la imagen de portada: descripción real de la imagen + tema del artículo (no
  vacío, no solo el título pelado).

## 9. Checklist final antes de dar el artículo por "publicable"

- [ ] Tema atado a un servicio real de `blog-data.js`
- [ ] Clonado desde la plantilla, header/footer/modales sin tocar
- [ ] Alta completa en `blog-data.js` (`posts`)
- [ ] Imagen propia en `.webp`, peso liviano, en `public/multimedia/`
- [ ] JSON-LD completo (`BlogPosting` con `mentions`/`about`, `BreadcrumbList`, `FAQPage`)
- [ ] Autor `Person` (Pablo Montenegro) en JSON-LD + meta + firma visible
- [ ] `og:image`/`twitter:image` propias
- [ ] 3-6 palabras/frases clave con `data-service` apuntando a servicio real
- [ ] 1-2 enlaces salientes a fuentes externas de autoridad, pertinentes al párrafo
- [ ] CTA final apuntando al servicio principal del artículo
- [ ] FAQ visible coincide con JSON-LD `FAQPage`
- [ ] Bloque `.bx-asked` con 5 preguntas de intención (GEO) debajo de la FAQ, cada una
      enlazada por ancla a la sección que la responde, sin marcado `FAQPage`
- [ ] Artículo enlazado desde `blog/index.html` y agregado a `sitemap.xml` (esto es lo
      que "habilita" la URL — pendiente automatizar vía calendario del panel)
