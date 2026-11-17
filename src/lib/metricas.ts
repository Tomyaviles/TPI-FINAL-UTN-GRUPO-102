import type { Pago, Plan, Socio } from "@/types/database";

// Cálculos del dashboard (RF-14).
// Reciben los datos ya traídos de la base y devuelven números, nada más.

// Solo los campos que usamos, así la consulta trae menos datos
export type SocioResumen = Pick<
  Socio,
  "id" | "sede_id" | "plan_id" | "estado_cuota" | "fecha_vencimiento"
>;
export type PagoResumen = Pick<Pago, "socio_id" | "monto">;
export type PlanResumen = Pick<Plan, "id" | "precio">;

// Si se eligió una sede deja solo sus socios; si no, devuelve todos
export function filtrarPorSede(socios: SocioResumen[], sedeId: string | null) {
  if (!sedeId) return socios;
  return socios.filter((s) => s.sede_id === sedeId);
}

// Fecha de hoy en Argentina como texto "2026-11-17",
// el mismo formato que fecha_vencimiento, así se pueden comparar
export function hoyComoTexto() {
  return new Date().toLocaleDateString("en-CA", {
    timeZone: "America/Argentina/Buenos_Aires",
  });
}

// Moroso = suspendido, sin fecha de vencimiento o con la fecha ya pasada (RF-10).
// Se mira la fecha y no solo estado_cuota, porque nadie pasa ese campo
// a 'vencido' cuando se cumple el plazo.
export function esMoroso(socio: SocioResumen, hoy: string) {
  if (socio.estado_cuota === "suspendido") return true;
  if (!socio.fecha_vencimiento) return true;
  return socio.fecha_vencimiento < hoy;
}

// Socio activo = el que no es moroso
export function contarActivos(socios: SocioResumen[], hoy: string) {
  return socios.filter((s) => !esMoroso(s, hoy)).length;
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

// El monto es lo que debería pagar cada moroso según su plan (una cuota).
// Si no tiene plan asignado cuenta como moroso pero suma 0.
export function calcularMorosos(socios: SocioResumen[], planes: PlanResumen[], hoy: string) {
  const morosos = socios.filter((s) => esMoroso(s, hoy));

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
