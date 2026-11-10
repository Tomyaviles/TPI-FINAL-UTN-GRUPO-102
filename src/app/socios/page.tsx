
import Link from "next/link";
import { requerirRol } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import SocioForm from "@/components/socios/SocioForm";
import type { EstadoCuota } from "@/types/database";

type SearchParams = {
  q?: string;
  sede?: string;
  estado?: string;
  mensaje?: string;
  error?: string;
};

type Props = {
  searchParams: Promise<SearchParams>;
};

const nombresEstado: Record<EstadoCuota, string> = {
  al_dia: "Al día",
  vencido: "Vencido",
  suspendido: "Suspendido",
};

const coloresEstado: Record<EstadoCuota, string> = {
  al_dia: "bg-green-100 text-green-800",
  vencido: "bg-amber-100 text-amber-800",
  suspendido: "bg-red-100 text-red-800",
};

export default async function SociosPage({
  searchParams,
}: Props) {
  await requerirRol(["admin"]);

  const params = await searchParams;
  const supabase = await createClient();

  // Obtener sedes y planes desde Supabase.
  const [
    { data: sedes, error: sedesError },
    { data: planes, error: planesError },
  ] = await Promise.all([
    supabase
      .from("sedes")
      .select("*")
      .order("nombre", { ascending: true }),
    supabase
      .from("planes")
      .select("*")
      .order("nombre", { ascending: true }),
  ]);

  // Parámetros de búsqueda.
  const busqueda = (params.q ?? "").trim().slice(0, 100);
  const sedeSeleccionada = params.sede ?? "";
  const estadoSeleccionado = params.estado ?? "";

  // Construir consulta de socios.
  let consulta = supabase
    .from("socios")
    .select(
      "id, nombre, apellido, dni, email, telefono, sede_id, plan_id, fecha_vencimiento, estado_cuota, created_at"
    )
    .order("created_at", { ascending: false });

  // Búsqueda por nombre, apellido o DNI.
  if (busqueda) {
    const termino = busqueda.replace(/[(),.%]/g, "");

    if (termino) {
      consulta = consulta.or(
        `nombre.ilike.%${termino}%,apellido.ilike.%${termino}%,dni.ilike.%${termino}%`
      );
    }
  }

  // Filtro por sede.
  if (sedeSeleccionada) {
    consulta = consulta.eq("sede_id", sedeSeleccionada);
  }

  // Filtro por estado de cuota.
  if (
    estadoSeleccionado === "al_dia" ||
    estadoSeleccionado === "vencido" ||
    estadoSeleccionado === "suspendido"
  ) {
    consulta = consulta.eq(
      "estado_cuota",
      estadoSeleccionado
    );
  }

  const {
    data: socios,
    error: sociosError,
  } = await consulta;

  // Mapas para mostrar nombres en lugar de UUID.
  const nombresSedes = new Map(
    (sedes ?? []).map((sede) => [
      sede.id,
      sede.nombre,
    ])
  );

  const nombresPlanes = new Map(
    (planes ?? []).map((plan) => [
      plan.id,
      plan.nombre,
    ])
  );

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* ENCABEZADO */}
      <header>
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
          Administración / Socios
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Gestión de socios
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Registrá, consultá y administrá los socios
          del gimnasio.
        </p>
      </header>

      {/* MENSAJES */}
      {params.mensaje && (
        <div
          role="status"
          className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800"
        >
          {params.mensaje}
        </div>
      )}

      {params.error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800"
        >
          {params.error}
        </div>
      )}

      {/* REGISTRO DE SOCIOS */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">
          Registrar nuevo socio
        </h2>

        <p className="mb-6 mt-1 text-sm text-slate-500">
          Completá los datos del socio. Los campos
          marcados con * son obligatorios.
        </p>

        {sedesError || planesError ? (
          <p
            role="alert"
            className="text-sm text-red-700"
          >
            No se pudieron cargar las sedes o los planes.
            Verificá la conexión con Supabase.
          </p>
        ) : (
          <SocioForm
            sedes={sedes ?? []}
            planes={planes ?? []}
          />
        )}
      </section>

      {/* BUSCADOR Y FILTROS */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">
          Buscar y filtrar socios
        </h2>

        <form
          method="GET"
          className="mt-5 grid gap-4 md:grid-cols-4"
        >
          <label className="text-sm font-medium text-slate-700">
            Nombre, apellido o DNI

            <input
              type="search"
              name="q"
              defaultValue={busqueda}
              placeholder="Buscar socio..."
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </label>

          <label className="text-sm font-medium text-slate-700">
            Sede

            <select
              name="sede"
              defaultValue={sedeSeleccionada}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            >
              <option value="">
                Todas las sedes
              </option>

              {(sedes ?? []).map((sede) => (
                <option
                  key={sede.id}
                  value={sede.id}
                >
                  {sede.nombre}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm font-medium text-slate-700">
            Estado de cuota

            <select
              name="estado"
              defaultValue={estadoSeleccionado}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            >
              <option value="">
                Todos los estados
              </option>
              <option value="al_dia">
                Al día
              </option>
              <option value="vencido">
                Vencido
              </option>
              <option value="suspendido">
                Suspendido
              </option>
            </select>
          </label>

          <div className="flex items-end gap-2">
            <button
              type="submit"
              className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
            >
              Buscar
            </button>

            <Link
              href="/socios"
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              Limpiar
            </Link>
          </div>
        </form>
      </section>

      {/* LISTADO DE SOCIOS */}
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-6">
          <h2 className="text-xl font-semibold text-slate-900">
            Socios registrados
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {sociosError
              ? "Error al consultar los socios."
              : `${socios?.length ?? 0} resultados encontrados`}
          </p>
        </div>

        {sociosError ? (
          <p
            role="alert"
            className="p-6 text-sm text-red-700"
          >
            No se pudo obtener el listado de socios.
          </p>
        ) : !socios?.length ? (
          <p className="p-8 text-center text-sm text-slate-500">
            No se encontraron socios registrados.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3">
                    Socio
                  </th>
                  <th className="px-5 py-3">
                    DNI
                  </th>
                  <th className="px-5 py-3">
                    Sede
                  </th>
                  <th className="px-5 py-3">
                    Plan
                  </th>
                  <th className="px-5 py-3">
                    Estado
                  </th>
                  <th className="px-5 py-3">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {socios.map((socio) => {
                  const estado =
                    socio.estado_cuota as EstadoCuota;

                  return (
                    <tr
                      key={socio.id}
                      className="hover:bg-slate-50"
                    >
                      <td className="px-5 py-4 font-medium text-slate-900">
                        {socio.nombre} {socio.apellido}
                      </td>

                      <td className="px-5 py-4">
                        {socio.dni}
                      </td>

                      <td className="px-5 py-4">
                        {nombresSedes.get(
                          socio.sede_id ?? ""
                        ) ?? "Sin sede"}
                      </td>

                      <td className="px-5 py-4">
                        {nombresPlanes.get(
                          socio.plan_id ?? ""
                        ) ?? "Sin plan"}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            coloresEstado[estado] ??
                            "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {nombresEstado[estado] ?? estado}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <Link
                          href={`/socios/${socio.id}`}
                          className="font-semibold text-blue-700 hover:underline"
                        >
                          Ver / Editar
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
