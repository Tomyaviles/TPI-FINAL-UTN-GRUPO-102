
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requerirRol } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

type DatosPlan = {
  nombre: string;
  precio: number;
  duracion_dias: number;
};

function validarDatos(formData: FormData): DatosPlan | null {
  const nombre = String(formData.get("nombre") ?? "").trim();
  const precio = Number(formData.get("precio"));
  const duracion = Number(formData.get("duracion_dias"));

  if (!nombre || nombre.length > 100) return null;
  if (!Number.isFinite(precio) || precio <= 0) return null;
  if (!Number.isInteger(duracion) || duracion <= 0) return null;

  return {
    nombre,
    precio,
    duracion_dias: duracion,
  };
}

function informarError(mensaje: string): never {
  redirect(`/planes?error=${encodeURIComponent(mensaje)}`);
}

function informarExito(mensaje: string): never {
  revalidatePath("/planes");
  redirect(`/planes?mensaje=${encodeURIComponent(mensaje)}`);
}

// Crear un plan nuevo.
export async function crearPlan(formData: FormData) {
  await requerirRol(["admin"]);

  const datos = validarDatos(formData);

  if (!datos) {
    informarError("Revisá el nombre, el precio y la duración.");
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("planes")
    .insert(datos);

  if (error) {
    console.error("Error al crear el plan:", error.message);
    informarError("No se pudo crear el plan. Verificá los datos e intentá nuevamente.");
  }

  informarExito("El plan se creó correctamente.");
}

// Actualizar un plan existente.
export async function actualizarPlan(formData: FormData) {
  await requerirRol(["admin"]);

  const id = String(formData.get("id") ?? "");
  const datos = validarDatos(formData);

  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    informarError("El identificador del plan no es válido.");
  }

  if (!datos) {
    informarError("Revisá el nombre, el precio y la duración.");
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("planes")
    .update(datos)
    .eq("id", id)
    .select("id");

  if (error) {
    console.error("Error al actualizar el plan:", error.message);
    informarError("No se pudo actualizar el plan.");
  }

  if (!data?.length) {
    informarError("No se encontró el plan o no tenés permiso para modificarlo.");
  }

  informarExito("El plan se actualizó correctamente.");
}

// Eliminar un plan.
export async function eliminarPlan(formData: FormData) {
  await requerirRol(["admin"]);

  const id = String(formData.get("id") ?? "");

  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    informarError("El identificador del plan no es válido.");
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("planes")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error al eliminar el plan:", error.message);

    if (error.code === "23503") {
      informarError(
        "No se puede eliminar este plan porque está asociado a uno o más socios."
      );
    }

    informarError("No se pudo eliminar el plan.");
  }

  informarExito("El plan se eliminó correctamente.");
}
