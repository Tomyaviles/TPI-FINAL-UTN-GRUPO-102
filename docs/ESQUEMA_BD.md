# Esquema de Base de Datos — Sistema de Gestión para Gimnasios

**Materia:** Trabajo Final Integrador (UTN)  
**Grupo:** 102  
**Fecha de actualización:** Septiembre 2026  

---

## Enfoque Arquitectónico

Siguiendo las recomendaciones recibidas para optimizar los tiempos de desarrollo, el modelo de datos se diseñó bajo un esquema simplificado y eficiente mediante **Supabase (PostgreSQL)**. 

El modelo evita la sobreingeniería y las tablas intermedias innecesarias, permitiendo:
- Consultas de estado de cuota en tiempo real mediante API REST/BaaS.
- Soporte nativo para arquitectura multisede.
- Desacoplamiento entre la ficha del socio y la autenticación de usuarios.

---

## Diagrama Entidad-Relación (DER)

```mermaid
erDiagram
    SEDES ||--o{ SOCIOS : "pertenece a"
    SEDES ||--o{ ASISTENCIAS : "registra en"
    PLANES ||--o{ SOCIOS : "tiene asignado"
    SOCIOS ||--o{ PAGOS : "realiza"
    SOCIOS ||--o{ ASISTENCIAS : "registra"

    SEDES {
        uuid id PK
        string nombre
        string direccion
        timestamp created_at
    }

    PLANES {
        uuid id PK
        string nombre
        decimal precio
        int duracion_dias
        timestamp created_at
    }

    SOCIOS {
        uuid id PK
        uuid user_id FK
        string nombre
        string apellido
        string dni
        string email
        string telefono
        uuid sede_id FK
        uuid plan_id FK
        date fecha_vencimiento
        string estado_cuota
        timestamp created_at
    }

    PAGOS {
        uuid id PK
        uuid socio_id FK
        decimal monto
        string metodo_pago
        timestamp fecha_pago
        int periodo_mes
        int periodo_anio
    }

    ASISTENCIAS {
        uuid id PK
        uuid socio_id FK
        uuid sede_id FK
        timestamp fecha_hora
    }
    
    Explicación de Relaciones entre Entidades
sedes 1 ─── N socios (Una sede tiene muchos socios)

Clave foránea: socios.sede_id ➔ sedes.id

Descripción: Cada socio está registrado en una sede principal de la cadena. Esto permite filtrar listados, reportes de facturación y cupos por establecimiento.

planes 1 ─── N socios (Un plan es contratado por muchos socios)

Clave foránea: socios.plan_id ➔ planes.id

Descripción: Determina qué membresía tiene activa el socio (ej. Pase Libre, 3 veces por semana) y sirve de base para calcular el monto y los días de vigencia de las renovaciones.

socios 1 ─── N pagos (Un socio realiza muchos pagos)

Clave foránea: pagos.socio_id ➔ socios.id

Descripción: Guarda el historial transaccional de cuotas cobradas a cada cliente. Cada vez que se registra un pago, se actualizan la fecha_vencimiento y el estado_cuota en la ficha del socio.

socios 1 ─── N asistencias (Un socio registra muchos ingresos)

Clave foránea: asistencias.socio_id ➔ socios.id

Descripción: Almacena cada evento de acceso en el molinete/recepción. Permite validar si el socio está al día antes de dejarlo ingresar y consultar métricas de concurrencia.

sedes 1 ─── N asistencias (Una sede recibe muchas asistencias)

Clave foránea: asistencias.sede_id ➔ sedes.id

Descripción: Registra en qué sede física específica ocurrió la asistencia, independientemente de la sede de origen del socio (soporte para socios en tránsito multisede).

Detalle de Tablas y Entidades
1. sedes
Almacena las sedes físicas de la cadena de gimnasios para permitir la gestión multisede.

id (UUID, PK): Identificador único.

nombre (TEXT): Nombre de la sede (ej. Sede Central, Sede Norte).

direccion (TEXT): Dirección física de la sede.

2. planes
Define los tipos de membresías y sus tarifas vigentes.

id (UUID, PK): Identificador único.

nombre (TEXT): Nombre del plan (ej. Pase Libre Mensual, 3 días/semana).

precio (DECIMAL): Costo del plan.

duracion_dias (INT): Período de vigencia en días (por defecto 30).

3. socios
Tabla principal de clientes del gimnasio.

id (UUID, PK): Identificador del socio.

user_id (UUID, FK, opcional): Relación con auth.users de Supabase para acceso a la App Móvil.

sede_id (UUID, FK): Sede a la que pertenece el socio.

plan_id (UUID, FK): Plan contratado.

estado_cuota (TEXT): Estado administrativo ('al_dia', 'vencido', 'suspendido').

fecha_vencimiento (DATE): Próxima fecha de cobro.

4. pagos
Registro histórico de transacciones y cobros de cuotas.

id (UUID, PK): Identificador del pago.

socio_id (UUID, FK): Socio que abonó.

monto (DECIMAL): Importe cobrado.

metodo_pago (TEXT): Forma de pago ('efectivo', 'transferencia', 'mercadopago').

fecha_pago (TIMESTAMP): Fecha y hora de la transacción.

5. asistencias
Registro de ingresos y control de acceso en puerta.

id (UUID, PK): Identificador del ingreso.

socio_id (UUID, FK): Socio que ingresa.

sede_id (UUID, FK): Sede donde se registra el acceso.

fecha_hora (TIMESTAMP): Fecha y hora del molinete/validación.

Reglas de Negocio Integradas en el Esquema
Validación de Ingreso en Puerta: Para dar paso en recepción no hace falta calcular dinámicamente todo el historial de pagos. La API consulta directamente las columnas estado_cuota y fecha_vencimiento de la tabla socios.

Identificación de Morosos: Si fecha_vencimiento < fecha actual, el sistema pasa el estado_cuota a 'vencido', denegando el acceso y habilitando el envío de avisos automáticos de cobro.

Acceso Móvil Opcional: La columna user_id de la tabla socios es opcional (acepta valores NULL). Esto permite que un recepcionista dé de alta a un socio de forma inmediata sin obligarlo a crear una cuenta o correo en el momento.

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