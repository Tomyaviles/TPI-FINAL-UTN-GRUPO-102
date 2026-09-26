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
        datetime created_at
    }

    PLANES {
        uuid id PK
        string nombre
        decimal precio
        int duracion_dias
        datetime created_at
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
        datetime created_at
    }

    PAGOS {
        uuid id PK
        uuid socio_id FK
        decimal monto
        string metodo_pago
        datetime fecha_pago
        int periodo_mes
        int periodo_anio
    }

    ASISTENCIAS {
        uuid id PK
        uuid socio_id FK
        uuid sede_id FK
        datetime fecha_hora
    }
