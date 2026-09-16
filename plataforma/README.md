# G360iA Catálogo — brief de construcción

> Brief para quien construya este proyecto (humano o agente). Sale de una sesión de
> razonamiento (16-sep-2026), sin código todavía. Estructura: qué existe, qué es límite duro,
> qué está decidido, qué falta construir, qué falta decidir. Actualizar a medida que se
> construye y se cierran decisiones — este documento debe seguir siendo la fuente de verdad.

## Objetivo

Un catálogo privado que une **developers** (terceros dueños de su propio software, en su
propia infraestructura) con **afiliados** que lo promocionan a cambio de comisión. El
afiliado genera un código de referido por producto; cuando ese referido se convierte en
suscriptor pago, el pago entra a G360iA, se reparte **50% developer / 20% afiliado / 30%
G360iA**, y el plan se activa **instantáneamente** en el software del developer.

Proyecto bajo marca **G360iA**, con dos socios entrando "de palabra" (sin formalizar
societariamente a la fecha de este documento).

## Límite duro: esto NO toca el software de Vet

**`g360aia-turnero` (Vet 360iA) es un producto de software aparte y no tiene relación con
este proyecto.** No se modifica su código, no se comparte su base de datos, no se depende de
su deploy, y no se lo usa como ambiente de prueba para nada de lo de acá. Si en algún punto
parece necesario tocar algo de ese repo para construir el catálogo, es señal de que el diseño
está mal — hay que resolverlo de otra forma dentro de este proyecto, no cruzando el límite.

Consecuencia concreta: aunque hoy exista un programa de afiliados de G360iA (para vender
software propio como Vet) que pueda vivir cerca o dentro de ese repo, **este proyecto no lo
reutiliza tocando ese código.** Ver "Evaluar antes de construir" más abajo.

## Qué existe hoy en el ecosistema (verificado contra el filesystem, no solo memoria)

| Repo | Dominio | Qué es | Relación con este proyecto |
|---|---|---|---|
| `g360ia-web` | g360ia.com.ar | Vidriera: servicios, software propio, afiliados, blog | Ya tiene la página de pitch pública `/developers` y la de `/afiliados`. Son copy, no software: declaran el split y el flujo, y hay que mantenerlas alineadas con este brief |
| `g360ia-panel` | panel.g360ia.com.ar → pasaría a `admin.g360ia.com.ar` | Panel interno de la agencia | Consume la API de este proyecto para mostrar developers/afiliados/transacciones consolidados. No comparte base |
| `g360aia-turnero` | vet.g360ia.com.ar | Producto Vet (SaaS veterinario) | **Fuera de alcance, no se toca** (ver arriba) |
| `g360ia-govtech` | — | Ya existe (Next.js + Prisma, gestión municipal) | Sin relación con este proyecto |
| `g360ia-modular` | — | Existe, ERP/CRM modular | Relación con "software propio" sin aclarar — no asumir nada, no depende de esto |
| **`g360ia-catalogo`** (este repo) | `developers.g360ia.com.ar` + `afiliados.g360ia.com.ar` — **dominios ya decididos y apuntados desde el sitio** | **A construir, contenido en este repo** | — |

**Principio de diseño: este proyecto es autocontenido.** Developers, afiliados-del-catálogo,
productos, referidos, transacciones y ledger viven todos en la base de `g360ia-catalogo`. No
depende técnicamente de ningún otro repo para funcionar — si hay overlap de personas (alguien
que ya es afiliado de Vet también quiere serlo acá), es un overlap de negocio, no una
integración técnica.

## Roles — terminología cerrada, no reabrir

- **No usar "partner"** como rol de sistema (tablas, subdominios, permisos). Es un término de
  marketing genérico que no dice qué hace la cuenta. Puede aparecer en copy de una landing
  pública ("sumate como partner"), nunca en código.
- **Developer**: construye el software, tiene su propio VPS (ajeno), cobra el 50% de cada
  cuota de su producto. Carga en su panel: info del software, capturas, explicación para el
  afiliado, link a demo, link a la web del producto, precios de suscripción, **la URL del
  webhook de activación** y **su CVU o alias** de cobro. La comisión **no** la propone: el
  split es fijo (ver «Reparto y monetización»).
- **Afiliado**: refiere clientes, cobra el 20% de cada cuota, no construye nada. Ve el
  catálogo dentro de su propio panel (privado, solo logueado), acepta la propuesta de un
  developer, genera un código de referido específico para ese producto y carga **su CVU o
  alias** de cobro.

## Reparto y monetización — cerrado el 16-sep-2026

### El split es fijo: 50 / 30 / 20

Sobre **cada cuota cobrada**, mientras el suscriptor siga activo:

| Parte | % | Por qué |
|---|---|---|
| Developer | **50** | construye y mantiene el producto, y da el soporte |
| G360iA | **30** | cobra, calcula el split, liquida y sostiene la red |
| Afiliado | **20** | trajo al cliente |

**No se negocia por producto.** La razón no es administrativa: si cada producto paga distinto,
el afiliado deja de elegir el que le sirve al cliente y elige el que más le paga a él. Un
catálogo con comisiones dispares se convierte en un ranking de comisiones.

El 20% del afiliado coincide a propósito con el que ya paga el programa de afiliados de Vet
(`COMISION_PCT` en `g360ia-web/data.jsx` y el DEFAULT de `afiliado.comision_pct` en la
migración 090 del turnero): cuando los dos programas se fusionen —decisión de negocio todavía
abierta, más abajo— el vendedor no tiene que reaprender el número.

### Cada parte cobra por transferencia, al CVU que cargó

Developer y afiliado cargan **CVU o alias** en su propio panel. La liquidación es mensual y por
transferencia, y el ledger de la decisión 3 es el que dice cuánto le toca a cada uno.

### Dos cosas que se cobran aparte de la comisión

Ninguna es necesaria para publicar ni para vender. Son las dos palancas de ingreso que no
dependen de que el catálogo ya tenga volumen:

1. **Ampliar el cupo de afiliados.** Cada producto arranca con **5 afiliados** promocionándolo
   a la vez (el mecanismo de cupos de la decisión 2). Ampliarlo se cobra. Es un límite que ya
   iba a existir por diseño, así que monetizarlo no agrega complejidad: es ponerle precio a una
   consulta de capacidad que de todos modos hay que hacer.
2. **Listados de contacto del rubro.** Nombre, rubro y teléfono de negocios del vertical de un
   producto, por tandas (100, 200, …), para que el vendedor sepa a quién golpearle la puerta.
   Se le puede vender **al developer** (para que sus afiliados arranquen con material) y **al
   afiliado** (que compra su propia tanda). Resuelve el problema real del vendedor nuevo, que
   no es la comisión: es a quién llamar.

**Antes de construir el punto 2, resolver dos cosas.** No bloquean el core, pero sí bloquean
vender el primer listado:

- **De dónde salen los datos.** Scrapear Google Maps viola sus términos de servicio. Las
  fuentes limpias son registros públicos, cámaras y padrones sectoriales, o relevamiento
  propio. La fuente hay que poder decirla en voz alta, porque el que compra va a preguntar.
- **Encuadre legal.** Datos de contacto comercial que el propio negocio publica es el caso más
  defendible. El teléfono personal de una persona física entra de lleno en la Ley 25.326 y
  necesita base legal y canal de baja. Consultar antes de armar la primera tanda, no después de
  venderla.

### El alta es self-service en las dos puntas

**No hay charla previa, ni entrevista, ni aprobación de cuenta.** Ni para el afiliado ni para
el developer. Se registran con Google, y **al registrarse aceptan las condiciones**: el split
50/20/30 y, en el caso del developer, los requisitos de admisión del producto. No hay nada que
negociar caso por caso — por eso el split es fijo.

Lo único que pasa por una revisión es **el producto**, no la persona: que el webhook responda
y que cumpla los seis requisitos. Eso es una compuerta técnica, no una decisión comercial.

Consecuencia para el diseño: el onboarding tiene que bancarse a alguien que llega solo, sin
contexto y sin nadie explicándole. Los textos del panel son producto, no documentación
interna. El checkbox de aceptación de condiciones y su versionado (qué versión aceptó cada
cuenta, y qué pasa cuando cambian) hay que modelarlo desde el principio: es lo que respalda el
reparto cuando alguien discuta su liquidación.

### Dónde entra cada uno

| Quién | Panel | Qué hace ahí |
|---|---|---|
| Afiliado | `afiliados.g360ia.com.ar` | ve el catálogo, acepta productos, genera códigos, carga su CVU, ve comisiones |
| Developer | `developers.g360ia.com.ar` | carga ficha, CVU y webhook, ve el resultado de la verificación, sus referidos y liquidaciones |

`g360ia.com.ar/afiliados` y `g360ia.com.ar/developers` son sólo la vidriera: explican y mandan
a cada panel. **Ya apuntan ahí** desde el 16-sep-2026.

**Los dos subdominios todavía no sirven nada.** Resuelven en DNS pero no hay servidor
escuchando (`curl` devuelve 000). Se decidió apuntar igual, a sabiendas: hasta que estos
paneles estén arriba, **los CTA de las dos páginas públicas están muertos**. Es la deuda más
visible que deja este brief y lo primero que hay que cerrar.

Antes `g360ia.com.ar/afiliados` mandaba a `vet.g360ia.com.ar/afiliados`. Ese panel es del
producto veterinario, no del programa, y el afiliado del catálogo vende **todo el catálogo**.
Ojo con el límite duro: que el afiliado de Vet y el del catálogo sean la misma persona es un
overlap de negocio, no una razón para tocar el repo del turnero.

### Estados de un producto, y la compuerta del webhook

Un producto **no se publica hasta que su webhook está verificado**:

```
borrador ──▶ webhook cargado ──▶ verificado ──▶ en revisión ──▶ publicado
                                     │
                                     └─ falla la prueba ──▶ vuelve a borrador
```

- El developer carga la **URL del webhook** en su panel, junto con la ficha y el CVU.
- **Hay que construir el verificador**: una llamada de prueba contra el servidor real del
  developer, con un payload de activación de juguete, que confirme que responde como dice el
  contrato — firma válida, 2xx, e idempotente si se repite. Sin esa prueba en verde el producto
  no avanza.
- Con la verificación OK, la ficha entra a **revisión y se aprueba en hasta 2 horas**. Ese
  plazo ya está publicado en `g360ia.com.ar/developers`, así que es un compromiso y no una
  aspiración: si la revisión va a ser manual, tiene que haber alguien mirando.

La compuerta existe por una razón concreta: la activación es instantánea y **el cobro es
nuestro**. Un producto publicado con el webhook roto cobra la suscripción y deja al cliente
esperando — y ahí el que queda mal es el afiliado que lo vendió y G360iA que lo cobró, no el
developer.

### Requisitos para entrar al catálogo

Es lo que está publicado en `g360ia.com.ar/developers` y hay que sostener al evaluar un
producto:

1. **Se cobra por suscripción.** Una cuota que se repite. Un pago único paga una sola comisión,
   y con eso ningún afiliado construye nada.
2. **Da de alta un cliente sin intervención humana.** Multitenant, o con un aprovisionamiento
   automático equivalente. No se exige multitenant por dogma: se exige que el alta sea una
   llamada. Si hay que levantar una instancia a mano, la activación instantánea no existe y el
   afiliado vende algo que tarda dos días.
3. **Terminado, en uso y con soporte propio**, con clientes reales que ya pagan.
4. **Webhook de activación cargado y verificado** (ver arriba).
5. **Rubro identificable.** «Para cualquier empresa» no se puede vender: el afiliado necesita
   saber a qué puerta golpear.
6. **El 50% le cierra.** Si el margen no soporta ceder la mitad, el canal no le sirve y es
   mejor decirlo en la primera charla.

## Decisiones de arquitectura ya tomadas (no reabrir sin razón nueva)

1. **El catálogo es privado**, no una página pública indexable. Se descartó
   `g360ia.com.ar/catalogo` público. Razones: (a) un developer competidor vería la comisión y
   precio de otro developer si fuera público; (b) el mecanismo de cupos (abajo) no tiene
   sentido como contenido estático público.
2. **Cupos por developer**: el developer puede limitar cuántos afiliados promocionan su
   producto a la vez (ej. plan que limita a 5). Al llegar al límite, el producto se oculta del
   catálogo para el resto de los afiliados (los que ya tienen código activo lo siguen viendo).
   Es una consulta de capacidad (`max_afiliados > count(referidos_activos)`), no requiere
   diseño especial más allá de modelarla en el schema.
3. **El reparto de pago lo calcula G360iA, no Mercado Pago.** Se evaluó Mercado Pago
   Marketplace (split automático) y se descartó — no resuelve reparto variable de tres partes
   (developer/afiliado/G360iA). Se necesita un **ledger propio**: tabla de transacciones con
   estado (pago recibido → split calculado → liquidado), no solo un flag de "activo".
4. **Nunca confiar en el payload del webhook de Mercado Pago tal cual.** El IPN solo avisa que
   "algo pasó" con un ID de pago — antes de activar cualquier plan hay que re-consultar el
   estado real de ese pago contra la API de MP con ese ID. Es más crítico todavía porque la
   activación es instantánea, sin ventana de revisión manual.
5. **La activación del plan es un webhook firmado, no un MCP.** Se descartó explícitamente
   MCP (es el protocolo de agentes de IA para invocar herramientas en una sesión, no
   comunicación servidor-a-servidor transaccional). Patrón correcto: `POST /activar-plan
   {suscriptor_id, plan}` firmado (HMAC o API key), con cola de reintentos (el VPS del
   developer puede estar caído en el momento del pago) y clave de idempotencia (no activar dos
   veces el mismo pago).
6. **El link de referido pasa por un redirect propio antes de ir al sitio del developer**
   (ej. `g360ia.com.ar/r/CODE` o el dominio que se use), para loguear el click y no depender de
   que cada developer externo implemente bien un `?ref=CODE` a mano.
7. **Documentación del protocolo de activación: P2P primero, pública después.** El contrato
   todavía no se validó con nadie real. Los primeros 2-3 developers se integran a mano (doc
   privado, sin publicar). Recién cuando el contrato esté estable se documenta públicamente,
   probablemente dentro del panel de developers. (Nota: la idea original de usar Vet/turnero
   como primer caso de prueba queda descartada por el límite duro de arriba — el primer caso
   de prueba tiene que ser un developer real, externo, chico y cooperativo, no software propio.)

## Estructura de Easypanel para este proyecto

Un Project propio, sin compartir base ni red interna con ningún otro repo:

```
Project: g360ia-catalogo
  ├─ service: catalogo-api      → expone la API (productos, referidos, transacciones,
  │                                 webhook de MP, webhook de activación saliente)
  ├─ service: developers-app    → panel self-service del developer
  ├─ service: afiliados-app     → superficie donde el afiliado navega el catálogo y genera
  │                                 referidos (construida en este proyecto, no reutiliza
  │                                 código del repo de Vet)
  └─ service: catalogo-db (Postgres, propia — ningún otro Project la toca)
```

`admin.g360ia.com.ar` (repo `g360ia-panel`, otro Project) consume `catalogo-api` por HTTPS
pública con una API key de servicio — Projects distintos en Easypanel no comparten red
interna, así que cualquier llamada cruzada sale por internet, autenticada, nunca por
Docker network ni base compartida.

Si el VPS es chico: se puede usar un solo servicio de Postgres a nivel servidor con una base
y un usuario propios de `g360ia-catalogo` (sin permisos cruzados con las bases de otros
Projects), en vez de levantar un Postgres dedicado por proyecto.

## Qué falta construir (checklist)

- [ ] **Schema de datos**: developers, productos (infoproducto: descripción, capturas, demo,
      precio, `webhook_url`, `webhook_verificado_en`, `estado`, `max_afiliados`),
      afiliados-del-catálogo, referidos (con estado activo/inactivo y conteo por producto),
      transacciones/ledger (pago → split 50/30/20 → liquidación por parte), y el CVU/alias de
      cobro tanto del developer como del afiliado.
- [ ] **`catalogo-api`**: CRUD de producto para el developer; listado de catálogo filtrado por
      cupo disponible para el afiliado; generación de código de referido; recepción y
      re-verificación de webhook de MP; cálculo de split; disparo del webhook de activación al
      developer (con firma, reintentos, idempotencia); endpoints de solo lectura para que
      `admin.g360ia.com.ar` consulte.
- [ ] **Verificador de webhook**: llamada de prueba contra el servidor del developer con un
      payload de activación de juguete, que valide firma, respuesta 2xx e idempotencia al
      repetir. Es la compuerta que habilita la publicación — sin esto el estado `verificado`
      no se puede alcanzar y nada se publica.
- [ ] **Flujo de aprobación**: estados del producto (borrador → webhook cargado → verificado →
      en revisión → publicado) y quién aprueba. **El sitio ya promete «hasta 2 horas»**, así
      que si la revisión es manual hay que definir quién la mira y en qué horario.
- [ ] **`developers-app`**: alta/edición de producto, carga de webhook y CVU, ver el resultado
      de la verificación, ver referidos activos propios, ver liquidaciones.
- [ ] **`afiliados-app`**: login propio de este proyecto, **el catálogo vive acá adentro**
      (navegable respetando cupos), botón "aceptar propuesta" → genera referido, carga de CVU,
      ver comisiones propias.
- [ ] **Redirect de tracking** (`/r/CODE`) que loguea el click y redirige al link del
      developer.
- [ ] **Cupos y su venta**: límite de 5 afiliados por producto y el flujo para ampliarlo pago.
- [ ] **Listados de contacto**: origen de los datos, encuadre legal, y cómo se entregan y
      cobran las tandas al developer y al afiliado (ver las dos advertencias más arriba).
- [x] **Página de pitch pública** `/developers` en `g360ia-web` — **hecha el 16-sep-2026** y
      publicada. Declara el split 50/30/20, la carga del webhook en el panel, la verificación
      previa, el plazo de hasta 2 horas, los seis requisitos y las dos cosas que se cobran
      aparte. `/afiliados` en el mismo repo quedó alineada (catálogo dentro del panel, CVU,
      20% igual en todo el catálogo). **Si cambia el mecanismo, cambian las dos páginas.**
- [ ] **Doc privado del protocolo de activación** para los primeros developers reales
      (no público todavía — decisión 7).

## Evaluar antes de construir (no asumir, confirmar primero)

- **¿Existe ya código reutilizable del "panel de afiliados" que el usuario mencionó tener
  construido?** Si existe y vive fuera del repo de Vet/turnero, evaluar si su arquitectura
  sirve como base de `afiliados-app` de este proyecto (mismo login, mismo dominio de
  afiliado) o si conviene construir de cero por el límite duro de no tocar Vet. Si el código
  existente vive dentro de `g360aia-turnero`, **no se reutiliza tocando ese repo** — se
  construye la superficie de afiliados-catálogo nueva en este proyecto, aunque el negocio
  trate a la misma persona como "afiliado" en los dos programas.
- **¿`g360ia-modular` tiene algo reusable** (auth, estructura multi-tenant, sistema de
  módulos) que valga la pena adoptar como base técnica de este proyecto en vez de arrancar
  de cero? No se investigó en la sesión de diseño — vale la pena mirarlo antes de elegir
  stack.

## Decisiones de negocio todavía abiertas (no bloquean empezar a construir el core)

- [ ] ¿Se fusiona del todo el rol "afiliado" con "vendedor de catálogo", o se mantienen como
      programas separados con la misma mecánica? (la inclinación en la charla fue a
      fusionarlos, pero no se cerró). **El 20% del afiliado se fijó igual en los dos
      justamente para que fusionarlos después no obligue a renegociar nada.**
- [x] ~~% de comisión de G360iA~~ — **cerrado el 16-sep-2026: 30%**, dentro del split
      fijo 50/30/20. Ver «Reparto y monetización».
- [ ] Estructura societaria definitiva con los dos socios (declarado como no urgente,
      "va a evolucionar" — no bloquea el desarrollo técnico).
- [ ] **Precio** de las dos cosas que se cobran aparte: la ampliación de cupo y las tandas de
      contactos (100, 200, …). Está decidido *que* se cobran, no *cuánto*.
- [ ] Nombre de marca/dominio definitivo si el catálogo termina siendo entidad separada de
      G360iA en vez de quedar bajo la marca actual.

## Nota impositiva (referencia, no bloquea nada)

Ejemplo calculado en la sesión con USD 5.000/mes de facturación (dólar oficial ~$1.530 ARS al
16-sep-2026): cae en categoría J de monotributo (~$1.167.300 ARS/mes de cuota), muy cerca del
techo de la categoría K (~USD 6.900/mes al tipo de cambio de esa fecha). Dos motivos por los
que monotributo probablemente no aplica de entrada: es un régimen de persona física (con dos
socios, la estructura tiende a sociedad) y no está claro si el ingreso gravable es el total
cobrado o solo la comisión de G360iA (depende de cómo se facture — consultar contador). El
usuario marcó esto como secundario por ahora: se define con el crecimiento real, mes a mes.

## Estado actual

**Primera app en pie: el panel del afiliado** (16-sep-2026). Next 14 + Postgres + login con
Google, sin ORM ni librería de auth — mismo criterio que el turnero. Compila y responde; falta
desplegarla, y los pasos están en `DESPLIEGUE.md`.

Qué hay: la pantalla de entrada (informa y deja entrar en la misma vista), alta self-service
con Google, elección del código de referido con vista previa del link, panel con el código y
la carga del CVU, y el esqueleto de `/r/<codigo>`.

Qué no hay: catálogo, comisiones, ledger, panel de developer y registro del click del
referido. El resto del brief sigue siendo el plan.
