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
| Afiliados | `/afiliados` | reventa por comisión | informa acá; se entra en `app.g360ia.com.ar` (Regla 8) |
| Developers | `/developers` | publicar tu software en el catálogo | informa acá; se entra en `app.g360ia.com.ar` (Regla 8) |

`/afiliados` y `/developers` son **la misma máquina vista desde los dos lados**: una le habla
al que sale a vender, la otra al que construyó el producto. Comparten vocabulario a propósito
—catálogo, código de referido, comisión recurrente— y se enlazan entre sí en el cuerpo y en el
cierre. Si cambia el mecanismo, cambian las dos o el sitio se contradice.

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
mismo `@id` se usa en `afiliados.html` y en el `OfferCatalog` de la home: es el identificador
de la entidad, así que si cambia, cambia en los tres.

Tampoco se declaran precios acá: salen de la base del producto por `/api/planes` y cambian
con un UPDATE. Un número escrito a mano se desactualiza solo, y un precio incorrecto en datos
estructurados es peor que ningún precio.

### El programa de afiliados es una red, no un canal de un producto

Desde el **16-sep-2026** `/afiliados` no vende «nuestro software»: vende **el negocio de
vender software**. El orden de la página es el del flujo real —catálogo → cuenta → código de
referido → cobro— y el catálogo subió al tercer segmento porque es lo primero que quiere ver
alguien que evalúa entrar a una red de venta.

El catálogo tiene tres fichas y **sólo la primera nombra un producto**: Vet 360iA, que es lo
único contratable hoy. Las otras dos son la pata de partners (software de otras empresas, que
entra con su nombre, su comisión y sus condiciones) y las verticales propias en construcción.
**Ningún producto de partner se nombra hasta que esté publicado** — un catálogo con productos
que no se pueden vender es una promesa que el afiliado descubre rota el día que se registra, y
es lo que los buscadores tratan como contenido engañoso.

La página dice «código de referido», no «link». La home (`PUERTAS` en `data.jsx` y la sección
de afiliados de `secciones-home.jsx`) usa las mismas palabras: si el sitio dice «link» en un
lado y «código» en otro, parecen dos cosas distintas.

### Los paneles: una sola puerta

Desde el **17-sep-2026** los CTA de las dos páginas apuntan al mismo lugar:

| Página | CTA va a | Qué es |
|---|---|---|
| `/afiliados` | `app.g360ia.com.ar` | puerta única: se entra con Google y el servidor manda al panel del rol |
| `/developers` | `app.g360ia.com.ar` | la misma puerta; el developer cae en el suyo |

No son dos paneles en dos subdominios sino uno solo con tres caras —afiliado, developer y el
admin de la agencia—, y el rol lo resuelve el servidor después del login. Por eso los CTA no
llevan a `/afiliados` ni a `/developer`: quien todavía no entró no tiene rol que mostrar.

Antes apuntaban a `afiliados.g360ia.com.ar` y `developers.g360ia.com.ar` (16-sep-2026), dos
subdominios que resolvían en DNS pero no servían nada: los CTA estuvieron muertos hasta que el
panel se levantó. Y antes de eso `/afiliados` mandaba a `vet.g360ia.com.ar/afiliados`, que era
el panel del producto veterinario y no del programa —el afiliado vende **todo el catálogo**, no
un producto—. El panel vive en el repo `g360ia-PRM`.

El alta es **self-service en las dos puntas**: no hay entrevista, ni aprobación de cuenta, ni
comisión que negociar. Al registrarse se aceptan las condiciones. Lo único que se revisa es el
producto del developer: que su sistema esté conectado a la API (documentada en `/docs/api`,
repo `g360ia-PRM`, `app/api/v1`) y que cumpla los seis requisitos.

### Comisión de afiliados y reparto del catálogo

**En esta guía no se escribe ningún número comercial** — ni porcentajes, ni montos, ni cuotas,
ni precios. Vale para el reparto igual que para los precios de los productos (ver «Duplicación
con el sitio del producto», más arriba): un número escrito a mano en un archivo que nadie
vuelve a mirar envejece solo y termina contradiciendo a la base. Y un porcentaje copiado en un
doc interno no obliga a nadie ni respalda nada: la discusión se gana con lo que guarda el
panel, no con lo que dice este `.md`.

Dónde está el número de verdad, en orden de autoridad:

1. Lo que cada afiliado o developer **aceptó al registrarse**, guardado en su fila con
   `CONDICIONES_VERSION` en `g360ia-PRM`. Es lo único que respalda una liquidación discutida.
2. El brief de `g360ia-catalogo` (`README.md`, bloque «Reparto y monetización»), que es la
   fuente de verdad del split, y la base del turnero para la comisión de los productos propios.
3. Las copias que el sitio muestra, que salen de las dos anteriores y nunca al revés.

Cuando el reparto o la comisión cambian en la fuente, hay que tocar **todas estas copias**,
que no se leen entre sí:

**Desde septiembre de 2026 el reparto dejó de ser un número solo**, y eso cambia qué hay que
sincronizar. Lo que es fijo e igual para todo el catálogo es **lo que se queda la plataforma**:
es el costo de cobrar, no una participación en el negocio del developer. **La comisión del
vendedor la define cada developer, producto por producto**, con un techo, y se publica en la
ficha del catálogo.

Por eso **en el sitio no va ningún porcentaje del reparto. Ninguno, ni el nuestro.** Ni en un
titular, ni en una FAQ, ni como constante. Los dos pueden cambiar, y un número escrito en una
página de venta envejece solo hasta que contradice al panel, que es el que liquida.

Lo que el sitio sí dice, y no envejece: **que las dos comisiones existen** —la de la plataforma,
que es el costo de cobrar y es igual para todo el catálogo, y la del vendedor, que la define cada
developer—, **dónde está el número de verdad** —las condiciones que cada uno acepta al
registrarse, y el panel— y **las promesas estructurales**: que la comisión está a la vista antes
de tomar el link, y que la del primer pago de cada cliente queda garantizada un año.

Si alguna vez hace falta un número en una cinta o en una cifra del hero, que sea uno que no sea
un porcentaje del reparto: el **0** de costo fijo para publicar, o los **12** meses de garantía.

| Dónde | Qué |
|---|---|
| `data.jsx` (este repo) | ya no guarda ninguno — no volver a agregar la constante |
| `lib/afiliado-textos.js` (turnero) | `COMISION_PCT` |
| migración 090 del turnero | el DEFAULT de `afiliado.comision_pct` |
| `g360ia-PRM/app/lib/programa.js` | `PCT_AFILIADO` y compañía — y subir `CONDICIONES_VERSION` |
| `/afiliados` | cinta, paso 04 y FAQ. La calculadora ya **no** tiene constante: la comisión es un control más |
| `/developers` | cinta del hero, requisito 06, la comparativa y la FAQ (las dos copias: JSON-LD y visible) |
| `/legal/terminos` | puntos 7.2, 7.3, 8.1 y 8.3 — y subir la versión del documento |
| `/developers` | cinta, requisito 06, FAQ y el `HowTo` |
| `/legal/terminos` | puntos 7.2 y 8.1 |

`/legal/terminos` es la copia delicada: ahí el reparto no es un argumento de venta sino una
condición escrita, así que es la que no puede quedar atrasada respecto de lo que el panel le
hizo aceptar a la gente.

Lo que sí es criterio y por eso se escribe acá: desde el **16-sep-2026 el reparto es fijo para
todo el catálogo**, propio y de partners, y **no se negocia por producto**. La razón está en
las dos páginas: si cada producto paga distinto, el afiliado elige el que más le paga a él en
vez del que le sirve al cliente, y el catálogo se vuelve un ranking de comisiones. La parte del
afiliado tampoco se tocó al fusionar los dos programas, justamente para no obligar a
renegociar nada.

### Los legales son tres y viven en `/legal`

`aviso-legal` (titularidad y uso del sitio), `privacidad` (datos) y `terminos` (las
condiciones de las tres patas: servicios, software por suscripción y el programa de
afiliados/developers). Los tres son `noindex, follow` a propósito y por eso no están en el
`sitemap.xml`. Usan su propio `<style>` inline —no el sistema claro ni el viejo— y traen el
pie compartido por `fetch` como el resto del sitio (Regla 4).

`/legal/terminos` es **el resumen público** de las reglas del programa. Lo vinculante es lo
que cada afiliado o developer aceptó al registrarse, que queda guardado en su fila con
`CONDICIONES_VERSION` en `g360ia-PRM`. Si cambian esas condiciones, cambia también esta
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
`/servicios/automatizaciones`, `/afiliados` y `/software`. Sigue en el viejo sólo lo que
queda: las ocho páginas de servicio restantes, el blog y los legales.

Las dos páginas de rama —`/afiliados` y `/software`— usan el hero de la home (`.g-hero` con
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
| Barra 2 | el `<nav class="g-nav">` escrito a mano en cada HTML del sistema claro | `afiliados`, `developers`, `software/index`, `servicios/index`, `servicios/consultoria-ia`, `servicios/automatizaciones` |
| Barra 3 | `SECCIONES` **y** el bloque `svc-nav-right` de `public/navbar-init.js` | las ocho páginas viejas de `/servicios`, el blog y los legales |
| Pie 1 | `sections-bottom.jsx` | sólo la home |
| Pie 2 | `public/partials/footer.html` | todo el resto (Regla 4) |

La barra del sistema claro está escrita a mano en cada página y no se carga por `fetch` a
propósito: así existe en el primer parseo y no hay salto de layout. El precio es esta
duplicación, y hay que pagarlo a conciencia — al agregar una página nueva, copiar la barra de
`afiliados.html`, que es la que está al día.

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
único de `app.g360ia.com.ar`). Se sacó de acá: hoy vive en el repo **`g360ia-PRM`**
(renombrado desde `g360ia-panel`), carpeta `app/`, junto al panel de la agencia en `admin/`.
`g360ia-web` es **sólo** Vite + React + HTML estático — sin base de datos, sin login, sin
lógica de negocio. La única excepción es `chat-api/`, un proxy sin estado hacia la API de
Anthropic para el widget de WhatsApp del sitio; no maneja usuarios ni guarda nada.

**Por qué se movió:** el criterio que se fijó fue *repo = carpeta local = nombre*, para dejar
de arrastrar la confusión de nombres que ya había en otro repo (uno que se llamaba
`g360ia-login` por dentro, servía `panel.g360ia.com.ar` por fuera, y corría como
`web_panel360` en Easypanel — tres nombres para la misma cosa). Con `plataforma/` viviendo
dentro de `g360ia-web`, ese mismo problema se hubiera repetido acá.

**Lo que sigue siendo cierto de esa app** (documentado en `g360ia-PRM`, no acá): login único
con Google que deriva por rol a `/afiliados` o `/developer`, con `app.` y no `login.` para
que la cookie de sesión no tenga que emitirse para `.g360ia.com.ar` entero — cosa que la
haría viajar también a `vet.g360ia.com.ar`, un producto aparte con su propia sesión.

`/afiliados` y `/developers` (las páginas de este repo, la Regla 6) siguen siendo la
vidriera pública que informa y se indexa. `g360ia-PRM/app` es la puerta de entrada de quien
ya decidió, y lleva `noindex` — son cosas distintas a propósito, si compitieran por las
mismas búsquedas se partirían la señal.

### Los números del programa no viven en este repo

`PCT_AFILIADO` y compañía viven en `g360ia-PRM/app/lib/programa.js` y en la base del turnero;
acá sólo hay una copia para mostrar (`COMISION_PCT` en `data.jsx`) y el texto de las páginas.
La fuente de verdad es el brief (`g360ia-PRM/app/README.md`), y lo que obliga frente a una
persona concreta es la versión que aceptó al registrarse, guardada en su fila con
`CONDICIONES_VERSION`.

La lista completa de copias a sincronizar está en la Regla 6, «Comisión de afiliados y reparto
del catálogo» — junto con el motivo por el que ningún porcentaje ni monto se escribe en este
archivo.

### El lead que manda este sitio depende de una variable en el otro repo

`chat-api/server.mjs` reenvía cada lead del formulario de contacto al panel de la agencia por
`PANEL_LEADS_URL` + `PANEL_LEADS_SECRET` (env vars del servicio `web-g360ia` en Easypanel).
El panel se mudó de `panel.g360ia.com.ar` a `admin.g360ia.com.ar` (ver `g360ia-PRM/admin`):
si `PANEL_LEADS_URL` sigue apuntando al dominio viejo, los leads del sitio dejan de guardarse
**sin ningún error visible** — `forwardToPanel()` sólo loguea el fallo, no reintenta ni
avisa. Verificar esa variable después de mudar el admin.

## Stack

- Vite 5 + React 18 (index.html es SPA React)
- Páginas de servicios: HTML estático con islands React montados via `<script type="module">`
- CSS: `styles.css` global con variables CSS (tema dark glassmorphism, navy + gold)
- Tailwind: solo utilitarios, `preflight: false`, escanea `*.jsx` y `components/**/*.jsx`
- Deploy: Easypanel con nixpacks.toml, Node 18
