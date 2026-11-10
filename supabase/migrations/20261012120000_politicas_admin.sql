-- Políticas RLS para el rol admin.
-- Un usuario con rol = 'admin' en perfiles puede leer y escribir todas las tablas.
-- Las políticas de recepción, profesor y socio se agregan en otra migración.

-- Función que dice si el usuario logueado es admin.
-- Es SECURITY DEFINER para que pueda leer "perfiles" sin pasar por RLS;
-- si no, la política de perfiles se llamaría a sí misma y daría error de recursión.
CREATE OR REPLACE FUNCTION public.es_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM perfiles
    WHERE id = auth.uid() AND rol = 'admin'
  );
$$;

-- Nos aseguramos de que RLS esté activo en todas las tablas
ALTER TABLE sedes       ENABLE ROW LEVEL SECURITY;
ALTER TABLE planes      ENABLE ROW LEVEL SECURITY;
ALTER TABLE socios      ENABLE ROW LEVEL SECURITY;
ALTER TABLE pagos       ENABLE ROW LEVEL SECURITY;
ALTER TABLE asistencias ENABLE ROW LEVEL SECURITY;
ALTER TABLE perfiles    ENABLE ROW LEVEL SECURITY;

-- Admin: acceso total (select, insert, update, delete) a cada tabla
CREATE POLICY "admin_todo_sedes" ON sedes
  FOR ALL TO authenticated USING (es_admin()) WITH CHECK (es_admin());

CREATE POLICY "admin_todo_planes" ON planes
  FOR ALL TO authenticated USING (es_admin()) WITH CHECK (es_admin());

CREATE POLICY "admin_todo_socios" ON socios
  FOR ALL TO authenticated USING (es_admin()) WITH CHECK (es_admin());

CREATE POLICY "admin_todo_pagos" ON pagos
  FOR ALL TO authenticated USING (es_admin()) WITH CHECK (es_admin());

CREATE POLICY "admin_todo_asistencias" ON asistencias
  FOR ALL TO authenticated USING (es_admin()) WITH CHECK (es_admin());

CREATE POLICY "admin_todo_perfiles" ON perfiles
  FOR ALL TO authenticated USING (es_admin()) WITH CHECK (es_admin());

-- Cualquier usuario logueado puede leer SU propio perfil.
-- Hace falta para que la app sepa qué rol tiene después del login.
CREATE POLICY "leer_perfil_propio" ON perfiles
  FOR SELECT TO authenticated USING (id = auth.uid());
