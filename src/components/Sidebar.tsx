"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cerrarSesion } from "@/app/(auth)/login/actions";
import { NOMBRE_ROL, seccionesDelRol } from "@/lib/permisos";
import type { Rol } from "@/types/database";

// El perfil lo busca el layout (que corre en el servidor) y lo pasa por props
export default function Sidebar({
  nombre,
  rol,
}: {
  nombre: string | null;
  rol: Rol | null;
}) {
  const pathname = usePathname();

  // El login se muestra sin menú
  if (pathname.startsWith("/login")) return null;

  // Solo mostramos lo que el rol puede ver
  const secciones = seccionesDelRol(rol);

  return (
    <aside className="w-full border-b border-slate-200 bg-slate-900 text-slate-100 md:min-h-screen md:w-56 md:border-b-0">
      <div className="px-4 pt-4 text-lg font-bold">Gestión Gimnasios</div>
      <div className="px-4 pb-4 text-xs text-slate-400">
        {nombre ?? "Sin perfil"}
        {rol && ` · ${NOMBRE_ROL[rol]}`}
      </div>
      <nav className="flex gap-1 overflow-x-auto px-2 pb-3 md:flex-col md:pb-0">
        {secciones.map((s) => {
          const activa = pathname.startsWith(s.href);
          return (
            <Link
              key={s.href}
              href={s.href}
              className={`whitespace-nowrap rounded px-3 py-2 text-sm ${
                activa ? "bg-slate-700 font-semibold" : "hover:bg-slate-800"
              }`}
            >
              {s.label}
            </Link>
          );
        })}
      </nav>
      <form action={cerrarSesion} className="px-2 pb-3 md:mt-4">
        <button
          type="submit"
          className="w-full rounded px-3 py-2 text-left text-sm text-slate-400 hover:bg-slate-800 hover:text-slate-100"
        >
          Cerrar sesión
        </button>
      </form>
    </aside>
  );
}
