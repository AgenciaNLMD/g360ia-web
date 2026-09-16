/* El pool de Postgres.
   ==========================================================================
   Un solo pool por proceso. En desarrollo Next recarga los módulos en cada
   cambio, y sin el guardado en `globalThis` cada recarga abriría un pool nuevo
   hasta agotar las conexiones del servidor. Es el mismo patrón que usa el
   turnero, por el mismo motivo. */
import pg from "pg";

/* Los BIGINT vuelven como string por defecto (no entran en un Number de JS sin
   perder precisión). Los ids de esta base no van a pasar de 2^53 en esta
   década, y devolverlos como número evita comparaciones silenciosamente falsas
   del tipo `1 === "1"`. */
pg.types.setTypeParser(20, (v) => (v === null ? null : Number(v)));

function crearPool() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "Falta DATABASE_URL. Copiá .env.example a .env y apuntalo a la base del catálogo."
    );
  }
  return new pg.Pool({
    connectionString: url,
    max: 8,
    idleTimeoutMillis: 30_000,
    /* Easypanel sirve Postgres dentro de la red del proyecto, sin TLS. Si
       algún día la base queda afuera, esto pasa a leerse de una variable. */
    ssl: url.includes("sslmode=require") ? { rejectUnauthorized: false } : false,
  });
}

const global_ = globalThis;
export const pool = global_.__catalogoPool ?? (global_.__catalogoPool = crearPool());

export function consultar(sql, params) {
  return pool.query(sql, params);
}

/** Devuelve la primera fila, o null. Evita el `rows[0]` repetido en cada ruta. */
export async function unaFila(sql, params) {
  const { rows } = await pool.query(sql, params);
  return rows[0] ?? null;
}
