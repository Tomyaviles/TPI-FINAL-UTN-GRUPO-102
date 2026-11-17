-- Políticas RLS para recepción, profesor y socio.
-- El admin ya tiene acceso total (ver 20261012120000_politicas_admin.sql).
--
-- Resumen:
--   sedes, planes  -> todos los logueados las pueden leer; solo el admin las modifica
--   recepción      -> ve y carga socios, pagos y asistencias de SU sede
--   profesor       -> solo lectura de socios y asistencias de su sede
--   socio          -> solo ve sus propios datos (por socios.user_id)
--
-- En Postgres las políticas se suman: si alguna da true, la fila se puede ver.

-- Rol y sede del usuario logueado.
-- SECURITY DEFINER por lo mismo que es_admin(): leen perfiles sin pasar por RLS.
CREATE OR REPLACE FUNCTION public.mi_rol()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT rol FROM perfiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.mi_sede()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT sede_id FROM perfiles WHERE id = auth.uid();
$$;


-- SEDES y PLANES: lectura para todos (hacen falta en combos y listados).
-- No agregamos insert/update/delete: solo los tiene el admin.
CREATE POLICY "leer_sedes" ON sedes
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "leer_planes" ON planes
  FOR SELECT TO authenticated USING (true);


-- SOCIOS
-- Recepción: ve, da de alta y modifica socios de su sede (no borra).
CREATE POLICY "recepcion_ver_socios" ON socios
  FOR SELECT TO authenticated
  USING (mi_rol() = 'recepcion' AND sede_id = mi_sede());

CREATE POLICY "recepcion_alta_socios" ON socios
  FOR INSERT TO authenticated
  WITH CHECK (mi_rol() = 'recepcion' AND sede_id = mi_sede());

CREATE POLICY "recepcion_editar_socios" ON socios
  FOR UPDATE TO authenticated
  USING (mi_rol() = 'recepcion' AND sede_id = mi_sede())
  WITH CHECK (mi_rol() = 'recepcion' AND sede_id = mi_sede());

-- Profesor: solo mira los socios de su sede
CREATE POLICY "profesor_ver_socios" ON socios
  FOR SELECT TO authenticated
  USING (mi_rol() = 'profesor' AND sede_id = mi_sede());

-- Socio: solo su propia ficha
CREATE POLICY "socio_ver_propio" ON socios
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());


-- PAGOS
-- Recepción: ve y registra pagos de socios de su sede.
-- El subselect a socios ya pasa por RLS, así que solo trae los de su sede.
CREATE POLICY "recepcion_ver_pagos" ON pagos
  FOR SELECT TO authenticated
  USING (
    mi_rol() = 'recepcion'
    AND socio_id IN (SELECT id FROM socios WHERE sede_id = mi_sede())
  );

CREATE POLICY "recepcion_cargar_pagos" ON pagos
  FOR INSERT TO authenticated
  WITH CHECK (
    mi_rol() = 'recepcion'
    AND socio_id IN (SELECT id FROM socios WHERE sede_id = mi_sede())
  );

-- Socio: ve sus pagos
CREATE POLICY "socio_ver_pagos" ON pagos
  FOR SELECT TO authenticated
  USING (socio_id IN (SELECT id FROM socios WHERE user_id = auth.uid()));


-- ASISTENCIAS
-- Recepción: ve y registra ingresos en su sede
CREATE POLICY "recepcion_ver_asistencias" ON asistencias
  FOR SELECT TO authenticated
  USING (mi_rol() = 'recepcion' AND sede_id = mi_sede());

CREATE POLICY "recepcion_cargar_asistencias" ON asistencias
  FOR INSERT TO authenticated
  WITH CHECK (mi_rol() = 'recepcion' AND sede_id = mi_sede());

-- Profesor: ve los ingresos de su sede
CREATE POLICY "profesor_ver_asistencias" ON asistencias
  FOR SELECT TO authenticated
  USING (mi_rol() = 'profesor' AND sede_id = mi_sede());

-- Socio: ve sus propios ingresos
CREATE POLICY "socio_ver_asistencias" ON asistencias
  FOR SELECT TO authenticated
  USING (socio_id IN (SELECT id FROM socios WHERE user_id = auth.uid()));
