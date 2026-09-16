-- 001 · La cuenta del afiliado
-- ============================================================================
-- Primera tabla del catálogo. Sale del brief (README.md, «Roles» y «Reparto y
-- monetización»): el afiliado se registra solo, elige un alias que se convierte
-- en su código de referido, y carga un CVU donde cobrar.
--
-- Base propia de este proyecto. No comparte nada con la del turnero: que una
-- misma persona sea afiliado de Vet y de acá es un overlap de negocio, no una
-- integración técnica (límite duro del brief).

CREATE TABLE IF NOT EXISTS afiliado (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email         TEXT        NOT NULL UNIQUE,
  nombre        TEXT        NOT NULL,
  foto_url      TEXT,

  -- El alias es lo único que la persona elige y lo único que después no se
  -- puede cambiar: ya está impreso en los flyers que repartió. El CHECK vive
  -- acá y no sólo en el código para que una ruta nueva no pueda meter un
  -- código que el redirect /r/<codigo> después no sepa resolver.
  alias         TEXT        NOT NULL UNIQUE
                CHECK (alias ~ '^[a-z0-9][a-z0-9-]{1,23}$'),

  telefono      TEXT,

  -- Dónde cobra. Se carga después del alta, desde el panel: pedirlo en el
  -- registro es sumar fricción a cambio de un dato que recién hace falta
  -- cuando hay una comisión que liquidar.
  cvu           TEXT,
  cvu_titular   TEXT,

  -- Qué versión de las condiciones aceptó. El alta es self-service y el
  -- reparto 50/20/30 se acepta al registrarse, así que esto es lo que respalda
  -- la liquidación si alguien la discute más adelante.
  condiciones_version  TEXT        NOT NULL,
  condiciones_en       TIMESTAMPTZ NOT NULL DEFAULT now(),

  creado_en     TIMESTAMPTZ NOT NULL DEFAULT now(),
  ultimo_acceso TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS afiliado_alias_idx ON afiliado (alias);
