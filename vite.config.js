import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { readdirSync } from 'fs'

const root = dirname(fileURLToPath(import.meta.url))

/* Páginas estáticas de servicios: cada .html entra al build y sale en dist/servicios/ */
const servicios = Object.fromEntries(
  readdirSync(resolve(root, 'servicios'))
    .filter((f) => f.endsWith('.html'))
    .map((f) => ['servicios/' + f.replace('.html', ''), resolve(root, 'servicios', f)])
)

/* Blog: cada .html entra al build y sale en dist/blog/ */
const blog = Object.fromEntries(
  readdirSync(resolve(root, 'blog'))
    .filter((f) => f.endsWith('.html'))
    .map((f) => ['blog/' + f.replace('.html', ''), resolve(root, 'blog', f)])
)

/* Software: el catálogo y, más adelante, una landing por producto */
const software = Object.fromEntries(
  readdirSync(resolve(root, 'software'))
    .filter((f) => f.endsWith('.html'))
    .map((f) => ['software/' + f.replace('.html', ''), resolve(root, 'software', f)])
)

/* Legales: cada .html entra al build y sale en dist/legal/ */
const legal = Object.fromEntries(
  readdirSync(resolve(root, 'legal'))
    .filter((f) => f.endsWith('.html'))
    .map((f) => ['legal/' + f.replace('.html', ''), resolve(root, 'legal', f)])
)

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(root, 'index.html'),

        /* Páginas sueltas de la raíz.

           `/software-para-veterinarias` vivía acá y se borró el 16-sep-2026: el
           que busca el software para veterinarias quiere entrar al software, no
           leer una landing intermedia. La URL sigue existiendo como 301 a
           vet.g360ia.com.ar en el Caddyfile —está indexada y la escriben los
           mails del turnero (lib/email-textos.js)— y el contenido del producto
           lo cuenta ahora `/software`. */
        afiliados: resolve(root, 'afiliados.html'),
        developers: resolve(root, 'developers.html'),

        ...servicios,
        ...software,
        ...blog,
        ...legal,
      },
    },
  },
})
