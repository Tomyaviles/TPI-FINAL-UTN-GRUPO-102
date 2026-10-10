# ESPECIFICACIÓN DE REQUERIMIENTOS DE SOFTWARE (ERS)

Proyecto: Sistema de Gestión para Gimnasios Multisede (Grupo 102)

# 1. Requerimientos Funcionales (RF)


## Módulo 1: Autenticación y Gestión de Roles

* RF-01 (Inicio de Sesión): El sistema debe permitir el inicio de sesión seguro de usuarios mediante correo electrónico y contraseña utilizando Supabase Auth. 

* RF-02 (Control de Roles y Permisos): El sistema debe restringir las funcionalidades y vistas según el rol asignado al usuario (Administrador, Recepción, Profesor o Socio).   

* RF-03 (Acceso Opcional para Socios): El sistema debe permitir dar de alta a un socio sin exigir la creación inmediata de una cuenta de usuario (user_id opcional) para no demorar la atención en recepción.


## Módulo 2: Gestión de Sedes y Socios

* RF-04 (Gestión Multisede): El sistema debe permitir el registro, modificación y consulta de las sedes físicas que integran la cadena de gimnasios.   
* RF-05 (Administración de Ficha de Socio): El sistema debe permitir registrar, actualizar, consultar y dar de baja la información personal del socio, incluyendo nombre, apellido, DNI único, teléfono, email, sede de pertenencia y plan contratado.   
* RF-06 (Búsqueda y Filtro de Socios): El sistema debe permitir buscar y filtrar socios de manera rápida por DNI, nombre, sede de origen o estado administrativo de su cuota.  


## Módulo 3: Planes y Membresías

* RF-07 (Gestión de Planes): El sistema debe permitir al Administrador crear y parametrizar los tipos de planes o membresías ofrecidas, indicando su nombre, precio y duración de vigencia en días (por defecto 30 días).


## Módulo 4: Cobros y Estado de Cuenta

* RF-08 (Registro de Transacciones): El sistema debe registrar las transacciones de cobro de cuotas, asociando el socio, monto abonado, método de pago ('efectivo', 'transferencia', 'mercadopago') y período correspondiente (mes y año).
* RF-09 (Actualización Automática de Vencimiento): Al registrar un pago exitoso, el sistema debe recalcular automáticamente la fecha_vencimiento y actualizar el estado_cuota del socio a 'al_dia'. 
* RF-10 (Detección de Morosidad): El sistema debe evaluar de forma continua las fechas límite y cambiar automáticamente el estado_cuota del socio a 'vencido' cuando la fecha actual supere su fecha_vencimiento. 


## Módulo 5: Control de Ingreso y Asistencia

* RF-11 (Validación de Acceso en Puerta): El sistema debe verificar en tiempo real el estado administrativo del socio (estado_cuota == 'al_dia') antes de autorizar el ingreso en el punto de acceso.   
* RF-12 (Registro de Asistencia Multisede): El sistema debe registrar cada evento de ingreso almacenando el socio, la sede física donde ocurre la validación y la fecha y hora exacta (fecha_hora).   
* RF-13 (Generación de Credencial/Token): El sistema debe permitir la emisión de un token o código QR de acceso dinámico para la validación de entrada.


## Módulo 6: Panel de Control e Indicadores (Dashboard)
* RF-14 (Visualización de Métricas de Negocio): El sistema debe consolidar y mostrar al Administrador indicadores clave en tiempo real: total de socios activos, recaudación del mes actual y cantidad o monto total acumulado por socios morosos.


## Módulos Futuros / Deseables

* RF-15 (Avisos por Correo): El sistema debe permitir el envío automático de avisos de vencimiento y recordatorios de cobro vía correo electrónico a los socios.   
* RF-16 (Portal de Autogestión del Socio): El sistema debe permitir a los socios ingresar desde sus dispositivos móviles para consultar el estado de su cuota, la fecha de vencimiento y su carnet digital.   
* RF-17 (Asignación de Rutinas): El sistema debe permitir a los profesores crear y asignar rutinas de entrenamiento personalizadas a los socios.   
* RF-18 (Reserva de Clases): El sistema debe gestionar la reserva de clases con control de cupos máximos y lista de espera.



# Requerimientos No Funcionales (RNF)



## Rendimiento y Eficiencia

* RNF-01 (Tiempo de Respuesta en Control de Acceso): El tiempo de respuesta de la API de validación de ingreso en recepción/puerta no debe superar los 500 milisegundos por solicitud bajo condiciones operativas normales.   
* RNF-02 (Carga de Vistas Administrativas): El tiempo de carga e hidratación del Dashboard principal y del listado general de socios no debe exceder los 2 segundos.


## Seguridad y Protección de Datos.   

* RNF-03 (Cifrado de Comunicaciones): Toda la transferencia de datos entre el navegador/móvil y los servidores de Next.js / Supabase debe realizarse mediante protocolo HTTPS con cifrado TLS 1.3.   
* RNF-04 (Integridad Referencial de Datos): La base de datos debe garantizar la integridad de las relaciones mediante claves foráneas y reglas de borrado en cascada (ON DELETE CASCADE) en tablas hijas como pagos y asistencias. 


## Disponibilidad y Escalabilidad

* RNF-05 (Disponibilidad del Servicio): El sistema debe alcanzar un nivel de disponibilidad de al menos el 99.5% durante el horario de atención de los gimnasios.
* RNF-06 (Escalabilidad Multisede): El diseño del esquema de datos y de la arquitectura de la aplicación debe permitir incorporar nuevas sedes físicas sin necesidad de reestructurar el código fuente.


## Usabilidad y Adaptabilidad

*RNF-07 (Diseño Responsive y Multidipositivo): La interfaz de usuario desarrollada con Tailwind CSS debe adaptarse automáticamente a pantallas de escritorio (PC/Tablet para gestión administrativa) y a pantallas de dispositivos móviles (para autogestión de socios e instructores).   
* RNF-08 (Eficiencia de Operación en Recepción): La interfaz de control de acceso debe diseñarse de modo que el personal de recepción pueda verificar y autorizar el ingreso de un socio en un máximo de 2 acciones (clics o lecturas).   


## Arquitectura y Mantenibilidad

* RNF-09 (Estructura Unificada de Repositorio): El sistema debe ser desarrollado en un repositorio único integrando Frontend y Backend con Next.js (App Router) y TypeScript para simplificar el ciclo de integración y despliegue continuo.





