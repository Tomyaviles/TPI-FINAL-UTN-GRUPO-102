
import type { Plan, Sede, Socio } from "@/types/database";
import { actualizarSocio, crearSocio } from "@/app/socios/actions";

type Props = {
  sedes: Sede[];
  planes: Plan[];
  socio?: Socio;
};

const inputClass =
  "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none";

export default function SocioForm({
  sedes,
  planes,
  socio,
}: Props) {
  const editando = Boolean(socio);

  return (
    <form
      action={editando ? actualizarSocio : crearSocio}
      className="grid gap-4 md:grid-cols-2"
    >
      {socio && (
        <input type="hidden" name="id" value={socio.id} />
      )}

      <label className="text-sm font-medium text-slate-700">
        Nombre *
        <input
          name="nombre"
          required
          minLength={2}
          maxLength={100}
          defaultValue={socio?.nombre ?? ""}
          className={inputClass}
        />
      </label>

      <label className="text-sm font-medium text-slate-700">
        Apellido *
        <input
          name="apellido"
          required
          minLength={2}
          maxLength={100}
          defaultValue={socio?.apellido ?? ""}
          className={inputClass}
        />
      </label>

      <label className="text-sm font-medium text-slate-700">
        DNI *
        <input
          name="dni"
          required
          pattern="[0-9]{7,8}"
          title="Ingresá un DNI de 7 u 8 dígitos"
          defaultValue={socio?.dni ?? ""}
          className={inputClass}
        />
      </label>

      <label className="text-sm font-medium text-slate-700">
        Correo electrónico
        <input
          name="email"
          type="email"
          maxLength={254}
          defaultValue={socio?.email ?? ""}
          className={inputClass}
        />
      </label>

      <label className="text-sm font-medium text-slate-700">
        Teléfono
        <input
          name="telefono"
          type="tel"
          maxLength={30}
          defaultValue={socio?.telefono ?? ""}
          className={inputClass}
        />
      </label>

      <label className="text-sm font-medium text-slate-700">
        Sede
        <select
          name="sede_id"
          defaultValue={socio?.sede_id ?? ""}
          className={inputClass}
        >
          <option value="">Sin sede asignada</option>
          {sedes.map((sede) => (
            <option key={sede.id} value={sede.id}>
              {sede.nombre}
            </option>
          ))}
        </select>
      </label>

      <label className="text-sm font-medium text-slate-700">
        Plan
        <select
          name="plan_id"
          defaultValue={socio?.plan_id ?? ""}
          className={inputClass}
        >
          <option value="">Sin plan asignado</option>
          {planes.map((plan) => (
            <option key={plan.id} value={plan.id}>
              {plan.nombre}
            </option>
          ))}
        </select>
      </label>

      <label className="text-sm font-medium text-slate-700">
        Fecha de vencimiento
        <input
          name="fecha_vencimiento"
          type="date"
          defaultValue={socio?.fecha_vencimiento ?? ""}
          className={inputClass}
        />
      </label>

      <label className="text-sm font-medium text-slate-700">
        Estado de cuota
        <select
          name="estado_cuota"
          defaultValue={socio?.estado_cuota ?? "al_dia"}
          className={inputClass}
        >
          <option value="al_dia">Al día</option>
          <option value="vencido">Vencido</option>
          <option value="suspendido">Suspendido</option>
        </select>
      </label>

      <div className="flex items-end md:col-span-2">
        <button
          type="submit"
          className="rounded-lg bg-blue-700 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
        >
          {editando ? "Guardar cambios" : "Registrar socio"}
        </button>
      </div>
    </form>
  );
}
