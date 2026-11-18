
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Pago } from "@/types/database";

type Props = {
  socioId: string;
};

const formatoMoneda = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
});

function formatearFecha(fecha: string) {
  return new Date(fecha).toLocaleDateString("es-AR");
}

export default function HistorialPagos({ socioId }: Props) {
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let activo = true;
    const supabase = createClient();

    async function cargarPagos() {
      setCargando(true);
      setError(null);

      try {
        const { data, error: consultaError } = await supabase
          .from("pagos")
          .select("*")
          .eq("socio_id", socioId)
          .order("fecha_pago", { ascending: false });

        if (!activo) return;

        if (consultaError) {
          setError("No se pudo cargar el historial de pagos.");
          return;
        }

        setPagos(data ?? []);
      } catch {
        if (activo) {
          setError("Ocurrió un error al consultar los pagos.");
        }
      } finally {
        if (activo) setCargando(false);
      }
    }

    void cargarPagos();

    return () => {
      activo = false;
    };
  }, [socioId]);

  if (cargando) {
    return (
      <p className="text-sm text-slate-500">
        Cargando historial de pagos...
      </p>
    );
  }

  if (error) {
    return (
      <p role="alert" className="text-sm text-red-700">
        {error}
      </p>
    );
  }

  if (pagos.length === 0) {
    return (
      <p className="text-sm text-slate-500">
        El socio no registra pagos anteriores.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-100 text-slate-700">
          <tr>
            <th scope="col" className="px-4 py-3">
              Fecha
            </th>
            <th scope="col" className="px-4 py-3">
              Monto
            </th>
            <th scope="col" className="px-4 py-3">
              Método
            </th>
            <th scope="col" className="px-4 py-3">
              Período
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-200">
          {pagos.map((pago) => (
            <tr key={pago.id} className="hover:bg-slate-50">
              <td className="px-4 py-3">
                {formatearFecha(pago.fecha_pago)}
              </td>

              <td className="px-4 py-3 font-medium">
                {formatoMoneda.format(pago.monto)}
              </td>

              <td className="px-4 py-3 capitalize">
                {pago.metodo_pago.replaceAll("_", " ")}
              </td>

              <td className="px-4 py-3">
                {pago.periodo_mes != null &&
                pago.periodo_anio != null
                  ? `${String(pago.periodo_mes).padStart(2, "0")}/${pago.periodo_anio}`
                  : "No informado"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
