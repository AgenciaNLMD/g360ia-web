# Media del portfolio (`/portfolio/…`)

Acá van las **imágenes y videos** de los proyectos que se muestran en
`public/portfolio_pablo_montenegro.html` (miniatura de la card + carrusel del modal).

## Cómo subir media

1. Dejá el archivo en esta carpeta, por ejemplo:
   - `public/portfolio/erp-1.webp`
   - `public/portfolio/erp-demo.mp4`
2. Referencialo en el array `projects` del HTML por su ruta pública `/portfolio/<archivo>`.

Vite copia todo `public/` al build, así que en producción el archivo queda servido
desde la raíz del dominio (`https://g360ia.com.ar/portfolio/erp-1.webp`).

## Estructura en los datos

Cada proyecto tiene dos campos:

```js
{
  // …resto del proyecto…
  thumb: "/portfolio/erp-1.webp",   // miniatura de la card (opcional)
  media: [                          // alimenta el carrusel del modal
    { type:'image', src:'/portfolio/erp-1.webp', alt:'Dashboard del ERP' },
    { type:'image', src:'/portfolio/erp-2.webp', alt:'Módulo de ventas' },
    { type:'video', src:'/portfolio/erp-demo.mp4', poster:'/portfolio/erp-1.webp' },
    { type:'youtube', id:'dQw4w9WgXcQ', alt:'Walkthrough completo' }
  ]
}
```

- Si omitís `thumb`, se usa la primera imagen de `media` (o el `poster` del primer video,
  o la miniatura de YouTube si el primer item es `youtube`).
- Si `media` está vacío, la card muestra un placeholder y el modal avisa "todavía no hay media".
- El `poster` del video es la imagen que se ve antes de darle play (recomendado).

### Tipos de media

- **`image`** — `{ type:'image', src, alt }`
- **`video`** (archivo local en `/portfolio/…`) — `{ type:'video', src|sources, poster?, loop?, autoplay?, controls? }`.
  Para videos **cortos** que quedan bien en loop mudo (ej. el demo de login).
- **`youtube`** — `{ type:'youtube', id, alt }`. Ideal para **videos largos** (walkthroughs de
  varios minutos): YouTube hostea el archivo (no pesa en el repo) y sirve calidad adaptativa.
  El `id` es el código del video (`https://youtu.be/<ID>` o `watch?v=<ID>`). La miniatura de la
  card la toma de YouTube automáticamente; el modal embebe el reproductor (modo `nocookie`).
  Podés subir el video como **"no listado"** en YouTube si no querés que aparezca en tu canal.

## Formatos recomendados

- **Imágenes:** `.webp` (livianas). Proporción ideal 16:9. Ancho ~1200px alcanza.
- **Videos:** `.mp4` (códec H.264) o `.webm`. Cortos y comprimidos (unos pocos MB).
  Para capturas de pantalla en video, 1280×720 o 1920×1080 va perfecto.

## Convención de nombres sugerida

`<proyecto>-<n>.<ext>` — ej: `erp-1.webp`, `municipal-2.webp`, `bots-demo.mp4`.
Usá minúsculas y guiones, sin espacios ni acentos.
