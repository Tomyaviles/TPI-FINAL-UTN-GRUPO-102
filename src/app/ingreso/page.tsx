import ModuloPendiente from "@/components/ModuloPendiente";

export default function IngresoPage() {
  return (
    <ModuloPendiente
      titulo="Control de Ingreso"
      modulo="Módulo 5: Control de Ingreso y Asistencia"
      requerimientos={[
        "RF-11: Validar estado de cuota en tiempo real al ingresar",
        "RF-12: Registrar asistencia (socio, sede, fecha y hora)",
        "RF-13: Generar token / QR de acceso",
      ]}
    />
  );
}
