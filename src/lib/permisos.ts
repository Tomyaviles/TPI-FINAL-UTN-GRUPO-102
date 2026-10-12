import type { Rol } from "@/types/database";

// Qué secciones del menú puede ver cada rol (RF-02).
// Los roles salen de la tabla de módulos en docs/MODULOS.md.
// Si se agrega una pantalla nueva, se suma acá y aparece en el menú.
export const SECCIONES: { href: string; label: string; roles: Rol[] }[] = [
  { href: "/dashboard", label: "Dashboard", roles: ["admin"] },
  { href: "/socios", label: "Socios y Sedes", roles: ["admin", "recepcion"] },
  { href: "/planes", label: "Planes", roles: ["admin"] },
  { href: "/cobros", label: "Cobros", roles: ["admin", "recepcion"] },
  { href: "/ingreso", label: "Ingreso", roles: ["admin", "recepcion", "socio"] },
  { href: "/usuarios", label: "Usuarios", roles: ["admin"] },
];

// Devuelve solo las secciones que le corresponden al rol
export function seccionesDelRol(rol: Rol | null) {
  if (!rol) return [];
  return SECCIONES.filter((s) => s.roles.includes(rol));
}

// Página a la que va cada rol después del login (o si entra a algo que no le toca).
// Si el rol no tiene ninguna sección, va a /inicio.
export function paginaInicio(rol: Rol | null) {
  const secciones = seccionesDelRol(rol);
  if (secciones.length === 0) return "/inicio";
  return secciones[0].href;
}

export const NOMBRE_ROL: Record<Rol, string> = {
  admin: "Administrador",
  recepcion: "Recepción",
  profesor: "Profesor",
  socio: "Socio",
};
