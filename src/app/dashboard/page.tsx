import { createClient } from "@/lib/supabase/server";

// Por ahora el dashboard solo verifica la conexión con Supabase mostrando
// cuántos registros hay en cada tabla. Las métricas reales (RF-14) van acá.
export const dynamic = "force-dynamic";

const tablas = ["sedes", "planes", "socios", "pagos", "asistencias"] as const;

export default async function DashboardPage() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return (
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="mt-4 rounded border border-amber-300 bg-amber-50 p-4 text-sm">
          Falta configurar Supabase: copiá <code>.env.example</code> como{" "}
          <code>.env.local</code> y completá los datos.
        </p>
      </div>
    );
  }

  const supabase = await createClient();
  const conteos = await Promise.all(
    tablas.map(async (tabla) => {
      const { count, error } = await supabase
        .from(tabla)
        .select("*", { count: "exact", head: true });
      return { tabla, count, error: error?.message };
    })
  );

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-1 text-sm text-slate-500">
        Módulo 6 — en desarrollo. Conexión con la base:
      </p>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {conteos.map(({ tabla, count, error }) => (
          <div key={tabla} className="rounded border border-slate-200 bg-white p-4">
            <div className="text-xs uppercase text-slate-500">{tabla}</div>
            {error ? (
              <div className="mt-1 text-sm text-red-600">{error}</div>
            ) : (
              <div className="mt-1 text-2xl font-bold">{count}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
