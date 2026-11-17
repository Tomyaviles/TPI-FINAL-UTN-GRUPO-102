import type { Database } from "@/types/database";

// Socio tal como lo usa la pantalla de cobros (con su plan)
export type SocioCobro = {
  id: string;
  nombre: string;
  apellido: string;
  dni: string;
  fecha_vencimiento: string | null;
  estado_cuota: string;
  planes: { nombre: string | null; precio: number | null } | null;
};

// Fila de la vista v_socios_morosos
export type Moroso = Database["public"]["Views"]["v_socios_morosos"]["Row"];
