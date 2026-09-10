# 🗄️ Esquema de Base de Datos — Sistema de Gestión para Gimnasios

**Materia:** Trabajo Final Integrador (UTN)  
**Grupo:** 102  
**Fecha de actualización:** Septiembre 2026  

---

## 📌 Enfoque Arquitectónico

Siguiendo las recomendaciones recibidas para optimizar los tiempos de desarrollo, el modelo de datos se diseñó bajo un esquema simplificado y eficiente mediante **Supabase (PostgreSQL)**. 

El modelo evita la sobreingeniería y las tablas intermedias innecesarias, permitiendo:
- Consultas de estado de cuota en tiempo real mediante API REST/BaaS.
- Soporte nativo para arquitectura multisede.
- Desacoplamiento entre la ficha del socio y la autenticación de usuarios.

---

## 📊 Diagrama Entidad-Relación (DER)

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
