"use client";

import { useActionState } from "react";
import { iniciarSesion, type EstadoLogin } from "./actions";

const estadoInicial: EstadoLogin = { error: null };

export default function LoginPage() {
  // useActionState nos da el error que devuelve la action y si está cargando
  const [estado, formAction, cargando] = useActionState(iniciarSesion, estadoInicial);

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <form
        action={formAction}
        className="w-full max-w-sm rounded border border-slate-200 bg-white p-6 shadow-sm"
      >
        <h1 className="text-2xl font-bold">Iniciar sesión</h1>
        <p className="mt-1 text-sm text-slate-500">Gestión Gimnasios</p>

        <label className="mt-6 block text-sm font-medium" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
        />

        <label className="mt-4 block text-sm font-medium" htmlFor="password">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
        />

        {estado.error && (
          <p className="mt-4 rounded bg-red-50 p-2 text-sm text-red-700">{estado.error}</p>
        )}

        <button
          type="submit"
          disabled={cargando}
          className="mt-6 w-full rounded bg-slate-900 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
        >
          {cargando ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </div>
  );
}
