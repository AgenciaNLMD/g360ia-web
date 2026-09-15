import React from 'react';
import { Nav, Hero, Cifras, Puertas, Servicios, Software, Afiliados, useRevelar } from './secciones-home.jsx';
import { Footer } from './sections-bottom.jsx';
import MaiaContact from './components/MaiaContact.jsx';
import { useTweaks } from './use-tweaks.js';

/* Panel de tweaks: solo en dev — en producción el chunk no se descarga */
const DevTweaks = import.meta.env.DEV
  ? React.lazy(() => import('./dev-tweaks.jsx'))
  : null;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "primary": "#e6a532",
  "accent": "#f0c46e",
  "heroBg": "fade",
  "cardStyle": "soft",
  "density": "comfy",
  "reveal": true
}/*EDITMODE-END*/;

/* ─────────────────────────────────────────────────────────────────────────────
   APP
   ─────────────────────────────────────────────────────────────────────────────
   La home es una página vertical común. Hasta el 16-sep-2026 era un canvas 2D
   movido por GSAP: cada sección ocupaba exactamente 100vw × 100vh y el scroll
   movía la cámara de una celda a la otra. Se fue por tres motivos, en orden de
   peso:

   1. Obligaba a que todo entrara en una pantalla. Ese es el motivo por el que
      las descripciones de las tarjetas habían terminado en 10,5px en móvil: no
      era una decisión tipográfica, era lo que hacía falta para que no se
      cortaran. Un sitio que pelea contra su propio contenido.
   2. Bloqueaba el scroll del body y reemplazaba el gesto natural del navegador
      por uno propio, con su acumulador de rueda, su cooldown y su manejo de
      touch. Eso es superficie de bugs a cambio de nada que el usuario pidiera.
   3. GSAP entero en el bundle para mover una sola cosa.

   Lo que queda es: una barra, ocho secciones apiladas, y un IntersectionObserver
   que las revela al entrar. El scroll lo hace el navegador.
───────────────────────────────────────────────────────────────────────────── */
function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  /* Un solo observador para los `.g-rev` de toda la página. */
  useRevelar();

  return (
    <React.Fragment>
      <Nav />

      <main>
        <Hero />
        <Cifras />
        <Puertas />
        <Servicios />
        <Software />
        <Afiliados />
        <MaiaContact />
      </main>

      <Footer />

      {DevTweaks && (
        <React.Suspense fallback={null}>
          <DevTweaks tweaks={tweaks} setTweak={setTweak} />
        </React.Suspense>
      )}
    </React.Fragment>
  );
}

export default App;
