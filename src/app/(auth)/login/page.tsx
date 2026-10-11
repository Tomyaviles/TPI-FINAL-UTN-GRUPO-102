import ModuloPendiente from "@/components/ModuloPendiente";

export default function LoginPage() {
  return (
    <ModuloPendiente
      titulo="Iniciar sesión"
      modulo="Módulo 1: Autenticación y Roles"
      requerimientos={[
        "RF-01: Inicio de sesión con email y contraseña (Supabase Auth)",
        "RF-02: Vistas y permisos según rol",
        "RF-03: Alta de socio sin cuenta de usuario obligatoria",
      ]}
    />
  );
}
