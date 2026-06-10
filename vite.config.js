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

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(root, 'index.html'),
        ...servicios,
      },
    },
  },
})
