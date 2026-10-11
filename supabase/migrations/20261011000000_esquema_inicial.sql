-- Esquema inicial (basado en docs/script_sql.md)
-- Cualquier cambio posterior a la base va en una NUEVA migración, no editando esta.

-- 1. SEDES: sedes físicas del gimnasio (soporte multisede)
CREATE TABLE sedes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  direccion TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. PLANES: tipos de membresía, precios y duración
CREATE TABLE planes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  precio DECIMAL(10, 2) NOT NULL,
  duracion_dias INT DEFAULT 30,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. SOCIOS: clientes del gimnasio
CREATE TABLE socios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  -- Usuario de Supabase Auth (opcional, solo si el socio usa la app)
  user_id UUID,
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL,
  dni TEXT UNIQUE NOT NULL,
  email TEXT,
  telefono TEXT,
  sede_id UUID REFERENCES sedes(id),
  plan_id UUID REFERENCES planes(id),
  fecha_vencimiento DATE,
  -- 'al_dia', 'vencido', 'suspendido'
  estado_cuota TEXT DEFAULT 'al_dia',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. PAGOS: historial de cuotas cobradas
CREATE TABLE pagos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  socio_id UUID REFERENCES socios(id) ON DELETE CASCADE,
  monto DECIMAL(10, 2) NOT NULL,
  -- 'efectivo', 'transferencia', 'mercadopago'
  metodo_pago TEXT NOT NULL,
  fecha_pago TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  periodo_mes INT,
  periodo_anio INT
);

-- 5. ASISTENCIAS: registro de ingresos en puerta
CREATE TABLE asistencias (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  socio_id UUID REFERENCES socios(id) ON DELETE CASCADE,
  sede_id UUID REFERENCES sedes(id),
  fecha_hora TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. PERFILES (nueva, no estaba en el esquema original)
-- Guarda el rol de cada usuario del sistema (RF-02).
CREATE TABLE perfiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre TEXT,
  rol TEXT NOT NULL CHECK (rol IN ('admin', 'recepcion', 'profesor', 'socio')),
  -- Sede donde trabaja (recepción/profesor); NULL para admin
  sede_id UUID REFERENCES sedes(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
