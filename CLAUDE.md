# Reglas del proyecto — G360ia website

> **Vigente desde el 1-oct-2026 (Regla 10): el sitio vuelve a ser el de una consultora de IA.**
> Ya no enlaza ni nombra a Devaffi, afiliados ni developers. Donde las Reglas 6, 8 y 9 hablen
> de esas ramas, es historia: leer primero la Regla 10.

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

El footer de todas las páginas de servicios, del blog y de los legales se carga dinámicamente
vía `fetch` desde la URL `/partials/footer.html`. El archivo fuente vive en **`public/partials/footer.html`**
(tiene que estar en `public/` porque en producción Caddy sólo sirve `dist/`, y Vite únicamente
copia `public/` al build — si estuviera en la raíz, el `fetch` da 404 y el footer desaparece).
No editar el footer en cada página individualmente: para cambiarlo en todas, editar solo
`public/partials/footer.html`.

**Hay dos copias del pie y las dos tienen que decir lo mismo.** La home es React y arma el
suyo en `sections-bottom.jsx`; el resto del sitio hace `fetch` del partial. Son el mismo
diseño escrito dos veces, así que toda columna que se agregue va en los dos archivos o el
sitio se contradice a sí mismo según por dónde entre el visitante.

Las columnas hoy son seis: marca · Navegación · **Softwares 360iA** · Servicios · Contacto ·
Seguinos. La de softwares apunta al sitio del producto (`vet.g360ia.com.ar`): el que busca el
software quiere entrar al software. Desde el 16-sep-2026 ése es el criterio en **todo** el
sitio, no sólo en el pie — ver la Regla 6.

El pie **no tiene carrusel de tecnologías** desde el 15-sep-2026: eran dos filas de veinte
logos cada una animadas con `transform` en bucle infinito, siempre corriendo aunque nadie
las viera, en el único bloque que está en todas las páginas del sitio.

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
| Software propio | `/software` | producto por cuota mensual | el sitio del producto (`vet.g360ia.com.ar`) |
| Afiliados | `devaffi.com/afiliados` | reventa por comisión | repo `Devaffi-web`; se entra en `app.devaffi.com` (Reglas 8 y 9) |
| Developers | `devaffi.com/developers` | publicar tu software en el catálogo | repo `Devaffi-web`; se entra en `app.devaffi.com` (Reglas 8 y 9) |

### El kit `.pg-page`, que ya casi no se usa

`svc-page` da el snap y los 100dvh por segmento (Reglas 1 y 2). `pg-page` habilita el **kit
de páginas** de `styles.css` (busca `KIT DE PÁGINAS — .pg-page`): `.pg-head`, `.pg-grid`,
`.pg-card`, `.pg-lista`, `.pg-pasos`, `.pg-cinta`, `.pg-shots`, `.pg-faq`, `.pg-geo`,
`.pg-calc`, `.pg-badge`, `.pg-migas`. Está separado en dos clases a propósito: las ocho
páginas de `/servicios` que ya están indexadas no lo heredan y su layout no se toca.

**Es un kit en retirada.** Las tres páginas que lo usaban ya pasaron al sistema claro
(Regla 7) y hoy no queda ninguna con `pg-page`. Se borra junto con el bloque oscuro cuando
se migren las ocho páginas de `/servicios`. Página nueva: sistema claro, no este kit.

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

### No hay landing por producto: el producto se enlaza directo

Hubo una landing por vertical, `/software-para-veterinarias`, hasta el **16-sep-2026**. Se
borró: era una página intermedia que contaba lo mismo que `vet.g360ia.com.ar` cuenta mejor, y
el que busca el software para veterinarias quiere entrar al software, no leer una reseña de
él. Todo lo que la enlazaba —la home, `/software`, `/afiliados`, `SOFTWARES` en `data.jsx`—
apunta ahora a `https://vet.g360ia.com.ar`.

La URL **no se dejó morir en un 404**: está indexada y la escriben los mails del turnero
(`lib/email-textos.js`), así que el Caddyfile la redirige con **301 a `vet.g360ia.com.ar`**.
Esa regla va antes de la genérica de `.html` para que la forma con extensión llegue en un
solo salto. Y salió del `sitemap.xml`: el sitemap declara destinos finales, y listar un 301
es pedirle al buscador que rastree algo que ya sabe que no es la página.

**Vertical nueva: no se le hace landing acá.** Se suma al catálogo de `/software` y se enlaza
a su propio sitio. La única página de este repo que habla de los productos es `/software`.

### Duplicación con el sitio del producto

`vet.g360ia.com.ar` tiene sus propias páginas de funciones y precios y su propio sitemap.
`/software` **no las repite**: cuenta el producto desde el lado de quien lo construye —qué
hace, cómo se ve, qué es igual en todos— y manda allá para el detalle, los precios y el alta.
Su JSON-LD de `SoftwareApplication` declara `@id` y `url` en `vet.g360ia.com.ar` justamente
para que la entidad consolide en el sitio del producto y no se parta en dos dominios. El
mismo `@id` se usa en el `OfferCatalog` de la home (Devaffi ya no nombra el producto, Regla 9): es el identificador
de la entidad, así que si cambia, cambia en los dos.

Tampoco se declaran precios acá: salen de la base del producto por `/api/planes` y cambian
con un UPDATE. Un número escrito a mano se desactualiza solo, y un precio incorrecto en datos
estructurados es peor que ningún precio.

### El programa de afiliados vive en devaffi.com

Hasta el **1-oct-2026** `/afiliados`, `/developers`, `/planes`, `/devaffi`, `/docs/api` y los
legales de Devaffi vivían en este repo. Se mudaron con el dominio propio al repo
**`Devaffi-web`** (devaffi.com), que tiene su `CLAUDE.md` con las reglas de esas páginas —el
mecanismo de la red, el reparto, los planes que se leen de la API, la marca—. Acá **no se
vuelven a crear**: la home, `/software`, el blog y las barras y pies enlazan a
`https://devaffi.com/afiliados` y `https://devaffi.com/developers` con URL absoluta, y las URLs
viejas hacen 301 en el Caddyfile (Regla 9).

Lo que la home y `/software` cuentan del programa (`PUERTAS` en `data.jsx`, la sección de
afiliados de `secciones-home.jsx`) usa las mismas palabras que devaffi.com —catálogo, código
de referido, comisión recurrente— y **ningún producto de partner se nombra hasta que esté
publicado** en el catálogo.

### Comisión de afiliados y reparto del catálogo

**En este repo no se escribe ningún número comercial** del programa — ni porcentajes del
reparto, ni montos, ni cupos, ni precios. Ni en la home, ni en el blog, ni en los legales, ni en
esta guía. Un número escrito a mano envejece solo hasta contradecir al panel, que es el que
liquida.

Dónde está el número de verdad, en orden de autoridad:

1. Lo que cada afiliado o developer **aceptó al registrarse**, guardado en su fila con
   `CONDICIONES_VERSION` (repo `devaffi`, `lib/programa.js`).
2. `planes.md` del repo `devaffi`: las reglas de negocio del programa —la plata, los cupos, los
   niveles, la prospección—, y la base del turnero para la comisión de los productos propios.
   (`brief.md` y la presentación de ese repo son material para inversores: no se copian.)
3. Las copias públicas, que salen de las dos anteriores y nunca al revés.

Lo que sí se puede decir, y no envejece: **que existen dos comisiones** —la de la plataforma,
igual para todo el catálogo, y la del vendedor, que define cada developer producto por
producto—, y **las promesas estructurales** (la comisión está a la vista antes de tomar el
link; la del primer pago de cada cliente queda garantizada un año).

Cuando el reparto o una regla del programa cambian en la fuente, las copias que no se leen
entre sí son:

| Dónde | Qué |
|---|---|
| `data.jsx` (este repo) | ya no guarda ninguno — no volver a agregar la constante |
| `lib/afiliado-textos.js` (turnero) | `COMISION_PCT` |
| migración 090 del turnero | el DEFAULT de `afiliado.comision_pct` |
| repo `devaffi`, `lib/programa.js` | `PCT_AFILIADO` y compañía — y subir `CONDICIONES_VERSION` |
| repo `Devaffi-web` (devaffi.com) | sus páginas y sus términos (la lista está en su `CLAUDE.md`, Regla 6) |
| `/legal/terminos` (este repo) | puntos 7.2, 7.3, 8.1 y 8.3 — y subir la versión del documento |

`/legal/terminos` de este repo y `devaffi.com/legal/terminos` son las copias delicadas —dicen
lo mismo con dos marcas—: ahí el reparto no es un argumento de venta sino una condición
escrita, y no pueden quedar atrasadas respecto de lo que el panel le hizo aceptar a la gente.
Lo mismo con cupos, ritmos y niveles: se describe el mecanismo, no cuántos lugares trae cada
nivel (el 28-sep-2026 el punto 7.3 seguía con una regla que ya se había reemplazado).

### Los legales son tres y viven en `/legal`

`aviso-legal` (titularidad y uso del sitio), `privacidad` (datos) y `terminos` (las
condiciones de las tres patas: servicios, software por suscripción y el programa de
afiliados/developers). Los tres son `noindex, follow` a propósito y por eso no están en el
`sitemap.xml`. Usan su propio `<style>` inline —no el sistema claro ni el viejo— y traen el
pie compartido por `fetch` como el resto del sitio (Regla 4).

`/legal/terminos` es **el resumen público** de las reglas del programa. Lo vinculante es lo
que cada afiliado o developer aceptó al registrarse, que queda guardado en su fila con
`CONDICIONES_VERSION` (repo `devaffi`). Si cambian esas condiciones, cambia también esta
página: si el sitio público dice una cosa y el panel otra, gana el que el usuario leyó
primero en cualquier discusión.

## Regla 7 — El sistema claro y el kit `g-pagina`

Desde el 15-sep-2026 hay **dos sistemas visuales conviviendo** y hay que saber en cuál se
está trabajando antes de tocar nada:

| | Sistema viejo | Sistema claro |
|---|---|---|
| Clase en `<body>` | `svc-page` (+ `pg-page`) | `g-light` (+ `g-pagina` si es estática) |
| Prefijo CSS | `.bw-`, `.pg-`, `.section` | `.g-` |
| Scroll | snap, un segmento por pantalla | vertical normal |
| Alto de sección | `100dvh` obligatorio | el que pida el contenido |
| Fondo | foto fija a pantalla completa | navy sólo en el hero, después alterna |
| Dónde vive | `styles.css`, bloque oscuro | `styles.css`, bloque `SISTEMA CLARO` |

**Las Reglas 1 y 2 (snap y 100dvh) valen sólo para el sistema viejo.** Una página `g-pagina`
no tiene snap, no tiene `100dvh` y no tiene `overflow:hidden` por segmento, así que no hay
nada que pueda quedar cortado.

### Qué páginas están en cuál

Migradas al sistema claro: la home, `/servicios`, `/servicios/consultoria-ia`,
`/servicios/automatizaciones` y `/software`. `/afiliados` y `/developers` salieron del sistema
claro el 30-sep-2026 y del repo el 1-oct-2026: son de Devaffi, en devaffi.com (Regla 9). Sigue en el viejo sólo lo que
queda: las ocho páginas de servicio restantes, el blog y los legales.

La página de rama `/software` usa el hero de la home (`.g-hero` con
foto de fondo y el texto repartido en el ancho) y no `.g-pag-hero`: son la portada de su rama
y no una página de contenido interna. Las de `/servicios/*` sí usan `.g-pag-hero`, que es la
banda navy sin foto.

El día que no quede ninguna en el viejo se borra el bloque oscuro entero y `styles.css` se
achica en vez de crecer.

### El kit de páginas estáticas

Una página nueva del sistema claro lleva `<body class="g-light g-pagina">`, la barra escrita
a mano en el HTML (copiarla de `servicios/consultoria-ia.html`) y
`<script src="/g-pagina.js" defer>` al final. Ese script hace tres cosas y ninguna es
imprescindible: barra sólida al bajar, menú de teléfono, aparición al scrollear y el
`fetch` del pie. Sin él la página se lee entera igual.

Piezas disponibles (buscar `KIT DE PÁGINAS CLARAS` en `styles.css`): `.g-pag-hero`,
`.g-migas`, `.g-pasos`, `.g-comp`, `.g-caja`, `.g-faq`, `.g-geo`, `.g-rel`, `.g-calc`. Más
todo lo que ya usa la home: `.g-sec`, `.g-card`, `.g-lista`, `.g-split`, `.g-cinta`,
`.g-btn`, `.g-vias`, `.g-cifras`, `.g-marco`.

Una captura de producto va siempre dentro de `.g-marco` —la ventana de navegador— y, si
lleva leyenda, envuelta en `<figure class="g-captura">` con la leyenda en `<figcaption>`.
La leyenda va debajo del marco: adentro rompe la ilusión de que eso es el sistema.

La FAQ usa `<details>/<summary>` a propósito: el acordeón lo hace el navegador, no hay
estado que se pueda desincronizar, el buscador del navegador abre el panel que contiene la
coincidencia y es navegable por teclado de fábrica.

**Cuidado con `hidden`:** el navegador lo aplica con `[hidden] { display: none }`, que es un
selector de atributo y pierde contra cualquier clase. Todo componente que fije su propio
`display` necesita repetir la regla (`.g-nav-movil[hidden] { display: none; }`), o el
elemento se dibuja igual aunque lleve el atributo.

### La barra tiene tres copias y el pie dos

Agregar o sacar una entrada de la navegación es tocar **cinco archivos**, y ninguno lee al
otro. Se descubrió agregando `/developers`:

| | Dónde | Qué cubre |
|---|---|---|
| Barra 1 | `ENLACES` en `secciones-home.jsx` | sólo la home (React) |
| Barra 2 | el `<nav class="g-nav">` escrito a mano en cada HTML del sistema claro | `software/index`, `servicios/index`, `servicios/consultoria-ia`, `servicios/automatizaciones` |
| Barra 3 | `SECCIONES` **y** el bloque `svc-nav-right` de `public/navbar-init.js` | las ocho páginas viejas de `/servicios`, el blog y los legales |
| Pie 1 | `sections-bottom.jsx` | sólo la home |
| Pie 2 | `public/partials/footer.html` | todo el resto (Regla 4) |

La barra del sistema claro está escrita a mano en cada página y no se carga por `fetch` a
propósito: así existe en el primer parseo y no hay salto de layout. El precio es esta
duplicación, y hay que pagarlo a conciencia — al agregar una página nueva, copiar la barra de
`software/index.html`, que es la que está al día.

### Los diez servicios y sus seis listas

`SERVICES` en `data.jsx` es la fuente para la home y para el pie de React. Pero hay otras
cinco copias de la lista que **no** la leen y que hay que tocar a mano al agregar o sacar un
servicio:

1. `servicios/index.html` — las tarjetas visibles **y** el `ItemList` del JSON-LD
2. `index.html` — el `OfferCatalog`, el `ItemList` y el bloque `#seo-fallback`
3. `public/sitemap.xml`
4. `public/navbar-init.js` — el desplegable de las páginas que siguen en el tema viejo
5. `public/partials/footer.html` — el pie de todo lo que no es la home
6. `public/blog-data.js` — el modal de servicio relacionado del blog

Que estaban desincronizadas es exactamente cómo se descubrió: `/servicios/seo` existía desde
siempre y no figuraba en `SERVICES` ni en el pie, el `ItemList` de `/servicios` declaraba
siete cuando en pantalla había ocho, y `/servicios/consultoria-ia` y
`/servicios/automatizaciones` estaban enlazadas desde cinco lugares sin que la página
existiera. Al tocar la lista, revisar las seis.

Las URLs van **sin `.html`**. Caddy sirve las extensionless y responde 301 a la forma con
extensión, así que escribirla es un redirect en cada clic.

## Regla 8 — Este repo es sólo la vidriera. El login y los paneles viven aparte

Hasta el 16-sep-2026 este repo alojó por un tiempo una app Next en `plataforma/` (el login
único de `app.devaffi.com`). Se sacó de acá: hoy vive en el repo **`devaffi`**
(renombrado desde `g360ia-panel`), carpeta `app/`, junto al panel de la agencia en `admin/`.
`g360ia-web` es **sólo** Vite + React + HTML estático — sin base de datos, sin login, sin
lógica de negocio. La única excepción es `chat-api/`, un proxy sin estado hacia la API de
Anthropic para el widget de WhatsApp del sitio; no maneja usuarios ni guarda nada.

**Por qué se movió:** el criterio que se fijó fue *repo = carpeta local = nombre*, para dejar
de arrastrar la confusión de nombres que ya había en otro repo (uno que se llamaba
`g360ia-login` por dentro, servía `panel.g360ia.com.ar` por fuera, y corría como
`web_panel360` en Easypanel — tres nombres para la misma cosa). Con `plataforma/` viviendo
dentro de `g360ia-web`, ese mismo problema se hubiera repetido acá.

**Lo que sigue siendo cierto de esa app** (documentado en el repo `devaffi`, no acá): login único
con Google que deriva por rol a `/afiliados` o `/developer`, con `app.` y no `login.` para
que la cookie de sesión no tenga que emitirse para `.g360ia.com.ar` entero — cosa que la
haría viajar también a `vet.g360ia.com.ar`, un producto aparte con su propia sesión.

`devaffi.com/afiliados` y `devaffi.com/developers` (repo `Devaffi-web`, Regla 9) son la
vidriera pública que informa y se indexa. `app/` del repo `devaffi` es la puerta de entrada de quien
ya decidió, y lleva `noindex` — son cosas distintas a propósito, si compitieran por las
mismas búsquedas se partirían la señal.

### Los números del programa no viven en este repo

`PCT_AFILIADO` y compañía viven en `lib/programa.js` del repo `devaffi` y en la base del turnero;
acá no hay ninguna copia, sólo el texto de las páginas.
La fuente de verdad es `planes.md` del repo `devaffi`, y lo que obliga frente a una
persona concreta es la versión que aceptó al registrarse, guardada en su fila con
`CONDICIONES_VERSION`.

La lista completa de copias a sincronizar está en la Regla 6, «Comisión de afiliados y reparto
del catálogo» — junto con el motivo por el que ningún porcentaje ni monto se escribe en este
archivo.

### El lead que manda este sitio depende de una variable en el otro repo

`chat-api/server.mjs` reenvía cada lead del formulario de contacto al panel de la agencia por
`PANEL_LEADS_URL` + `PANEL_LEADS_SECRET` (env vars del servicio `web-g360ia` en Easypanel).
El panel se mudó de `panel.g360ia.com.ar` a `admin.g360ia.com.ar` (ver `admin/` en el repo `devaffi`):
si `PANEL_LEADS_URL` sigue apuntando al dominio viejo, los leads del sitio dejan de guardarse
**sin ningún error visible** — `forwardToPanel()` sólo loguea el fallo, no reintenta ni
avisa. Verificar esa variable después de mudar el admin.

## Regla 9 — Devaffi vive en devaffi.com, no acá

Del 30-sep al 1-oct-2026 el programa de afiliados y developers se presentó como **Devaffi**
(«Plataforma de afiliados para desarrolladores») desde este repo, con marca, hoja y código
propios en `devaffi/` y un prerender (`scripts/prerender-devaffi.mjs`). El **1-oct-2026** se
mudó con su dominio al repo **`Devaffi-web`** (devaffi.com) y se borró de acá: la carpeta
`devaffi/`, los ocho HTML de la raíz, `docs/api.html`, `public/docs.js`, el bloque
`DOCUMENTACIÓN` de `styles.css`, el prerender del `build`, sus entradas en `vite.config.js` y
en el `sitemap.xml`. Las reglas de esas páginas están ahora en el `CLAUDE.md` de ese repo.

Las URLs viejas **no se dejan morir en un 404**: están indexadas y enlazadas desde el panel y
desde mails. El Caddyfile (bloque `0`) las manda con 301 a su par:

| URL vieja (g360ia.com.ar) | Va a |
|---|---|
| `/devaffi` | `https://devaffi.com/` |
| `/afiliados`, `/developers`, `/planes`, `/docs/api` | la misma ruta en devaffi.com |
| `/sobre-devaffi` | `/about` |
| `/terminos-devaffi` | `/legal/terminos` |
| `/privacidad-devaffi` | `/legal/privacidad` |
| `/legales-devaffi` | `/legal` |

Ese bloque va **antes** de las reglas de www y de la genérica de `.html` y no mira el host,
para que `www.…/afiliados.html` llegue en un solo salto. Y ninguna de estas URLs vuelve al
`sitemap.xml`: el sitemap declara destinos finales.

Consecuencias para este repo:

- **No se vuelve a crear acá ninguna página del programa.** Lo que se quiera contar de
  Devaffi va en devaffi.com; acá queda la puerta de la home (`PUERTAS` en `data.jsx`, la
  sección de afiliados de `secciones-home.jsx`) y el bloque de `/software`, que enlazan allá.
- **Los links van con URL absoluta** (`https://devaffi.com/afiliados`), nunca a la ruta
  relativa: una ruta relativa es un 301 en cada clic. Están en las tres barras y los dos pies
  de la Regla 7, en `data.jsx`, en `index.html` (`#seo-fallback`), en `software/index.html`
  (también el `significantLink` del JSON-LD), en el blog (`public/blog-data.js` y los
  artículos) y en los legales.
- **Los legales de `/legal` son de Gestión 360 IA**, no de Devaffi: cubren el uso del sitio,
  los servicios, el software por suscripción y —todavía— el programa (puntos 7 y 8 de los
  términos, sección 5 de la privacidad). devaffi.com tiene los suyos con marca Devaffi. Si el
  programa deja de regirse por los de acá, esos puntos se reemplazan por un envío a
  `devaffi.com/legal`, subiendo la versión.
- **Devaffi no nombra a G360iA en el cuerpo de sus páginas** (sólo en su pie y en la
  titularidad de sus legales). Desde acá sí se lo puede presentar como producto de la empresa.

## Stack

- Vite 5 + React 18 (index.html es SPA React)
- Páginas de servicios: HTML estático con islands React montados via `<script type="module">`
- CSS: `styles.css` global con variables CSS (tema dark glassmorphism, navy + gold)
- Tailwind: solo utilitarios, `preflight: false`, escanea `*.jsx` y `components/**/*.jsx`
- Deploy: Easypanel con nixpacks.toml, Node 18

## Regla 10 — Sin Devaffi: el sitio es de la consultora

El 1-oct-2026 se sacó de la home, las barras, los pies, `/software`, `/servicios`, el blog y el
prompt del chat todo lo que apuntaba a Devaffi (programa de afiliados y developers). La home
pasó de «router de tres puertas» a: hero → cifras → servicios → software propio → contacto.

- **No volver a enlazar `devaffi.com`** ni agregar entradas de afiliados/developers a las
  barras (`ENLACES`, los `<nav class="g-nav">`, `navbar-init.js`), a los pies
  (`sections-bottom.jsx`, `partials/footer.html`) ni a `blog-data.js`.
- Se borraron ocho notas del blog (las seis de Devaffi, `programa-afiliados-…` y
  `vender-software-sin-ser-programador`) con sus imágenes y sus entradas del sitemap. Sus URLs
  hacen 301 a `/blog` en el Caddyfile (`@blog_retiradas`). Las 301 de las URLs viejas del
  programa a devaffi.com (bloque 0) se dejaron: son entrada, no contenido.
- Pendiente de decidir (no se tocó): `/legal/terminos` (puntos 7 y 8) y `/legal/privacidad`
  (sección 5) todavía describen el programa; y `public/portfolio_pablo_montenegro.html`
  lista Devaffi como proyecto personal.
