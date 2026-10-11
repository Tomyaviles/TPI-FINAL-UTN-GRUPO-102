import ModuloPendiente from "@/components/ModuloPendiente";

export default function PlanesPage() {
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
