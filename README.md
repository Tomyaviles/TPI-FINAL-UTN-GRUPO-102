# 🏋️‍♂️ Sistema de Gestión para Gimnasios (Multisede) — TPI UTN

Trabajo Final Integrador para la Tecnicatura Universitaria en Programación a Distancia (UTN).

---

## 👥 Integrantes (Grupo 102)
* **Franco Siri**
* **Tomás Avilés**
* **Israel García**

**Tutor asignado:** Gerardo A. Herrera Molas  
**Fecha de inicio:** Agosto 2026  
**Repositorio:** [TPI-FINAL-UTN-GRUPO-102](https://github.com/Tomyaviles/TPI-FINAL-UTN-GRUPO-102)

---

## 📌 Descripción del Proyecto
Sistema web multisede enfocado en la administración integral de gimnasios. La solución permite centralizar el control de socios, la gestión de planes y cuotas mensuales, el registro automatizado de vencimientos y el control de ingresos/asistencia en tiempo real, adaptándose tanto a la administración general como a la autogestión de socios desde dispositivos móviles.

---

## 🚀 Funcionalidades del Sistema

### 1. Autenticación y Gestión de Roles
- Inicio de sesión y permisos diferenciados según el rol: **Administrador**, **Recepción**, **Profesores** y **Socios**.
- Gestión de sesiones y seguridad de usuarios con Supabase Auth.

### 2. Gestión de Socios y Sedes
- Alta, baja, modificación y consulta de información personal de socios.
- Vinculación de socios y operadores a sedes específicas (soporte multisede).
- Búsqueda avanzada y filtrado dinámico por DNI, nombre o estado de cuenta.

### 3. Membresías, Cobros y Notificaciones
- Administración de planes, tarifas y períodos de vigencia.
- Registro de pagos de cuotas y cálculo automático de fechas de vencimiento.
- Identificación instantánea de socios morosos y estado de cuenta.
- Envíos automatizados de recordatorios de cobro y avisos de vencimiento por correo electrónico.

### 4. Control de Ingreso y Asistencia
- Verificación del estado de la membresía en tiempo real mediante API al momento del acceso.
- Registro automatizado de ingresos y asistencias discriminados por sede y franja horaria.
- Generación de carnet digital / token QR para autogestión y validación en puerta.

### 5. Panel de Control (Dashboard)
- Indicadores básicos de gestión: total de socios activos, cobranza acumulada del mes y métricas de morosidad.

---

## 🛠️ Stack Tecnológico
* **Frontend:** Next.js (App Router) + React + TypeScript
* **Estilos / UI:** Tailwind CSS
* **Backend:** Next.js Route Handlers / Server Actions (Node.js)
* **Base de Datos & Auth:** PostgreSQL (Supabase) + Supabase Auth
* **Despliegue:** Vercel (Aplicación) + Supabase (Base de datos)
* **Control de Versiones:** Git + GitHub

---

## 📂 Estructura del Repositorio
* [`/docs`](./docs): Documentación técnica, propuesta inicial e informes del proyecto.
* `/src`: Código fuente de la aplicación *(en desarrollo)*.

---

## 📅 Estado de Entregas y Cronograma
- [x] **1.ª Entrega (30/08):** Propuesta de proyecto, stack tecnológico y repositorio inicial.
- [ ] **2.ª Entrega (27/09):** Esquema de base de datos y listado de módulos aprobados (Regularidad).
- [ ] **Entrega Final (14/11):** Repositorio completo, servicio en la nube activo, informe y video explicativo.