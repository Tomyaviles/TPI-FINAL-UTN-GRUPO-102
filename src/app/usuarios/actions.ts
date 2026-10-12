"use server";

import { revalidatePath } from "next/cache";
import { esAdmin, obtenerPerfil } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Rol } from "@/types/database";

export type EstadoForm = { error: string | null; ok: string | null };

// Desde esta pantalla el admin solo crea personal del gimnasio
const ROLES_PERMITIDOS: Rol[] = ["recepcion", "profesor"];

type DatosUsuario = {
  nombre: string;
  email: string;
  password: string;
  rol: Rol;
  sedeId: string;
};

// Saca los datos del formulario y los limpia un poco
function leerFormulario(formData: FormData): DatosUsuario {
  return {
    nombre: String(formData.get("nombre") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim().toLowerCase(),
    password: String(formData.get("password") ?? ""),
    rol: String(formData.get("rol") ?? "") as Rol,
    sedeId: String(formData.get("sede_id") ?? ""),
  };
}

// Devuelve el primer error que encuentre, o null si está todo bien
function validar(datos: DatosUsuario) {
  if (!datos.nombre) return "Falta el nombre.";
  if (!datos.email.includes("@")) return "El email no es válido.";
  if (datos.password.length < 6) return "La contraseña tiene que tener al menos 6 caracteres.";
  if (!ROLES_PERMITIDOS.includes(datos.rol)) return "Elegí un rol válido.";
  if (!datos.sedeId) return "Recepción y profesores tienen que tener una sede.";
  return null;
}

// Crea el usuario en Supabase Auth y después su fila en perfiles.
// Si falla el perfil, borra el usuario de Auth para no dejarlo a medias.
export async function crearUsuario(
  _estadoAnterior: EstadoForm,
  formData: FormData
): Promise<EstadoForm> {
  // Chequeamos de nuevo acá: una action se puede llamar aunque no se vea el botón
  const perfil = await obtenerPerfil();
  if (!esAdmin(perfil)) return { error: "Solo un administrador puede crear usuarios.", ok: null };

  const datos = leerFormulario(formData);
  const errorValidacion = validar(datos);
  if (errorValidacion) return { error: errorValidacion, ok: null };

  const supabase = createAdminClient();

  // email_confirm: true para que pueda entrar sin confirmar por mail
  const { data, error } = await supabase.auth.admin.createUser({
    email: datos.email,
    password: datos.password,
    email_confirm: true,
  });

  if (error || !data.user) {
    const yaExiste = error?.message.toLowerCase().includes("already");
    return {
      error: yaExiste ? "Ya existe un usuario con ese email." : "No se pudo crear el usuario.",
      ok: null,
    };
  }

  const { error: errorPerfil } = await supabase.from("perfiles").insert({
    id: data.user.id,
    nombre: datos.nombre,
    rol: datos.rol,
    sede_id: datos.sedeId,
  });

  if (errorPerfil) {
    await supabase.auth.admin.deleteUser(data.user.id);
    return { error: "No se pudo guardar el perfil, no se creó el usuario.", ok: null };
  }

  // Para que la lista de abajo se actualice con el nuevo usuario
  revalidatePath("/usuarios");
  return { error: null, ok: `Usuario ${datos.email} creado.` };
}
