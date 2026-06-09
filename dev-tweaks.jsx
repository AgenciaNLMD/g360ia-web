import React from 'react';
import { TweaksPanel, TweakSection, TweakRadio, TweakColor, TweakToggle } from './tweaks-panel.jsx';

/* Panel de tweaks de diseño — solo se carga en desarrollo (ver app.jsx).
   En producción este chunk nunca se descarga. */
export default function DevTweaks({ tweaks, setTweak }) {
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Color">
        <TweakColor
          label="Primario"
          value={tweaks.primary}
          onChange={(v) => setTweak("primary", v)}
          options={["#5d7fa3", "#34547a", "#7e9ab8", "#1a2c44"]}
        />
        <TweakColor
          label="Acento"
          value={tweaks.accent}
          onChange={(v) => setTweak("accent", v)}
          options={["#e5b547", "#f0c870", "#5d7fa3", "#a4b8cf"]}
        />
      </TweakSection>

      <TweakSection label="Hero">
        <TweakRadio
          label="Fondo"
          value={tweaks.heroBg}
          onChange={(v) => setTweak("heroBg", v)}
          options={[
            { value: "fade",  label: "Degradé" },
            { value: "light", label: "Claro"   },
            { value: "navy",  label: "Oscuro"  },
          ]}
        />
      </TweakSection>

      <TweakSection label="Estilo">
        <TweakRadio
          label="Cards"
          value={tweaks.cardStyle}
          onChange={(v) => setTweak("cardStyle", v)}
          options={[
            { value: "soft",     label: "Suaves"  },
            { value: "flat",     label: "Planas"  },
            { value: "bordered", label: "Bordes"  },
          ]}
        />
        <TweakRadio
          label="Densidad"
          value={tweaks.density}
          onChange={(v) => setTweak("density", v)}
          options={[
            { value: "compact", label: "Densa"  },
            { value: "comfy",   label: "Cómoda" },
            { value: "airy",    label: "Amplia" },
          ]}
        />
        <TweakToggle
          label="Animaciones al hacer scroll"
          value={tweaks.reveal}
          onChange={(v) => setTweak("reveal", v)}
        />
      </TweakSection>
    </TweaksPanel>
  );
}
