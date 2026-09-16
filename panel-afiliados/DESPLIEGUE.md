# Poner `afiliados.g360ia.com.ar` en el aire

Cinco pasos. Los tres primeros son cosas que hay que crear en consolas ajenas
(Google, Easypanel, DNS) y no se pueden automatizar desde el repo.

---

## 1 · La base

Un Postgres propio de este proyecto. En Easypanel: **New → Service → Postgres**,
dentro del Project `g360ia-catalogo`.

No se comparte con la base del turnero. Que una misma persona sea afiliada de
Vet y de acá es un overlap de negocio, no una razón para compartir una base
(límite duro del `README.md`).

Con la base arriba, aplicar las migraciones:

```bash
DATABASE_URL="postgres://usuario:clave@host:5432/g360ia_catalogo" npm run migrar
```

El script anota lo que ya corrió en una tabla `migracion`, así que se puede
volver a ejecutar sin miedo: lo aplicado no se repite.

---

## 2 · Las credenciales de Google

En [Google Cloud Console](https://console.cloud.google.com/apis/credentials) →
**Crear credenciales → ID de cliente de OAuth 2.0 → Aplicación web**.

| Campo | Valor |
|---|---|
| Orígenes autorizados de JavaScript | `https://afiliados.g360ia.com.ar` |
| **URI de redireccionamiento autorizado** | `https://afiliados.g360ia.com.ar/api/auth/google` |

La URI de redireccionamiento tiene que coincidir **carácter por carácter** con
la que manda la app, o Google devuelve `redirect_uri_mismatch`. La app la arma
como `APP_URL + /api/auth/google`, así que `APP_URL` no puede llevar barra final.

Para probar en local, agregar además `http://localhost:3100` y
`http://localhost:3100/api/auth/google` a la misma credencial.

---

## 3 · El servicio

En el mismo Project de Easypanel: **New → Service → App**, apuntando al repo
`g360ia-web` y, **en la configuración del servicio, con el directorio de trabajo
en `panel-afiliados`**. Ese paso es el que no se puede olvidar: el repo aloja
dos cosas distintas —el sitio de Vite en la raíz y esta app de Next acá— y sin
indicar el subdirectorio, nixpacks construye el sitio y el servicio queda
sirviendo la vidriera en vez del panel.

El `nixpacks.toml` de esta carpeta ya tiene el build y el start.

Variables de entorno del servicio:

```
DATABASE_URL=postgres://…        (la del paso 1, por el host interno del Project)
APP_URL=https://afiliados.g360ia.com.ar
GOOGLE_CLIENT_ID=…               (paso 2)
GOOGLE_CLIENT_SECRET=…           (paso 2)
SESION_SECRETO=…                 (generar: openssl rand -hex 32)
```

`SESION_SECRETO` firma la cookie de sesión. Si cambia, se cierran todas las
sesiones abiertas — que es justamente lo que hay que hacer si alguna vez se
filtra.

**No hace falta definir `PORT`**: Easypanel lo inyecta y `next start` lo usa.

---

## 4 · El dominio

En el servicio → **Domains** → agregar `afiliados.g360ia.com.ar` con HTTPS.
Del lado del DNS, un registro que apunte ese subdominio al servidor.

---

## 5 · Comprobarlo

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://afiliados.g360ia.com.ar/
```

Tiene que dar **200**. Después, a mano:

- [ ] La pantalla de entrada se ve a la izquierda navy y a la derecha el acceso.
- [ ] En un teléfono, **el acceso queda arriba** y la información abajo.
- [ ] Escribir un código muestra el link armado debajo, mientras se escribe.
- [ ] «Continuar con Google» abre el consentimiento y vuelve al panel.
- [ ] Sin código y con una cuenta nueva, vuelve con el aviso de que falta elegirlo.
- [ ] Con un código ya tomado, avisa que está tomado en vez de romper.
- [ ] El CVU se guarda y sigue ahí al recargar.
- [ ] `/panel` sin sesión redirige a la entrada.
- [ ] «Salir» borra la sesión y vuelve a la entrada.

---

## Lo que todavía no hace

Está dicho en el panel, no escondido:

- **No hay catálogo.** Se muestra un aviso, no una grilla vacía. Llega cuando
  haya un producto publicado.
- **No hay comisiones ni ledger.** El código funciona desde el día uno, pero no
  hay nada que liquidar hasta que haya una venta.
- **`/r/<codigo>` no registra el click todavía.** Valida que el código exista y
  redirige; el registro necesita la tabla `referido`, que llega con el catálogo.
- **No hay panel de developer.** `developers.g360ia.com.ar` sigue sin servir.

Cada una está en el checklist del `README.md`.
