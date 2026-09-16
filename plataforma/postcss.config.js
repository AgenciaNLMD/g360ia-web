/* El PostCSS de esta app.
   ==========================================================================
   Existe para CORTAR la búsqueda hacia arriba. Sin este archivo, PostCSS sube
   por el árbol de carpetas y encuentra el `postcss.config.js` de g360ia-web,
   que está armado para Tailwind — y Tailwind no está instalado acá, así que el
   build muere con «must export a plugins key».

   Es el precio de tener las dos cosas en el mismo repo, y se paga una vez.
   Cualquier app que se sume al lado (panel-developers) necesita el suyo. */
module.exports = {
  plugins: {
    autoprefixer: {},
  },
};
