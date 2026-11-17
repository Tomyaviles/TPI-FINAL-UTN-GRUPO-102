"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type EstadoLogin = { error: string | null };

// Revisa que los campos no vengan vacíos y que el email tenga forma de email.
// Devuelve el mensaje de error o null si está todo bien.
function validarCampos(email: string, password: string) {
  if (!email || !password) return "Completá el email y la contraseña.";
  if (!email.includes("@")) return "El email no es válido.";
  if (password.length < 6) return "La contraseña tiene al menos 6 caracteres.";
  return null;
}

// Se ejecuta al enviar el formulario de login.
// Si sale bien Supabase guarda la sesión en las cookies y mandamos al dashboard.
export async function iniciarSesion(
  _estadoAnterior: EstadoLogin,
  formData: FormData
): Promise<EstadoLogin> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  const errorValidacion = validarCampos(email, password);
  if (errorValidacion) return { error: errorValidacion };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // No decimos si falló el email o la contraseña, a propósito
    return { error: "Email o contraseña incorrectos." };
  }

  redirect("/dashboard");
}

// Borra la sesión y vuelve al login. La usa el botón del Sidebar.
export async function cerrarSesion() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
