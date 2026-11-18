
import Link from "next/link";
import { notFound } from "next/navigation";

import { requerirRol } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

import SocioForm from "@/components/socios/SocioForm";
import SuspenderSocioButton from "@/components/socios/SuspenderSocioButton";
import HistorialPagos from "@/components/cobros/HistorialPagos";
import HistorialAsistencias from "@/components/socios/HistorialAsistencias";

import type { Socio, Sede, Plan } from "@/types/database";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function DetalleSocioPage({ params }: Props) {
  // La ampliación de permisos para recepción se integra por separado.
  await requerirRol(["admin"]);

  const { id } = await params;
  const supabase = await createClient();

  const [socioResult, sedesResult, planesResult] = await Promise.all([
    supabase.from("socios").select("*").eq("id", id).maybeSingle(),
    supabase.from("sedes").select("*").order("nombre"),
    supabase.from("planes").select("*").order("nombre"),
  ]);

  if (socioResult.error) {
    throw new Error(
      `No se pudo consultar el socio: ${socioResult.error.message}`
    );
  }

  if (!socioResult.data) {
    notFound();
  }

  if (sedesResult.error || planesResult.error) {
    throw new Error("No se pudieron cargar las sedes o los planes.");
  }

  const socio = socioResult.data as Socio;
  const sedes = (sedesResult.data ?? []) as Sede[];
  const planes = (planesResult.data ?? []) as Plan[];

  const nombreCompleto = `${socio.nombre} ${socio.apellido}`;

  const estadoCuota =
    socio.estado_cuota === "al_dia"
      ? "Al día"
      : socio.estado_cuota === "vencido"
        ? "Vencido"
        : "Suspendido";

  const sedeAsignada = sedes.find(
    (sede) => sede.id === socio.sede_id
  );

  const planAsignado = planes.find(
    (plan) => plan.id === socio.plan_id
  );

  return (
    <main className="mx-auto max-w-5xl space-y-6 p-6">
      {/* Encabezado */}
      <header>
        <Link
          href="/socios"
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          ← Volver a socios
        </Link>

        <h1 className="mt-4 text-3xl font-bold text-slate-900">
          {nombreCompleto}
        </h1>

        <p className="mt-2 text-slate-600">
          Consultá, editá y administrá los datos del socio.
        </p>
      </header>

      {/* Información general */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-xl font-semibold text-slate-900">
          Información del socio
        </h2>

        <dl className="grid gap-5 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-slate-500">
              Nombre completo
            </dt>
            <dd className="mt-1 font-medium text-slate-900">
              {nombreCompleto}
            </dd>
          </div>

          <div>
            <dt className="text-sm text-slate-500">
              DNI
            </dt>
            <dd className="mt-1 font-medium text-slate-900">
              {socio.dni}
            </dd>
          </div>

          <div>
            <dt className="text-sm text-slate-500">
              Correo electrónico
            </dt>
            <dd className="mt-1 font-medium text-slate-900">
              {socio.email || "No informado"}
            </dd>
          </div>

          <div>
            <dt className="text-sm text-slate-500">
              Teléfono
            </dt>
            <dd className="mt-1 font-medium text-slate-900">
              {socio.telefono || "No informado"}
            </dd>
          </div>

          <div>
            <dt className="text-sm text-slate-500">
              Sede
            </dt>
            <dd className="mt-1 font-medium text-slate-900">
              {sedeAsignada?.nombre ?? "Sin sede asignada"}
            </dd>
          </div>

          <div>
            <dt className="text-sm text-slate-500">
              Plan
            </dt>
            <dd className="mt-1 font-medium text-slate-900">
              {planAsignado?.nombre ?? "Sin plan asignado"}
            </dd>
          </div>

          <div>
            <dt className="text-sm text-slate-500">
              Fecha de vencimiento
            </dt>
            <dd className="mt-1 font-medium text-slate-900">
              {socio.fecha_vencimiento ?? "No registrada"}
            </dd>
          </div>

          <div>
            <dt className="text-sm text-slate-500">
              Estado de cuota
            </dt>

            <dd className="mt-2">
              <span
                className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                  socio.estado_cuota === "al_dia"
                    ? "bg-green-100 text-green-800"
                    : socio.estado_cuota === "vencido"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-red-100 text-red-800"
                }`}
              >
                {estadoCuota}
              </span>
            </dd>
          </div>
        </dl>
      </section>

      {/* Historial de pagos */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-2 text-xl font-semibold text-slate-900">
          Historial de pagos
        </h2>

        <p className="mb-5 text-sm text-slate-600">
          Consultá los pagos registrados y los períodos abonados
          por el socio.
        </p>

        <HistorialPagos socioId={socio.id} />
      </section>

      {/* Historial de asistencias */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-2 text-xl font-semibold text-slate-900">
          Historial de asistencias
        </h2>

        <p className="mb-5 text-sm text-slate-600">
          Consultá las fechas, los horarios y las sedes de los
          ingresos registrados.
        </p>

        <HistorialAsistencias socioId={socio.id} />
      </section>

      {/* Formulario de edición */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-2 text-xl font-semibold text-slate-900">
          Editar socio
        </h2>

        <p className="mb-5 text-sm text-slate-600">
          Modificá los datos necesarios y guardá los cambios.
        </p>

        <SocioForm
          socio={socio}
          sedes={sedes}
          planes={planes}
        />
      </section>

      {/* Suspensión exclusiva del administrador */}
      <section className="rounded-xl border border-red-200 bg-white p-6 shadow-sm">
        <h2 className="mb-2 text-xl font-semibold text-slate-900">
          Suspensión del socio
        </h2>

        <p className="mb-5 text-sm text-slate-600">
          Esta acción cambiará el estado de cuota a suspendido.
          El socio permanecerá registrado en la base de datos
          y no se eliminará su historial.
        </p>

        <SuspenderSocioButton
          socioId={socio.id}
          nombreCompleto={nombreCompleto}
          suspendido={socio.estado_cuota === "suspendido"}
        />
      </section>
    </main>
  );
}
