/* useTweaks — fuente única de los valores de tweak.
 *
 * Vive acá y no en `tweaks-panel.jsx` a propósito: `app.jsx` necesita el hook
 * en producción, y hasta que se separó importarlo arrastraba al bundle el
 * módulo entero del panel (26 KB de JSX con estilos inline y componentes de UI
 * que sólo existen en dev). El panel sigue importando este archivo, así que
 * no hay dos copias del hook.
 *
 * setTweak persiste vía el host (__edit_mode_set_keys → el host reescribe el
 * bloque EDITMODE en disco).
 */
import { useState, useCallback } from 'react';

export function useTweaks(defaults) {
  const [values, setValues] = useState(defaults);
  /* Acepta setTweak('clave', valor) o setTweak({ clave: valor, ... }) para que
     una llamada al estilo useState no escriba una clave "[object Object]" en
     el JSON persistido. */
  const setTweak = useCallback((keyOrEdits, val) => {
    const edits = typeof keyOrEdits === 'object' && keyOrEdits !== null
      ? keyOrEdits : { [keyOrEdits]: val };
    setValues((prev) => ({ ...prev, ...edits }));
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits }, '*');
    /* Señal en la misma ventana para los listeners in-page: el mensaje al
       parent llega al host, no a los pares. */
    window.dispatchEvent(new CustomEvent('tweakchange', { detail: edits }));
  }, []);
  return [values, setTweak];
}
