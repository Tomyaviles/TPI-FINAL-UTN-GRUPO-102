# 📚 TRABAJO FINAL INTEGRADOR — UTN
## 1.ª Entrega: Propuesta de Proyecto y Repositorio
**Sistema de gestión para gimnasios**

---

### 📋 Información del Grupo
* **Integrantes:** Franco Siri | Tomás Avilés | Israel García
* **Tutor asignado:** Gerardo A. Herrera Molas
* **Repositorio único:** [https://github.com/Tomyaviles/TPI-FINAL-UTN-GRUPO-102](https://github.com/Tomyaviles/TPI-FINAL-UTN-GRUPO-102)
* **Fecha de entrega:** 30/08/2026

---

## 1. Actividad de reflexión: el proceso elegido
El proceso analizado es la administración de socios y cobros mensuales en gimnasios, incluidos aquellos que funcionan como cadena con más de una sede. Es un proceso que hoy, en la mayoría de los establecimientos chicos y medianos, se resuelve con planillas de cálculo, cuadernos de recepción y mensajes de WhatsApp.

### 1.1. ¿Quiénes son los actores involucrados?
* **Dueño o gerente de la cadena:** Necesita ver el estado del negocio de forma consolidada, entre todas las sedes.
* **Administrador de sede:** Gestiona altas y bajas de socios, planes, precios y reclamos de deuda.
* **Personal de recepción:** Controla el ingreso, registra pagos y responde consultas en el mostrador.
* **Profesores e instructores:** Asignan rutinas y dictan clases con cupo limitado.
* **Socios:** Quieren saber cuándo vence su cuota, cómo pagar y qué rutina les corresponde, sin depender del horario de atención.

### 1.2. ¿Cuál es el problema central y su impacto?
El problema central es la falta de control sobre los pagos mensuales y sobre el estado real de cada socio. Sin un sistema, la información queda repartida entre planillas, papeles y la memoria del personal, y nadie tiene una única fuente de verdad.

**El impacto se ve en varios frentes:**
* **Pérdida de ingresos:** Socios con la cuota vencida siguen entrenando porque en la puerta no hay forma rápida de verificarlo.
* **Trabajo administrativo evitable:** Recalcular vencimientos y armar listados de morosos consume horas todos los meses.
* **Bajas silenciosas:** El socio deja de venir y el gimnasio se entera tarde, cuando ya no hay margen para retenerlo.
* **Errores y conflictos:** Cobros duplicados, fechas mal cargadas y discusiones en el mostrador que desgastan la relación con el cliente.
* **Imposibilidad de decidir con datos:** El dueño no puede comparar sedes, franjas horarias ni evolución de la facturación.

### 1.3. ¿Qué valor agrega una solución tecnológica?
Una planilla puede guardar datos, pero no puede reaccionar a ellos. El valor diferencial del sistema está en lo que las herramientas convencionales no hacen:
* Estado de la membresía calculado en tiempo real y verificable en el momento del ingreso, sin intervención manual.
* Avisos automáticos de vencimiento al socio, antes de que se convierta en deuda.
* Acceso concurrente y multiusuario: varias sedes y varios operadores trabajando sobre los mismos datos, sin versiones duplicadas del archivo.
* Trazabilidad: queda registrado quién cobró, cuándo y cuánto, y quién ingresó a cada sede en cada momento.
* Autogestión del socio desde el celular, lo que descarga al personal de recepción.
* Escalabilidad funcional: la misma base habilita, más adelante, la gestión de rutinas, la reserva de clases con cupo y los indicadores de asistencia.

---

## 2. Actividad de reflexión: decisiones tecnológicas

### 2.1. Tecnologías elegidas
| Capa | Tecnología | Justificación breve |
| :--- | :--- | :--- |
| **Frontend** | Next.js (App Router) + React + TypeScript | Renderizado híbrido, buen rendimiento y tipado estático. |
| **Estilos / UI** | Tailwind CSS | Desarrollo rápido de interfaz y diseño responsive. |
| **Backend** | Route Handlers y Server Actions de Next.js (Node.js) | Un único proyecto para front y back, con lógica de negocio del lado del servidor. |
| **Base de datos** | PostgreSQL (Supabase) | Motor relacional maduro, adecuado para un modelo con integridad referencial. |
| **Autenticación** | Supabase Auth | Gestión de usuarios y roles ya resuelta, sin implementar sesiones desde cero. |
| **Despliegue** | Vercel (aplicación) + Supabase (base de datos) | Integración continua desde GitHub y despliegue automático por rama. |
| **Control de versiones** | Git + GitHub (repositorio único) | Requisito de la cátedra y trabajo colaborativo entre integrantes. |

### 2.2. ¿Por qué este stack y no otro?
La elección combina dos criterios. Por un lado, aprovechar tecnologías que el equipo ya maneja, lo que reduce el riesgo de no llegar con los plazos del cuatrimestre. Por otro, incorporar herramientas nuevas que representan un desafío de aprendizaje concreto, que es parte del sentido del trabajo final.

Frente a alternativas como un backend separado en Java con Spring Boot o en PHP con Laravel, Next.js permite mantener un solo repositorio, un solo lenguaje (TypeScript) y un único ciclo de despliegue. Para un equipo de tres personas con un plazo acotado, esa reducción de complejidad operativa es determinante.

Respecto de la base de datos, se optó por un motor relacional y no por uno documental porque el dominio es fuertemente relacional: socios, planes, membresías, pagos e ingresos son entidades con vínculos claros y reglas de integridad que conviene hacer cumplir desde el esquema. Supabase, además de PostgreSQL administrado, aporta autenticación, almacenamiento de archivos y políticas de seguridad a nivel de fila.

### 2.3. ¿El stack escala adecuadamente?
Sí, para la escala planteada. El caso de uso es un gimnasio o una cadena de pocas sedes, con un volumen de operaciones moderado y previsible.
* PostgreSQL soporta sin dificultad volúmenes superiores a los de este dominio; el crecimiento se absorbe con índices adecuados.
* Vercel escala la capa de aplicación de forma automática, cubriendo los picos de acceso en horarios de concurrencia.
* El modelo multisede se contempla desde el diseño de datos.

### 2.4. Limitaciones y riesgos identificados
| Riesgo / limitación | Mitigación prevista |
| :--- | :--- |
| Límites del plan de Supabase (almacenamiento y pausado por inactividad). | Trabajar sobre un plan pago durante el desarrollo y realizar respaldos periódicos. |
| Dependencia de proveedores externos (Vercel/Supabase). | Mantener la lógica de negocio desacoplada para permitir migrar a un VPS propio si fuera necesario. |
| Curva de aprendizaje en tecnologías nuevas. | Realizar una prueba de concepto acotada al inicio. |
| Riesgo de sobredimensionar el alcance. | Definir un núcleo mínimo entregable (MVP) bien delimitado. |
| Manejo de datos personales de socios. | Aplicar control de acceso por rol y políticas RLS. |
| Ausencia de backend separado. | Organizar el código por capas (servicios y repositorios) expuestos en rutas de API. |

---

## 3. Propuesta de proyecto

### 3.1. Alcance: Núcleo Mínimo Entregable (MVP)
* **Gestión de socios:** Alta, baja, modificación y consulta con historial.
* **Planes y membresías:** Definición de planes, precios y períodos de vigencia.
* **Cobros:** Registro de pagos, cálculo automático de vencimientos y listado de morosos.
* **Control de ingreso:** Verificación del estado del socio al momento de entrar y registro de asistencia.
* **Usuarios y roles:** Administrador, recepción y profesor, con permisos diferenciados.
* **Panel con indicadores básicos:** Socios activos, cobranza del mes y deuda acumulada.

### 3.2. Alcance: Funcionalidades Deseables
* Portal del socio para consultar vencimiento y estado de cuenta.
* Gestión de rutinas cargadas por el profesor.
* Reserva de clases con cupo limitado y lista de espera.
* Avisos automáticos de vencimiento.
* Reportes de asistencia por franja horaria y comparación entre sedes.

### 3.3. Plan de trabajo
| Etapa | Actividades principales | Estado / Plazo |
| :--- | :--- | :--- |
| **1. Propuesta y repositorio** | Definición del problema, elección del stack, creación del repositorio y tablero. | **Entrega 30/08/2026** |
| **2. Relevamiento y requerimientos** | Casos de uso, actores, requerimientos funcionales y no funcionales. | **31/08 al 10/09** |
| **3. Diseño** | Modelo de datos, ERD, arquitectura y prototipo de interfaz. | **11/09 al 27/09** *(Entrega 2)* |
| **4. Desarrollo del núcleo** | Módulos de socios, planes, cobros, control de ingreso y roles. | **28/09 al 31/10** |
| **5. Pruebas** | Pruebas funcionales, integraciones y corrección de errores. | **01/11 al 07/11** |
| **6. Despliegue y documentación** | Publicación del sistema, manual de uso, video e informe final. | **08/11 al 14/11** *(Entrega Final)* |

### 3.4. Repositorio
Todo el proyecto se aloja en un repositorio único de GitHub, con trabajo por ramas e integración a la rama principal mediante Pull Requests.
* **URL:** [https://github.com/Tomyaviles/TPI-FINAL-UTN-GRUPO-102](https://github.com/Tomyaviles/TPI-FINAL-UTN-GRUPO-102)
