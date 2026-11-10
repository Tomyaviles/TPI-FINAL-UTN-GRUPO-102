// Tipos de la base de datos.
// Escritos a mano a partir de supabase/migrations. Cuando el proyecto esté
// vinculado se pueden regenerar con: npm run db:types

export type EstadoCuota = "al_dia" | "vencido" | "suspendido";
export type MetodoPago = "efectivo" | "transferencia" | "mercadopago";
export type Rol = "admin" | "recepcion" | "profesor" | "socio";

type Tabla<Row, Requeridos extends keyof Row> = {
  Row: Row;
  Insert: Partial<Row> & Pick<Row, Requeridos>;
  Update: Partial<Row>;
  Relationships: [];
};

export type Sede = {
  id: string;
  nombre: string;
  direccion: string | null;
  created_at: string;
};

export type Plan = {
  id: string;
  nombre: string;
  precio: number;
  duracion_dias: number;
  created_at: string;
};

export type Socio = {
  id: string;
  user_id: string | null;
  nombre: string;
  apellido: string;
  dni: string;
  email: string | null;
  telefono: string | null;
  sede_id: string | null;
  plan_id: string | null;
  fecha_vencimiento: string | null;
  estado_cuota: EstadoCuota;
  created_at: string;
};

export type Pago = {
  id: string;
  socio_id: string;
  monto: number;
  metodo_pago: MetodoPago;
  fecha_pago: string;
  periodo_mes: number | null;
  periodo_anio: number | null;
};

export type Asistencia = {
  id: string;
  socio_id: string;
  sede_id: string | null;
  fecha_hora: string;
};

export type Perfil = {
  id: string;
  nombre: string | null;
  rol: Rol;
  sede_id: string | null;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      sedes: Tabla<Sede, "nombre">;
      planes: Tabla<Plan, "nombre" | "precio">;
      socios: Tabla<Socio, "nombre" | "apellido" | "dni">;
      pagos: Tabla<Pago, "socio_id" | "monto" | "metodo_pago">;
      asistencias: Tabla<Asistencia, "socio_id">;
      perfiles: Tabla<Perfil, "id" | "rol">;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
