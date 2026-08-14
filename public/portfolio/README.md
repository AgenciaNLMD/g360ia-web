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
    { type:'video', src:'/portfolio/erp-demo.mp4', poster:'/portfolio/erp-1.webp' }
  ]
}
```

- Si omitís `thumb`, se usa la primera imagen de `media` (o el `poster` del primer video).
- Si `media` está vacío, la card muestra un placeholder y el modal avisa "todavía no hay media".
- El `poster` del video es la imagen que se ve antes de darle play (recomendado).

## Formatos recomendados

- **Imágenes:** `.webp` (livianas). Proporción ideal 16:9. Ancho ~1200px alcanza.
- **Videos:** `.mp4` (códec H.264) o `.webm`. Cortos y comprimidos (unos pocos MB).
  Para capturas de pantalla en video, 1280×720 o 1920×1080 va perfecto.

## Convención de nombres sugerida

`<proyecto>-<n>.<ext>` — ej: `erp-1.webp`, `municipal-2.webp`, `bots-demo.mp4`.
Usá minúsculas y guiones, sin espacios ni acentos.
