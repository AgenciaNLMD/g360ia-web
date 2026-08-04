# chat-api — proxy seguro del chatbot del portfolio

Backend mínimo (Node, sin dependencias) que responde las preguntas libres del widget de
WhatsApp del portfolio usando la API de Anthropic. **La API key vive SOLO acá, como variable
de entorno del servidor — nunca en el HTML ni en el repo.**

## Cómo encaja

```
Navegador → g360ia.com.ar/api/chat → Caddy → Node 127.0.0.1:8787 (tiene la key) → Anthropic
```

- El widget (`public/portfolio_pablo_montenegro.html`) hace `fetch('/api/chat')` **solo** cuando
  el visitante escribe una pregunta libre. Los números del menú se responden fijos (0 tokens).
- Caddy reenvía `/api/*` a este servicio (ver `Caddyfile`).
- El servicio escucha únicamente en `127.0.0.1:8787`: no queda expuesto a internet, solo Caddy lo alcanza.
- Se arranca junto con Caddy desde `nixpacks.toml`.

## Variables de entorno (setear en Easypanel → servicio web-g360ia → Environment)

| Variable | Obligatoria | Default | Descripción |
|---|---|---|---|
| `ANTHROPIC_API_KEY` | **Sí** | — | La API key de Anthropic. Sin esto, el chat cae al fallback de WhatsApp. |
| `CHAT_RATE_MAX` | No | `10` | Preguntas por persona (IP) **por día**. Se renueva cada día. Al superarlo, deriva a WhatsApp. |
| `CHAT_MAX_DAILY` | No | `600` | Techo **global** de llamadas a la IA por día (freno de gasto). Al superarlo, fallback. |
| `CHAT_WHATSAPP` | No | `541130720676` | Número de WhatsApp de Pablo (destino del aviso de formulario). |
| `WA_NOTIFY_URL` | No | — | Endpoint para avisar a Pablo al recibir un formulario. Ej. Evolution API: `https://tu-evolution/message/sendText/tuInstancia`. Sin esto, el lead solo se registra en el log. |
| `WA_NOTIFY_KEY` | No | — | `apikey` de Evolution (se manda como header). |
| `WA_NOTIFY_TO` | No | `CHAT_WHATSAPP` | Número que recibe el aviso (el de Pablo). |
| `CONTACT_RATE_MAX` | No | `5` | Envíos de formulario por IP por día. |
| `PANEL_LEADS_URL` | No (recomendado) | — | Endpoint del panel donde se **guarda** el lead. Ej: `https://panel.g360ia.com.ar/api/leads`. Sin esto, el lead no queda persistido (solo log + WhatsApp). |
| `PANEL_LEADS_SECRET` | Con `PANEL_LEADS_URL` | — | Secreto compartido con el panel (debe coincidir con `LEADS_INGEST_SECRET` allá). Se manda como header `x-ingest-secret`. |

**Formulario → panel + aviso por WhatsApp:** `POST /api/contact` valida el formulario y luego, en segundo plano: (1) **guarda el lead en el panel** (`PANEL_LEADS_URL`, header `x-ingest-secret`) para que aparezca en el módulo **Trabajo** de `panel.g360ia.com.ar`; (2) le manda a Pablo un WhatsApp con los datos vía `WA_NOTIFY_URL` (formato Evolution v2: `{ number, text }` + header `apikey`). El visitante recibe el "gracias" al instante.

> **Del lado del panel** (`g360ia-panel`) hay que definir `LEADS_INGEST_SECRET` (mismo valor que `PANEL_LEADS_SECRET`) y correr `prisma db push` para crear la tabla `pnl_leads`.

Por defecto: **10 preguntas por persona por día**; al día siguiente se renueva.

> Después de agregar/cambiar `ANTHROPIC_API_KEY`, **redeployá** el servicio en Easypanel.

## Seguridad incluida

- Key solo en env var del servidor; nunca se loguea ni se devuelve.
- Escucha solo en `127.0.0.1` (no expuesto directo).
- Allowlist de Origin/Referer (solo `g360ia.com.ar` / `www`).
- Límite de tamaño de body (2 KB) y de largo del mensaje (500 caracteres).
- Rate limit por IP + tope diario global (freno de costo).
- Modelo más barato (Haiku 4.5) + `max_tokens` bajo + system prompt acotado al portfolio.
- Timeout hacia Anthropic (15 s).

## Probar en local

```bash
ANTHROPIC_API_KEY=sk-ant-... node chat-api/server.mjs
# en otra terminal:
curl -X POST http://127.0.0.1:8787/api/chat \
  -H "Content-Type: application/json" -H "Origin: https://g360ia.com.ar" \
  -d '{"message":"hacés sitios web?","lang":"es"}'
```

## Costo aproximado

Con Haiku 4.5: ~US$0.0018 por respuesta de IA → **~US$0.15–0.20 cada 100 respuestas** (peor caso,
todas con IA). Los números del menú no gastan nada.
