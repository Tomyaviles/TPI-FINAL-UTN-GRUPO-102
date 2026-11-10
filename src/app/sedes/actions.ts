
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requerirRol } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

type DatosSede = {
  nombre: string;
  direccion: string | null;
};

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function validarDatos(formData: FormData): DatosSede | null {
  const nombre = String(formData.get("nombre") ?? "").trim();
  const direccion = String(formData.get("direccion") ?? "").trim();

  if (
    nombre.length < 2 ||
    nombre.length > 100 ||
    direccion.length > 200
  ) {
    return null;
  }

  return {
    nombre,
    direccion: direccion || null,
  };
}

function informarError(mensaje: string): never {
  redirect(`/sedes?error=${encodeURIComponent(mensaje)}`);
}

function informarExito(mensaje: string): never {
  revalidatePath("/sedes");
  redirect(`/sedes?mensaje=${encodeURIComponent(mensaje)}`);
}

export async function crearSede(formData: FormData) {
  await requerirRol(["admin"]);

  const datos = validarDatos(formData);

  if (!datos) {
    informarError("Revisá el nombre y la dirección de la sede.");
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("sedes")
    .insert(datos);

  if (error) {
    console.error("Error al crear sede:", error.message);
    informarError("No se pudo registrar la sede.");
  }

  informarExito("La sede fue registrada correctamente.");
}

export async function actualizarSede(formData: FormData) {
  await requerirRol(["admin"]);

  const id = String(formData.get("id") ?? "");
  const datos = validarDatos(formData);

  if (!UUID_REGEX.test(id)) {
    informarError("El identificador de la sede no es válido.");
  }

  if (!datos) {
    informarError("Los datos ingresados no son válidos.");
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("sedes")
    .update(datos)
    .eq("id", id)
    .select("id");

  if (error) {
    console.error("Error al actualizar sede:", error.message);
    informarError("No se pudo actualizar la sede.");
  }

  if (!data?.length) {
    informarError("No se encontró la sede solicitada.");
  }

  informarExito("La sede fue actualizada correctamente.");
}
