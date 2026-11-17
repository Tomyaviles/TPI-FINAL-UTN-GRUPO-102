import { obtenerPerfil } from "@/lib/auth";
import { NOMBRE_ROL } from "@/lib/permisos";

// Página a la que caen:
// - los usuarios logueados que no tienen fila en "perfiles"
// - los roles que todavía no tienen pantallas (por ahora, profesor)
export default async function InicioPage() {
  const perfil = await obtenerPerfil();

  if (!perfil) {
    return (
      <div>
        <h1 className="text-2xl font-bold">Sin perfil</h1>
        <p className="mt-4 rounded border border-amber-300 bg-amber-50 p-4 text-sm">
          Tu usuario no tiene un perfil asignado, así que no puede ver datos.
          Pedile a un administrador que te dé de alta en la sección Usuarios.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Hola, {perfil.nombre ?? "bienvenido"}</h1>
      <p className="mt-1 text-sm text-slate-500">Rol: {NOMBRE_ROL[perfil.rol]}</p>
      <p className="mt-4 text-sm text-slate-700">
        Todavía no hay secciones habilitadas para tu rol.
      </p>
    </div>
  );
}
