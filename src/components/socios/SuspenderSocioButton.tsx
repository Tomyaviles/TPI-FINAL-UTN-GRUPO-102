
"use client";

import { useState } from "react";
import { suspenderSocio } from "@/app/socios/actions";

type Props = {
  socioId: string;
  nombreCompleto: string;
  suspendido: boolean;
};

export default function SuspenderSocioButton({
  socioId,
  nombreCompleto,
  suspendido,
}: Props) {
  const [confirmando, setConfirmando] = useState(false);

  if (suspendido) {
    return (
      <p className="rounded-lg bg-amber-50 p-4 text-sm text-amber-800">
        Este socio ya se encuentra suspendido.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {!confirmando ? (
        <button
          type="button"
          onClick={() => setConfirmando(true)}
          className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700"
        >
          Suspender socio
        </button>
      ) : (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="mb-4 text-sm text-red-900">
            ¿Confirmás que querés suspender a{" "}
            <strong>{nombreCompleto}</strong>?
          </p>

          <div className="flex flex-wrap gap-3">
            <form action={suspenderSocio}>
              <input type="hidden" name="id" value={socioId} />

              <button
                type="submit"
                className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700"
              >
                Confirmar suspensión
              </button>
            </form>

            <button
              type="button"
              onClick={() => setConfirmando(false)}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
