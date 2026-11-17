
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requerirRol } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { EstadoCuota } from "@/types/database";

type DatosSocio = {
  nombre: string;
  apellido: string;
  dni: string;
  email: string | null;
  telefono: string | null;
  sede_id: string | null;
  plan_id: string | null;
  fecha_vencimiento: string | null;
  estado_cuota: EstadoCuota;
};

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const ESTADOS: EstadoCuota[] = [
  "al_dia",
  "vencido",
  "suspendido",
];

function obtenerTexto(formData: FormData, campo: string): string {
  return String(formData.get(campo) ?? "").trim();
}

function validarDatos(formData: FormData): DatosSocio | null {
  const nombre = obtenerTexto(formData, "nombre");
  const apellido = obtenerTexto(formData, "apellido");
  const dni = obtenerTexto(formData, "dni");
  const email = obtenerTexto(formData, "email");
  const telefono = obtenerTexto(formData, "telefono");
  const sedeId = obtenerTexto(formData, "sede_id");
  const planId = obtenerTexto(formData, "plan_id");
  const vencimiento = obtenerTexto(formData, "fecha_vencimiento");
  const estado = obtenerTexto(formData, "estado_cuota");

  if (
    nombre.length < 2 ||
    nombre.length > 100 ||
    apellido.length < 2 ||
    apellido.length > 100 ||
    !/^\d{7,8}$/.test(dni) ||
    email.length > 254 ||
    telefono.length > 30
  ) {
    return null;
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return null;
  }

  if (sedeId && !UUID_REGEX.test(sedeId)) {
    return null;
  }

  if (planId && !UUID_REGEX.test(planId)) {
    return null;
  }

  if (
    vencimiento &&
    (!/^\d{4}-\d{2}-\d{2}$/.test(vencimiento) ||
      Number.isNaN(Date.parse(`${vencimiento}T00:00:00Z`)) ||
      new Date(`${vencimiento}T00:00:00Z`)
        .toISOString()
        .slice(0, 10) !== vencimiento)
  ) {
    return null;
  }

  if (!ESTADOS.includes(estado as EstadoCuota)) {
    return null;
  }

  return {
    nombre,
    apellido,
    dni,
    email: email || null,
    telefono: telefono || null,
    sede_id: sedeId || null,
    plan_id: planId || null,
    fecha_vencimiento: vencimiento || null,
    estado_cuota: estado as EstadoCuota,
  };
}

function informarError(mensaje: string): never {
  redirect(`/socios?error=${encodeURIComponent(mensaje)}`);
}

function informarExito(mensaje: string): never {
  revalidatePath("/socios");
  redirect(`/socios?mensaje=${encodeURIComponent(mensaje)}`);
}

export async function crearSocio(formData: FormData) {
  await requerirRol(["admin"]);

  const datos = validarDatos(formData);

  if (!datos) {
    informarError("Los datos del socio no son válidos.");
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("socios")
    .insert(datos);

  if (error) {
    if (error.code === "23505") {
      informarError("Ya existe un socio registrado con ese DNI.");
    }

    console.error("Error al crear socio:", error.message);
    informarError("No se pudo registrar el socio.");
  }

  informarExito("El socio fue registrado correctamente.");
}

export async function actualizarSocio(formData: FormData) {
  await requerirRol(["admin"]);

  const id = obtenerTexto(formData, "id");
  const datos = validarDatos(formData);

  if (!UUID_REGEX.test(id)) {
    informarError("El identificador del socio no es válido.");
  }

  if (!datos) {
    informarError("Los datos del socio no son válidos.");
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("socios")
    .update(datos)
    .eq("id", id)
    .select("id");

  if (error) {
    if (error.code === "23505") {
      informarError("El DNI ingresado ya pertenece a otro socio.");
    }

    console.error("Error al actualizar socio:", error.message);
    informarError("No se pudo actualizar el socio.");
  }

  if (!data?.length) {
    informarError("No se encontró el socio solicitado.");
  }

  informarExito("Los datos del socio se actualizaron correctamente.");
}

export async function suspenderSocio(formData: FormData) {
  await requerirRol(["admin"]);

  const id = obtenerTexto(formData, "id");

  if (!UUID_REGEX.test(id)) {
    informarError("El identificador del socio no es válido.");
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("socios")
    .update({ estado_cuota: "suspendido" })
    .eq("id", id)
    .select("id");

  if (error) {
    console.error("Error al suspender socio:", error.message);
    informarError("No se pudo suspender el socio.");
  }

  if (!data?.length) {
    informarError("No se encontró el socio solicitado.");
  }

  informarExito("El socio fue suspendido correctamente.");
}
