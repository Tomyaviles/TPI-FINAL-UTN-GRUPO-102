import type { Pago, Plan, Socio } from "@/types/database";

// Cálculos del dashboard (RF-14).
// Reciben los datos ya traídos de la base y devuelven números, nada más.

// Solo los campos que usamos, así la consulta trae menos datos
export type SocioResumen = Pick<Socio, "id" | "sede_id" | "plan_id" | "estado_cuota">;
export type PagoResumen = Pick<Pago, "socio_id" | "monto">;
export type PlanResumen = Pick<Plan, "id" | "precio">;

// Si se eligió una sede deja solo sus socios; si no, devuelve todos
export function filtrarPorSede(socios: SocioResumen[], sedeId: string | null) {
  if (!sedeId) return socios;
  return socios.filter((s) => s.sede_id === sedeId);
}

// Socio activo = tiene la cuota al día
export function contarActivos(socios: SocioResumen[]) {
  return socios.filter((s) => s.estado_cuota === "al_dia").length;
}

// Suma los pagos, pero solo de los socios que se pasan (para el filtro por sede)
export function sumarRecaudacion(pagos: PagoResumen[], socios: SocioResumen[]) {
  const ids = new Set(socios.map((s) => s.id));
  let total = 0;
  for (const pago of pagos) {
    if (ids.has(pago.socio_id)) total += Number(pago.monto);
  }
  return total;
}

// Moroso = cuota vencida o suspendido.
// El monto es lo que debería pagar cada uno según su plan (una cuota).
// Si no tiene plan asignado cuenta como moroso pero suma 0.
export function calcularMorosos(socios: SocioResumen[], planes: PlanResumen[]) {
  const morosos = socios.filter(
    (s) => s.estado_cuota === "vencido" || s.estado_cuota === "suspendido"
  );

  let monto = 0;
  for (const socio of morosos) {
    const plan = planes.find((p) => p.id === socio.plan_id);
    if (plan) monto += Number(plan.precio);
  }

  return { cantidad: morosos.length, monto };
}

// Fecha del primer día del mes actual, para filtrar los pagos del mes
export function inicioDelMes(hoy = new Date()) {
  return new Date(hoy.getFullYear(), hoy.getMonth(), 1).toISOString();
}

// 35000 -> "$ 35.000"
export function formatearPesos(monto: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(monto);
}
