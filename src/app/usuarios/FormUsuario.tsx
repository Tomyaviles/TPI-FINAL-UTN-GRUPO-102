"use client";

import { useActionState } from "react";
import { crearUsuario, type EstadoForm } from "./actions";
import type { Sede } from "@/types/database";

const estadoInicial: EstadoForm = { error: null, ok: null };

const claseInput = "mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm";

export default function FormUsuario({ sedes }: { sedes: Sede[] }) {
  const [estado, formAction, cargando] = useActionState(crearUsuario, estadoInicial);

  return (
    // key: cuando se crea uno bien, el form se re-monta y queda vacío
    <form
      key={estado.ok ?? "form"}
      action={formAction}
      className="rounded border border-slate-200 bg-white p-4"
    >
      <h2 className="font-semibold">Nuevo usuario</h2>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <label className="text-sm">
          Nombre y apellido
          <input name="nombre" required className={claseInput} />
        </label>
        <label className="text-sm">
          Email
          <input name="email" type="email" required className={claseInput} />
        </label>
        <label className="text-sm">
          Contraseña inicial
          <input name="password" type="text" minLength={6} required className={claseInput} />
        </label>
        <label className="text-sm">
          Rol
          <select name="rol" required className={claseInput}>
            <option value="recepcion">Recepción</option>
            <option value="profesor">Profesor</option>
          </select>
        </label>
        <label className="text-sm">
          Sede
          <select name="sede_id" required className={claseInput}>
            <option value="">Elegir sede...</option>
            {sedes.map((sede) => (
              <option key={sede.id} value={sede.id}>
                {sede.nombre}
              </option>
            ))}
          </select>
        </label>
      </div>

      {estado.error && (
        <p className="mt-3 rounded bg-red-50 p-2 text-sm text-red-700">{estado.error}</p>
      )}
      {estado.ok && (
        <p className="mt-3 rounded bg-green-50 p-2 text-sm text-green-700">{estado.ok}</p>
      )}

      <button
        type="submit"
        disabled={cargando}
        className="mt-4 rounded bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
      >
        {cargando ? "Creando..." : "Crear usuario"}
      </button>
    </form>
  );
}
