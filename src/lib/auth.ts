import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { paginaInicio } from "@/lib/permisos";
import type { Perfil, Rol } from "@/types/database";

// Funciones para saber quién está logueado y con qué rol.
// Se usan desde Server Components y Server Actions.

// Devuelve el usuario de Supabase Auth, o null si no hay sesión.
export async function obtenerUsuario() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return data.user;
}

// Busca la fila de "perfiles" del usuario logueado (ahí está el rol y la sede).
// Si no hay sesión o el usuario no tiene perfil cargado devuelve null.
export async function obtenerPerfil(): Promise<Perfil | null> {
  const usuario = await obtenerUsuario();
  if (!usuario) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("perfiles")
    .select("*")
    .eq("id", usuario.id)
    .single();

  if (error) {
    console.error("No se pudo leer el perfil:", error.message);
    return null;
  }
  return data;
}

// true si el perfil tiene alguno de los roles que se pasan.
// Ej: tieneRol(perfil, ["admin", "recepcion"])
export function tieneRol(perfil: Perfil | null, roles: Rol[]) {
  if (!perfil) return false;
  return roles.includes(perfil.rol);
}

export function esAdmin(perfil: Perfil | null) {
  return tieneRol(perfil, ["admin"]);
}

// Para poner al principio de una página que solo pueden ver ciertos roles.
// Si el usuario no tiene perfil va a /inicio (ahí se le explica qué pasa);
// si el rol no corresponde, a la página de inicio de su rol.
// Devuelve el perfil así la página no lo tiene que volver a buscar.
// (Si no hay sesión ni llega acá: el middleware ya lo mandó al login.)
export async function requerirRol(roles: Rol[]) {
  const perfil = await obtenerPerfil();
  if (!perfil) redirect("/inicio");
  if (!tieneRol(perfil, roles)) redirect(paginaInicio(perfil.rol));
  return perfil;
}
