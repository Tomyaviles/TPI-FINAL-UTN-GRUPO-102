
"use client";

import { useState } from "react";
import { eliminarPlan } from "@/app/planes/actions";

type Props = {
  id: string;
  nombre: string;
};

export default function PlanDeleteButton({ id, nombre }: Props) {
  const [confirmando, setConfirmando] = useState(false);

  return (
    <div>
      {!confirmando ? (
        <button
          type="button"
          onClick={() => setConfirmando(true)}
          className="text-sm font-medium text-red-700 hover:text-red-900"
        >
          Eliminar plan
        </button>
      ) : (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3">
          <p className="mb-3 text-sm text-red-800">
            ¿Confirmás que querés eliminar el plan &quot;{nombre}&quot;?
          </p>

          <div className="flex gap-3">
            <form action={eliminarPlan}>
              <input type="hidden" name="id" value={id} />

              <button
                type="submit"
                className="rounded-lg bg-red-700 px-3 py-2 text-sm font-medium text-white hover:bg-red-800"
              >
                Sí, eliminar
              </button>
            </form>

            <button
              type="button"
              onClick={() => setConfirmando(false)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
