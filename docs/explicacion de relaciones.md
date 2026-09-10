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

📑 Detalle de Tablas y Entidades
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

⚙️ Reglas de Negocio Integradas en el Esquema
Validación de Ingreso en Puerta: Para dar paso en recepción no hace falta calcular dinámicamente todo el historial de pagos. La API consulta directamente las columnas estado_cuota y fecha_vencimiento de la tabla socios.

Identificación de Morosos: Si fecha_vencimiento < fecha actual, el sistema pasa el estado_cuota a 'vencido', denegando el acceso y habilitando el envío de avisos automáticos de cobro.

Acceso Móvil Opcional: La columna user_id de la tabla socios es opcional (acepta valores NULL). Esto permite que un recepcionista dé de alta a un socio de forma inmediata sin obligarlo a crear una cuenta o correo en el momento.