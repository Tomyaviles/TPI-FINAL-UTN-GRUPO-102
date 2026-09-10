# TRABAJO FINAL INTEGRADOR — UTN
## 1.ª Entrega: Propuesta de Proyecto y Repositorio
**Sistema de gestión para gimnasios**

---

### Información del Grupo
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
* **Acceso y experiencia multidispositivo:** Panel completo en PC para la administración y lectura rápida adaptada a móviles para autogestión de socios (acceso a carnet/token QR) e instructores.
* **Notificaciones por correo electrónico:** Envío de avisos de vencimiento y recordatorios de pago a socios morosos para automatizar la gestión de cobro.

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

Frente a alternativas como un backend separado en Java con Spring Boot o en PHP con Laravel, Next.js permite mantener un solo repositorio, un solo lenguaje (TypeScript) y un único ciclo de despliegue. Para un equipo de dos o tres personas con un plazo acotado, esa reducción de complejidad operativa es determinante.

Respecto de la base de datos, se optó por un motor relacional y no por uno documental porque el dominio es fuertemente relacional: socios, planes, membresías, pagos e ingresos son entidades con vínculos claros y reglas de integridad que conviene hacer cumplir desde el esquema. Supabase, además de PostgreSQL administrado, aporta autenticación, almacenamiento de archivos y políticas de seguridad a nivel de fila, funcionalidades que de otro modo habría que desarrollar y mantener.

## Justificación de la Elección de Plataforma Web
Elegimos desarrollar una plataforma Web porque satisface de forma eficiente los dos perfiles principales de uso del sistema sin requerir la instalación de software local:
* **Gestión Administrativa y Multisede (PC / Tablet):** El dueño, la administración y el personal de recepción requieren pantallas completas para la toma de decisiones, visualización de métricas, reportes de facturación y carga rápida de cobros. La plataforma Web permite centralizar toda la información de múltiples sedes en tiempo real desde cualquier computadora con navegador web.
* **Autogestión en Movilidad (Socios e Instructores desde el Celular):** El socio no necesita instalar una aplicación nativa desde la tienda de aplicaciones (evitando la fricción de descarga). Puede acceder al sistema directamente desde el navegador de su teléfono para consultar su estado de cuota, vencimientos y mostrar su credencial digital.

### 2.3. ¿El stack escala adecuadamente?
Sí, para la escala planteada. El caso de uso es un gimnasio o una cadena de pocas sedes, con un volumen de operaciones moderado y previsible: altas de socios, cobros mensuales y registros de ingreso concentrados en franjas horarias pico.
* PostgreSQL soporta sin dificultad volúmenes muy superiores a los de este dominio; el crecimiento se absorbe con índices adecuados y, llegado el caso, con particionado de las tablas de mayor movimiento, como la de ingresos.
* Vercel escala la capa de aplicación de forma automática, lo que cubre bien los picos de acceso en horarios de mayor concurrencia.
* El modelo multisede se contempla desde el diseño de datos, de modo que sumar una sede sea cargar un registro y no modificar el sistema.
* El límite real no es técnico sino de plan contratado: escalar implica pasar a un nivel de servicio superior, que es una decisión de costos y no un rediseño de la arquitectura.

### 2.4. Limitaciones y riesgos identificados
| Riesgo / limitación | Mitigación prevista |
| :--- | :--- |
| **Límites del plan de Supabase** (almacenamiento, transferencia y pausado del proyecto por inactividad). | Trabajar sobre un plan de pago durante el desarrollo y realizar respaldos periódicos de la base. |
| **Dependencia de proveedores externos** (Vercel y Supabase): una caída del servicio deja el sistema fuera de línea. | Mantener la lógica de negocio en el código de la aplicación y no en funcionalidades propietarias, para poder migrar a un VPS con PostgreSQL propio si fuera necesario. |
| **Curva de aprendizaje** en las tecnologías que el equipo no domina. | Destinar las primeras semanas a una prueba de concepto acotada antes de avanzar con el desarrollo completo. |
| **Riesgo de sobredimensionar el alcance** y no llegar a la entrega final. | Definir un núcleo mínimo entregable y dejar el resto como funcionalidades deseables. |
| **Manejo de datos personales** de los socios. | Aplicar control de acceso por rol y políticas de seguridad a nivel de fila; no almacenar datos sensibles que el sistema no necesite. |
| **Ausencia de un backend separado** puede dificultar la reutilización futura desde otros clientes. | Organizar el código por capas (servicios y repositorios) y exponer la lógica mediante rutas de API bien delimitadas. |

---

## 3. Propuesta de proyecto

### 3.1. Alcance — núcleo mínimo entregable
* **Gestión de socios:** Alta, baja, modificación y consulta, con historial.
* **Planes y membresías:** Definición de planes, precios y períodos de vigencia.
* **Cobros:** Registro de pagos, cálculo automático de vencimientos y listado de morosos.
* **Control de ingreso:** Verificación mediante API del estado del socio (`activo == true` y cuota al día), generación de token/tag de ingreso en tiempo real y registro de asistencia.
* **Usuarios y roles:** Administrador, recepción y profesor, con permisos diferenciados.
* **Panel con indicadores básicos:** Socios activos, cobranza del mes y deuda acumulada.

### 3.2. Alcance — funcionalidades deseables
Se desarrollarán solo si los tiempos del proyecto lo permiten, y no condicionan la entrega final:
* Portal del socio para consultar vencimiento y estado de cuenta.
* Gestión de rutinas cargadas por el profesor.
* Reserva de clases con cupo limitado y lista de espera.
* Avisos automáticos de vencimiento.
* Reportes de asistencia por franja horaria y comparación entre sedes.

### 3.3. Plan de trabajo
| Etapa | Actividades principales | Estado / plazo |
| :--- | :--- | :--- |
| **1. Propuesta y repositorio** | Definición del problema, elección del stack, creación del repositorio y del tablero de tareas. | **Entrega 30/08/2026** |
| **2. Relevamiento y requerimientos** | Casos de uso, actores, requerimientos funcionales y no funcionales. | **31/08 al 10/09** |
| **3. Diseño** | Modelo de datos, diagrama entidad-relación, arquitectura y prototipo de interfaz. | **11/09 al 27/09** *(Entrega 2)* |
| **4. Desarrollo del núcleo** | Socios, planes, cobros, control de ingreso y roles. | **28/09 al 31/10** |
| **5. Pruebas y Calidad** | Realización de pruebas funcionales y de integración sobre los flujos críticos del sistema para garantizar la consistencia de datos en Supabase. | **01/11 al 07/11** |
| **6. Despliegue y documentación** | Publicación del sistema, manual de uso e informe final. | **08/11 al 14/11** *(Entrega Final)* |

### 3.4. Repositorio
Todo el proyecto se aloja en un repositorio único de GitHub, con trabajo por ramas e integración a la rama principal mediante pull requests.
* **Enlace:** [https://github.com/Tomyaviles/TPI-FINAL-UTN-GRUPO-102](https://github.com/Tomyaviles/TPI-FINAL-UTN-GRUPO-102)
