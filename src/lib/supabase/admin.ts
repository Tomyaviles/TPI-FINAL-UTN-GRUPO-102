import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

// Cliente con la secret key: se saltea RLS y puede crear usuarios en Auth.
// SOLO se usa en el servidor (Server Actions). Nunca importarlo en un
// componente "use client", ni poner la key en una variable NEXT_PUBLIC_.
export function createAdminClient() {
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("Falta SUPABASE_SECRET_KEY en .env.local");
  }

  return createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, secretKey, {
    // No guardamos sesión: este cliente no representa a ningún usuario
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
