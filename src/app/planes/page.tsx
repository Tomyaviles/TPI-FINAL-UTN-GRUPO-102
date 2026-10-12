import ModuloPendiente from "@/components/ModuloPendiente";
import { requerirRol } from "@/lib/auth";

export default async function PlanesPage() {
  await requerirRol(["admin"]);

  return (
    <ModuloPendiente
      titulo="Planes"
      modulo="Módulo 3: Planes y Membresías"
      requerimientos={[
        "RF-07: Crear y parametrizar planes (nombre, precio, duración en días)",
      ]}
    />
  );
}
