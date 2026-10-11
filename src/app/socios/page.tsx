import ModuloPendiente from "@/components/ModuloPendiente";

export default function SociosPage() {
  return (
    <ModuloPendiente
      titulo="Socios y Sedes"
      modulo="Módulo 2: Gestión de Socios y Sedes"
      requerimientos={[
        "RF-04: Registro, modificación y consulta de sedes",
        "RF-05: Alta, baja, modificación y consulta de socios",
        "RF-06: Búsqueda y filtro por DNI, nombre, sede o estado",
      ]}
    />
  );
}
