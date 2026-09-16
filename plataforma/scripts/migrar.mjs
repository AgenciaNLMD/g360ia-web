/* Corre las migraciones de db/migrations en orden y anota cuáles ya pasaron.
   Mismo patrón que el turnero: archivos SQL numerados, sin ORM. */
import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import pg from "pg";

const raiz = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(raiz, "..", "db", "migrations");

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("Falta DATABASE_URL.");
  process.exit(1);
}

const pool = new pg.Pool({ connectionString: url });

await pool.query(`
  CREATE TABLE IF NOT EXISTS migracion (
    archivo TEXT PRIMARY KEY,
    pasada_en TIMESTAMPTZ NOT NULL DEFAULT now()
  )
`);

const { rows } = await pool.query(`SELECT archivo FROM migracion`);
const hechas = new Set(rows.map((r) => r.archivo));
const archivos = (await readdir(dir)).filter((f) => f.endsWith(".sql")).sort();

let nuevas = 0;
for (const archivo of archivos) {
  if (hechas.has(archivo)) continue;
  const sql = await readFile(path.join(dir, archivo), "utf8");
  const cliente = await pool.connect();
  try {
    /* Cada migración en su transacción: si falla a la mitad, no queda medio
       aplicada ni anotada como hecha. */
    await cliente.query("BEGIN");
    await cliente.query(sql);
    await cliente.query(`INSERT INTO migracion (archivo) VALUES ($1)`, [archivo]);
    await cliente.query("COMMIT");
    console.log("✓", archivo);
    nuevas++;
  } catch (e) {
    await cliente.query("ROLLBACK");
    console.error("✗", archivo, "—", e.message);
    process.exit(1);
  } finally {
    cliente.release();
  }
}

console.log(nuevas ? `${nuevas} migración(es) aplicada(s).` : "Sin migraciones pendientes.");
await pool.end();
