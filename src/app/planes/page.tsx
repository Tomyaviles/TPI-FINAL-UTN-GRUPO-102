
import { requerirRol } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { crearPlan, actualizarPlan } from "./actions";
import PlanDeleteButton from "@/components/planes/PlanDeleteButton";

type Plan = {
  id: string;
  nombre: string;
  precio: number;
  duracion_dias: number;
  created_at: string;
};

type Props = {
  searchParams: Promise<{
    mensaje?: string;
    error?: string;
  }>;
};

const formatoMoneda = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
});

export default async function PlanesPage({ searchParams }: Props) {
  // Solo los administradores pueden gestionar planes.
  await requerirRol(["admin"]);

  const supabase = await createClient();

  // Consultamos los planes y los parámetros de la URL.
  const [{ data, error }, params] = await Promise.all([
    supabase
      .from("planes")
      .select("id, nombre, precio, duracion_dias, created_at")
      .order("created_at", { ascending: false }),
    searchParams,
  ]);

  const planes: Plan[] = data ?? [];

  return (
    <main className="mx-auto max-w-6xl space-y-8 p-6">
      {/* ENCABEZADO */}
      <header>
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
          Administración / Membresías
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Planes y membresías
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Administrá los planes disponibles, sus precios y su duración.
        </p>
      </header>

      {/* MENSAJES DE RESULTADO */}
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

      {/* FORMULARIO DE ALTA */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">
          Registrar nuevo plan
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Completá los datos para crear una nueva membresía.
        </p>

        <form
          action={crearPlan}
          className="mt-6 grid gap-4 md:grid-cols-3"
        >
          <label className="text-sm font-medium text-slate-700">
            Nombre del plan

            <input
              name="nombre"
              type="text"
              required
              maxLength={100}
              placeholder="Ej. Plan mensual"
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-600"
            />
          </label>

          <label className="text-sm font-medium text-slate-700">
            Precio (ARS)

            <input
              name="precio"
              type="number"
              required
              min="0.01"
              max="99999999.99"
              step="0.01"
              placeholder="15000"
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-600"
            />
          </label>

          <label className="text-sm font-medium text-slate-700">
            Duración (días)

            <input
              name="duracion_dias"
              type="number"
              required
              min="1"
              max="3650"
              step="1"
              defaultValue={30}
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-600"
            />
          </label>

          <div className="md:col-span-3">
            <button
              type="submit"
              className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
            >
              Crear plan
            </button>
          </div>
        </form>
      </section>

      {/* LISTADO DE PLANES */}
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-6">
          <h2 className="text-xl font-semibold text-slate-900">
            Planes registrados
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {error
              ? "No se pudo obtener el listado."
              : `${planes.length} planes encontrados`}
          </p>
        </div>

        {error ? (
          <div
            role="alert"
            className="p-6 text-sm text-red-700"
          >
            Ocurrió un error al consultar los planes.
            Verificá la conexión con Supabase y los permisos.
          </div>
        ) : planes.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-sm text-slate-500">
              Todavía no hay planes registrados.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {planes.map((plan) => (
              <article
                key={plan.id}
                className="space-y-5 p-6"
              >
                {/* INFORMACIÓN DEL PLAN */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      {plan.nombre}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {formatoMoneda.format(plan.precio)}
                      {" · "}
                      {plan.duracion_dias} días
                    </p>
                  </div>

                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                    Membresía
                  </span>
                </div>

                {/* FORMULARIO DE EDICIÓN */}
                <form
                  action={actualizarPlan}
                  className="grid gap-3 rounded-lg bg-slate-50 p-4 md:grid-cols-4"
                >
                  <input
                    type="hidden"
                    name="id"
                    value={plan.id}
                  />

                  <label className="text-xs font-medium text-slate-600">
                    Nombre

                    <input
                      name="nombre"
                      type="text"
                      required
                      maxLength={100}
                      defaultValue={plan.nombre}
                      className="mt-1 w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm"
                    />
                  </label>

                  <label className="text-xs font-medium text-slate-600">
                    Precio (ARS)

                    <input
                      name="precio"
                      type="number"
                      required
                      min="0.01"
                      max="99999999.99"
                      step="0.01"
                      defaultValue={plan.precio}
                      className="mt-1 w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm"
                    />
                  </label>

                  <label className="text-xs font-medium text-slate-600">
                    Duración (días)

                    <input
                      name="duracion_dias"
                      type="number"
                      required
                      min="1"
                      max="3650"
                      step="1"
                      defaultValue={plan.duracion_dias}
                      className="mt-1 w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm"
                    />
                  </label>

                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                    >
                      Guardar cambios
                    </button>
                  </div>
                </form>

                {/* ELIMINACIÓN CON CONFIRMACIÓN */}
                <PlanDeleteButton
                  id={plan.id}
                  nombre={plan.nombre}
                />
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
