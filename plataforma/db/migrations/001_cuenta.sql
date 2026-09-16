-- 001 · La cuenta
-- ============================================================================
-- Una sola tabla para los dos lados. El rol dice a qué panel entra cada uno, y
-- es lo único que los distingue al momento de entrar: el email de Google es la
-- identidad, y `rol` es adónde va.
--
-- Por qué una tabla y no `afiliado` + `developer`: el 90% de las columnas serían
-- las mismas (email, nombre, foto, cómo cobra, qué aceptó y cuándo) y cada
-- consulta de login tendría que preguntarle a las dos cuál lo tiene. Cuando un
-- lado acumule campos que al otro no le sirven, esos campos van a una tabla
-- propia que cuelga de ésta — no se parte esta.

CREATE TABLE IF NOT EXISTS cuenta (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

  email         TEXT        NOT NULL UNIQUE,
  nombre        TEXT        NOT NULL,
  foto_url      TEXT,

  -- 'afiliado' vende, 'developer' publica. Se elige UNA vez, al registrarse.
  -- El CHECK está acá y no sólo en el código para que una ruta nueva no pueda
  -- crear una cuenta con un rol que ningún panel sabe recibir.
  rol           TEXT        NOT NULL CHECK (rol IN ('afiliado', 'developer')),

  -- El código de referido del afiliado. Es lo único que la persona elige y lo
  -- único que después no se puede cambiar: ya está impreso en lo que repartió.
  -- Los developers no lo usan, así que va NULL — pero cuando está, es único en
  -- toda la tabla, porque de él sale una URL.
  alias         TEXT UNIQUE
                CHECK (alias IS NULL OR alias ~ '^[a-z0-9][a-z0-9-]{1,23}$'),

  -- Qué versión de las condiciones aceptó al registrarse. El alta es
  -- self-service y el reparto se acepta al entrar, así que esto es lo que
  -- respalda una liquidación si alguien la discute más adelante.
  condiciones_version  TEXT        NOT NULL,
  condiciones_en       TIMESTAMPTZ NOT NULL DEFAULT now(),

  creado_en     TIMESTAMPTZ NOT NULL DEFAULT now(),
  ultimo_acceso TIMESTAMPTZ
);

-- Un afiliado sin código no puede referir a nadie; un developer no necesita uno.
ALTER TABLE cuenta
  ADD CONSTRAINT cuenta_alias_segun_rol
  CHECK ((rol = 'afiliado' AND alias IS NOT NULL) OR (rol = 'developer'));

CREATE INDEX IF NOT EXISTS cuenta_alias_idx ON cuenta (alias);
