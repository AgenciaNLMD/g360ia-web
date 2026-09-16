/* El alias del afiliado y el código de referido que sale de él.
   ==========================================================================
   Esta es la única definición. El formulario la importa para dibujar la vista
   previa del link mientras la persona escribe, y la ruta de registro la importa
   para validar antes de insertar. Escribir en el formulario una versión
   aproximada —un `replace` de espacios, por ejemplo— es la forma de prometer un
   link que el servidor después rechaza, o peor, de guardar otro distinto del
   que la persona vio.

   El CHECK de la migración 001 dice exactamente lo mismo en SQL. Si cambia una
   regla acá, cambia la migración. */

export const ALIAS_LARGO_MIN = 2;
export const ALIAS_LARGO_MAX = 24;

/** Minúsculas, sin acentos, sin espacios. Guiones sí, pero no al principio. */
export function normalizarAlias(valor) {
  if (typeof valor !== "string") return "";
  return valor
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // saca los acentos, deja la letra
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-") // todo lo demás es separador
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, ALIAS_LARGO_MAX);
}

export function aliasValido(valor) {
  const limpio = normalizarAlias(valor);
  return limpio.length >= ALIAS_LARGO_MIN && /^[a-z0-9]/.test(limpio);
}

/** El link que el afiliado reparte. El redirect propio registra el click y
    recién ahí manda al sitio del producto (decisión 6 del brief). */
export function linkDeReferido(origen, alias) {
  const limpio = normalizarAlias(alias);
  if (!limpio) return "";
  return `${origen.replace(/\/+$/, "")}/r/${limpio}`;
}
