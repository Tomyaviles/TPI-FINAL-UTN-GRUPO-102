# Listado de Módulos — Sistema de Gestión para Gimnasios

**Materia:** Trabajo Final Integrador (UTN)  
**Grupo:** 102  
**Etapa:** Diseño — Arquitectura y Módulos (11/09 al 27/09)

---

## Criterio de Modularización

El sistema se organiza en módulos funcionales, cada uno alineado a un actor o proceso de negocio identificado en la Propuesta de Proyecto. Cada módulo se corresponde con una o más entidades del Esquema de Base de Datos y, en la implementación, con una carpeta propia dentro de `/src`[cite: 4].

**Estados posibles:** 
* `Diseñado`: Definido en esquema/alcance, código aún no iniciado.
* `En desarrollo`: Scaffolding o código parcial subido al repositorio.
* `Implementado`: Funcional de punta a punta.

---

## 1. Módulos del Núcleo Mínimo Entregable

| # | Módulo | Descripción | Roles | Entidades Relacionadas | Estado |
|---|---|---|---|---|---|
| **1** | **Autenticación y Roles** | Inicio de sesión y permisos diferenciados por rol, usando Supabase Auth. | Todos | `auth.users` | Diseñado |
| **2** | **Gestión de Socios y Sedes** | Alta, baja, modificación y consulta de socios; vinculación a sede; búsqueda por DNI/nombre/estado. | Administrador, Recepción | `sedes`, `socios` | Diseñado |
| **3** | **Planes y Membresías** | Definición de planes, precios y duración de vigencia. | Administrador | `planes` | Diseñado |
| **4** | **Cobros y Estado de Cuenta** | Registro de pagos, cálculo automático de vencimiento y detección de morosos. | Administrador, Recepción | `pagos`, `socios` | Diseñado |
| **5** | **Control de Ingreso y Asistencia** | Verificación en tiempo real del estado de membresía al ingresar; registro de asistencia; token/QR de acceso. | Recepción, Socio | `asistencias`, `socios` | Diseñado |
| **6** | **Panel de Control (Dashboard)** | Indicadores de gestión: socios activos, cobranza del mes, morosidad. | Administrador | `socios`, `pagos` | Diseñado |

---

## 2. Módulos Deseables

*(A desarrollar solo si los tiempos del proyecto lo permiten)*

| # | Módulo | Descripción | Roles | Estado |
|---|---|---|---|---|
| **7** | **Notificaciones** | Envío automático de recordatorios de pago y avisos de vencimiento por correo electrónico. | Socio | Diseñado |
| **8** | **Portal del Socio** | Autogestión desde el celular: consulta de vencimiento, estado de cuenta y carnet digital. | Socio | Diseñado |
| **9** | **Gestión de Rutinas** | Carga y consulta de rutinas asignadas por el profesor. | Profesor, Socio | Diseñado |
| **10** | **Reserva de Clases** | Reserva de clases con cupo limitado y lista de espera. | Socio, Profesor | Diseñado |
| **11** | **Reportes Avanzados** | Comparación de asistencia por sede y franja horaria. | Administrador | Diseñado |

---

## 3. Arquitectura Prevista y Mapeo a Carpetas

Cada módulo del núcleo mínimo se traduce, en el proyecto Next.js (App Router), en una ruta y su lógica de servidor asociada:

```text
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
