
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Asistencia, Sede } from "@/types/database";

type Props = {
  socioId: string;
};

type AsistenciaConSede = Asistencia & {
  sedeNombre: string;
};

export default function HistorialAsistencias({ socioId }: Props) {
  const [asistencias, setAsistencias] = useState<AsistenciaConSede[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let activo = true;
    const supabase = createClient();

    async function cargarAsistencias() {
      setCargando(true);
      setError(null);

      try {
        const [asistenciasResult, sedesResult] = await Promise.all([
          supabase
            .from("asistencias")
            .select("*")
            .eq("socio_id", socioId)
            .order("fecha_hora", { ascending: false }),

          supabase
            .from("sedes")
            .select("id, nombre"),
        ]);

        if (!activo) return;

        if (asistenciasResult.error || sedesResult.error) {
          setError("No se pudo cargar el historial de asistencias.");
          return;
        }

        const sedes = (sedesResult.data ?? []) as Pick<
          Sede,
          "id" | "nombre"
        >[];

        const nombresPorSede = new Map(
          sedes.map((sede) => [sede.id, sede.nombre])
        );

        const registros = (asistenciasResult.data ?? []).map(
          (asistencia) => ({
            ...asistencia,
            sedeNombre: asistencia.sede_id
              ? nombresPorSede.get(asistencia.sede_id) ?? "No disponible"
              : "No informada",
          })
        );

        setAsistencias(registros);
      } catch {
        if (activo) {
          setError("Ocurrió un error al consultar las asistencias.");
        }
      } finally {
        if (activo) setCargando(false);
      }
    }

    void cargarAsistencias();

    return () => {
      activo = false;
    };
  }, [socioId]);

  if (cargando) {
    return (
      <p className="text-sm text-slate-500">
        Cargando historial de asistencias...
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

  if (asistencias.length === 0) {
    return (
      <p className="text-sm text-slate-500">
        El socio todavía no registra asistencias.
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
              Hora
            </th>
            <th scope="col" className="px-4 py-3">
              Sede
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-200">
          {asistencias.map((asistencia) => {
            const fecha = new Date(asistencia.fecha_hora);

            return (
              <tr
                key={asistencia.id}
                className="hover:bg-slate-50"
              >
                <td className="px-4 py-3">
                  {fecha.toLocaleDateString("es-AR")}
                </td>

                <td className="px-4 py-3">
                  {fecha.toLocaleTimeString("es-AR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>

                <td className="px-4 py-3">
                  {asistencia.sedeNombre}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
