# Listado de Módulos — Sistema de Gestión para Gimnasios

**Materia:** Trabajo Final Integrador (UTN)
**Grupo:** 102
**Etapa:** Diseño — Arquitectura y Módulos (11/09 al 27/09)

---

## Criterio de Modularización

El sistema se organiza en módulos funcionales, cada uno alineado a un actor o proceso de negocio identificado en la [Propuesta de Proyecto](./Propuesta_Proyecto.md). Cada módulo se corresponde con una o más entidades del [Esquema de Base de Datos](./ESQUEMA_BD.md) y, en la implementación, con una carpeta propia dentro de `/src` (ver mapeo en la sección 3).

**Estados posibles:** Diseñado (definido en esquema/alcance, código aún no iniciado) · En desarrollo (scaffolding o código parcial subido al repositorio) · Implementado (funcional de punta a punta).

---

## 1. Módulos del núcleo mínimo entregable

| # | Módulo | Descripción | Roles | Entidades relacionadas | Estado |
| :-: | :--- | :--- | :--- | :--- | :--- |
| 1 | **Autenticación y Roles** | Inicio de sesión y permisos diferenciados por rol, usando Supabase Auth. | Todos | `auth.users` (Supabase) | Diseñado |
| 2 | **Gestión de Socios y Sedes** | Alta, baja, modificación y consulta de socios; vinculación a sede; búsqueda por DNI/nombre/estado. | Administrador, Recepción | `sedes`, `socios` | Diseñado |
| 3 | **Planes y Membresías** | Definición de planes, precios y duración de vigencia. | Administrador | `planes` | Diseñado |
| 4 | **Cobros y Estado de Cuenta** | Registro de pagos, cálculo automático de vencimiento y detección de morosos. | Administrador, Recepción | `pagos`, `socios` | Diseñado |
| 5 | **Control de Ingreso y Asistencia** | Verificación en tiempo real del estado de membresía al ingresar; registro de asistencia; token/QR de acceso. | Recepción, Socio | `asistencias`, `socios` | Diseñado |
| 6 | **Panel de Control (Dashboard)** | Indicadores de gestión: socios activos, cobranza del mes, morosidad. | Administrador | `socios`, `pagos` | Diseñado |

---

## 2. Módulos deseables (a desarrollar solo si el tiempo lo permite)

| # | Módulo | Descripción | Roles | Estado |
| :-: | :--- | :--- | :--- | :--- |
| 7 | **Notificaciones** | Envío automático de recordatorios de pago y avisos de vencimiento por correo electrónico. | Socio | Diseñado |
| 8 | **Portal del Socio** | Autogestión desde el celular: consulta de vencimiento, estado de cuenta y carnet digital. | Socio | Diseñado |
| 9 | **Gestión de Rutinas** | Carga y consulta de rutinas asignadas por el profesor. | Profesor, Socio | Diseñado |
| 10 | **Reserva de Clases** | Reserva de clases con cupo limitado y lista de espera. | Socio, Profesor | Diseñado |
| 11 | **Reportes Avanzados** | Comparación de asistencia por sede y franja horaria. | Administrador | Diseñado |

Estos módulos no condicionan la Entrega Final; se evalúan según el avance del cronograma (ver "Estado de Entregas" en el [README](../README.md)).

---

## 3. Arquitectura prevista y mapeo a carpetas

Cada módulo del núcleo mínimo se traduce, en el proyecto Next.js (App Router), en una ruta y su lógica de servidor asociada:

```
/src
├── app/
│   ├── (auth)/            → Módulo 1: Autenticación y Roles
│   ├── socios/            → Módulo 2: Gestión de Socios y Sedes
│   ├── planes/            → Módulo 3: Planes y Membresías
│   ├── cobros/            → Módulo 4: Cobros y Estado de Cuenta
│   ├── ingreso/           → Módulo 5: Control de Ingreso y Asistencia
│   └── dashboard/         → Módulo 6: Panel de Control
├── lib/
│   └── supabase/          → Cliente y helpers de conexión a Supabase (transversal)
└── components/            → Componentes de UI compartidos entre módulos
```

- **Capa de presentación:** páginas y componentes React (App Router) por módulo.
- **Capa de lógica de servidor:** Server Actions / Route Handlers dentro de cada carpeta de módulo, según el patrón definido en la Propuesta (2.4 — "Ausencia de un backend separado").
- **Capa de datos:** PostgreSQL vía Supabase, según el [Esquema de Base de Datos](./ESQUEMA_BD.md).

Este mapeo se actualizará a medida que cada módulo pase de estado Diseñado a En desarrollo o Implementado.
