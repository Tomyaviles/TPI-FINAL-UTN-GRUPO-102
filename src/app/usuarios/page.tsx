import { requerirRol } from "@/lib/auth";
import { NOMBRE_ROL } from "@/lib/permisos";
import { createClient } from "@/lib/supabase/server";
import FormUsuario from "./FormUsuario";

// Pantalla del admin para dar de alta recepcionistas y profesores
export default async function UsuariosPage() {
  await requerirRol(["admin"]);

  const supabase = await createClient();
  const [{ data: perfiles }, { data: sedes }] = await Promise.all([
    supabase.from("perfiles").select("*").order("created_at"),
    supabase.from("sedes").select("*").order("nombre"),
  ]);

  // Para mostrar el nombre de la sede en vez del id
  function nombreSede(sedeId: string | null) {
    if (!sedeId) return "Todas";
    return sedes?.find((s) => s.id === sedeId)?.nombre ?? "-";
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold">Usuarios</h1>
      <p className="mt-1 text-sm text-slate-500">
        Personal con acceso al sistema. Los socios se dan de alta desde Socios.
      </p>

      <div className="mt-6">
        <FormUsuario sedes={sedes ?? []} />
      </div>

      <table className="mt-6 w-full overflow-hidden rounded border border-slate-200 bg-white text-sm">
        <thead className="bg-slate-100 text-left text-xs uppercase text-slate-500">
          <tr>
            <th className="px-3 py-2">Nombre</th>
            <th className="px-3 py-2">Rol</th>
            <th className="px-3 py-2">Sede</th>
          </tr>
        </thead>
        <tbody>
          {perfiles?.map((p) => (
            <tr key={p.id} className="border-t border-slate-100">
              <td className="px-3 py-2">{p.nombre ?? "-"}</td>
              <td className="px-3 py-2">{NOMBRE_ROL[p.rol]}</td>
              <td className="px-3 py-2">{nombreSede(p.sede_id)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
