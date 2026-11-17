import { requerirRol } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import {
  calcularMorosos,
  contarActivos,
  filtrarPorSede,
  formatearPesos,
  inicioDelMes,
  sumarRecaudacion,
} from "@/lib/metricas";

// Módulo 6: indicadores para el admin (RF-14).
// La sede elegida viaja en la URL (?sede=id), así el filtro funciona sin JS
// y se puede compartir el link.
export const dynamic = "force-dynamic";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ sede?: string }>;
}) {
  await requerirRol(["admin"]);
  const { sede } = await searchParams;
  const sedeId = sede || null;

  const supabase = await createClient();

  // Traemos todo en paralelo y después calculamos en JS
  const [sedesRes, sociosRes, planesRes, pagosRes] = await Promise.all([
    supabase.from("sedes").select("id, nombre").order("nombre"),
    supabase.from("socios").select("id, sede_id, plan_id, estado_cuota"),
    supabase.from("planes").select("id, precio"),
    supabase.from("pagos").select("socio_id, monto").gte("fecha_pago", inicioDelMes()),
  ]);

  const error = sedesRes.error ?? sociosRes.error ?? planesRes.error ?? pagosRes.error;
  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="mt-4 rounded bg-red-50 p-3 text-sm text-red-700">
          No se pudieron cargar los datos: {error.message}
        </p>
      </div>
    );
  }

  const sedes = sedesRes.data ?? [];
  const socios = filtrarPorSede(sociosRes.data ?? [], sedeId);
  const activos = contarActivos(socios);
  const recaudacion = sumarRecaudacion(pagosRes.data ?? [], socios);
  const morosos = calcularMorosos(socios, planesRes.data ?? []);

  const tarjetas = [
    { titulo: "Socios activos", valor: String(activos), detalle: `de ${socios.length} socios` },
    { titulo: "Recaudación del mes", valor: formatearPesos(recaudacion), detalle: "pagos desde el día 1" },
    { titulo: "Morosos", valor: String(morosos.cantidad), detalle: "vencidos o suspendidos" },
    { titulo: "Monto adeudado", valor: formatearPesos(morosos.monto), detalle: "una cuota por moroso" },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">Indicadores del gimnasio</p>
        </div>

        {/* Formulario GET: al cambiar la sede recarga la página con ?sede=... */}
        <form className="flex items-end gap-2">
          <label className="text-sm">
            Sede
            <select
              name="sede"
              defaultValue={sedeId ?? ""}
              className="mt-1 block rounded border border-slate-300 bg-white px-3 py-2 text-sm"
            >
              <option value="">Todas las sedes</option>
              {sedes.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nombre}
                </option>
              ))}
            </select>
          </label>
          <button
            type="submit"
            className="rounded bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Filtrar
          </button>
        </form>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tarjetas.map((t) => (
          <div key={t.titulo} className="rounded border border-slate-200 bg-white p-4">
            <div className="text-xs uppercase text-slate-500">{t.titulo}</div>
            <div className="mt-2 text-3xl font-bold">{t.valor}</div>
            <div className="mt-1 text-xs text-slate-400">{t.detalle}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
