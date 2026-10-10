
Script DDL de Creación (SQL)
-- 1. TABLA: SEDES
-- Almacena las sedes físicas del gimnasio (soporte multisede)
CREATE TABLE sedes (
  -- Identificador único autogenerado en formato UUID v4
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Nombre comercial de la sede (ej. "Sede Central", "Sede Belgrano")
  nombre TEXT NOT NULL,
  
  -- Dirección física de la sede
  direccion TEXT,
  
  -- Fecha y hora exacta de creación del registro
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- 2. TABLA: PLANES
-- Define los tipos de membresías, precios y duraciones
CREATE TABLE planes (
  -- Identificador único del plan
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Nombre del plan (ej. "Pase Libre", "3 Días por Semana")
  nombre TEXT NOT NULL,
  
  -- Precio del plan con 2 decimales
  precio DECIMAL(10, 2) NOT NULL,
  
  -- Vigencia en días del plan (por defecto 30 días / un mes)
  duracion_dias INT DEFAULT 30,
  
  -- Fecha de alta del plan en el sistema
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- 3. TABLA: SOCIOS
-- Entidad principal que representa a los clientes/socios del gimnasio
CREATE TABLE socios (
  -- Identificador único del socio en la base de datos
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- ID opcional del usuario en Supabase Auth (permite acceso a la App Móvil)
  -- Permite NULL para que recepción cree el socio sin obligarlo a registrar email
  user_id UUID,
  
  -- Datos personales básicos
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL,
  
  -- DNI único por persona (evita duplicados)
  dni TEXT UNIQUE NOT NULL,
  
  -- Datos de contacto
  email TEXT,
  telefono TEXT,
  
  -- CLAVE FORÁNEA: Vincula al socio con su sede de origen
  sede_id UUID REFERENCES sedes(id),
  
  -- CLAVE FORÁNEA: Vincula al socio con el plan contratado
  plan_id UUID REFERENCES planes(id),
  
  -- Próxima fecha límite de pago para controlar el acceso en puerta
  fecha_vencimiento DATE,
  
  -- Estado administrativo actual ('al_dia', 'vencido', 'suspendido')
  estado_cuota TEXT DEFAULT 'al_dia',
  
  -- Fecha de registro inicial en el gimnasio
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- 4. TABLA: PAGOS
-- Historial transaccional de cuotas cobradas a los socios
CREATE TABLE pagos (
  -- Identificador único de la transacción/pago
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- CLAVE FORÁNEA: Relaciona el pago con el socio correspondiente
  -- ON DELETE CASCADE: Si se borra al socio, se borran sus pagos automáticamente
  socio_id UUID REFERENCES socios(id) ON DELETE CASCADE,
  
  -- Importe cobrado
  monto DECIMAL(10, 2) NOT NULL,
  
  -- Medio de cobro ('efectivo', 'transferencia', 'mercadopago')
  metodo_pago TEXT NOT NULL,
  
  -- Fecha y hora exacta de la transacción
  fecha_pago TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Columnas para facilitar filtros y reportes contables mensuales
  periodo_mes INT,  -- Mes abonado (1-12)
  periodo_anio INT  -- Año abonado (ej. 2026)
);


-- 5. TABLA: ASISTENCIAS
-- Registro de accesos y validaciones en puerta/molinete
CREATE TABLE asistencias (
  -- Identificador único del evento de acceso
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- CLAVE FORÁNEA: Socio que está ingresando
  socio_id UUID REFERENCES socios(id) ON DELETE CASCADE,
  
  -- CLAVE FORÁNEA: Sede física donde ocurrió el ingreso
  -- Permite controlar accesos de socios en sedes distintas a la de su registro
  sede_id UUID REFERENCES sedes(id),
  
  -- Marca de tiempo (fecha y hora exacta del ingreso)
  fecha_hora TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
