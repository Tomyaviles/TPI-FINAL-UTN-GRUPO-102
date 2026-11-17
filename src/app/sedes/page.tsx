
import { requerirRol } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { crearSede, actualizarSede } from "./actions";

type Props = {
  searchParams: Promise<{
    mensaje?: string;
    error?: string;
  }>;
};

export default async function SedesPage({ searchParams }: Props) {
  await requerirRol(["admin"]);

  const supabase = await createClient();

  const [{ data: sedes, error }, params] = await Promise.all([
    supabase
      .from("sedes")
      .select("id, nombre, direccion, created_at")
      .order("nombre", { ascending: true }),
    searchParams,
  ]);

  return (
    <main className="mx-auto max-w-6xl space-y-8 p-6">
      <header>
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
          Administración / Sucursales
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Gestión de sedes
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Registrá y administrá las sucursales del gimnasio.
        </p>
      </header>

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

      {/* FORMULARIO DE CREACIÓN */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">
          Registrar nueva sede
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Completá los datos de la sucursal.
        </p>

        <form
          action={crearSede}
          className="mt-6 grid gap-4 md:grid-cols-2"
        >
          <label className="text-sm font-medium text-slate-700">
            Nombre de la sede

            <input
              type="text"
              name="nombre"
              required
              minLength={2}
              maxLength={100}
              placeholder="Ej. Sede Centro"
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-600"
            />
          </label>

          <label className="text-sm font-medium text-slate-700">
            Dirección

            <input
              type="text"
              name="direccion"
              maxLength={200}
              placeholder="Ej. Av. Rivadavia 1500"
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-600"
            />
          </label>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
            >
              Crear sede
            </button>
          </div>
        </form>
      </section>

      {/* LISTADO */}
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-6">
          <h2 className="text-xl font-semibold text-slate-900">
            Sedes registradas
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {error
              ? "No se pudo consultar el listado."
              : `${sedes?.length ?? 0} sedes encontradas`}
          </p>
        </div>

        {error ? (
          <div role="alert" className="p-6 text-sm text-red-700">
            No se pudieron cargar las sedes. Verificá la conexión
            con Supabase y los permisos del usuario.
          </div>
        ) : !sedes?.length ? (
          <div className="p-10 text-center text-sm text-slate-500">
            Todavía no hay sedes registradas.
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {sedes.map((sede) => (
              <article key={sede.id} className="space-y-4 p-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {sede.nombre}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {sede.direccion || "Sin dirección registrada"}
                  </p>
                </div>

                {/* FORMULARIO DE EDICIÓN */}
                <form
                  action={actualizarSede}
                  className="grid gap-3 rounded-lg bg-slate-50 p-4 md:grid-cols-3"
                >
                  <input
                    type="hidden"
                    name="id"
                    value={sede.id}
                  />

                  <label className="text-xs font-medium text-slate-600">
                    Nombre

                    <input
                      type="text"
                      name="nombre"
                      required
                      minLength={2}
                      maxLength={100}
                      defaultValue={sede.nombre}
                      className="mt-1 w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm"
                    />
                  </label>

                  <label className="text-xs font-medium text-slate-600">
                    Dirección

                    <input
                      type="text"
                      name="direccion"
                      maxLength={200}
                      defaultValue={sede.direccion ?? ""}
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
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
