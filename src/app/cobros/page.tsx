import ModuloPendiente from "@/components/ModuloPendiente";

export default function CobrosPage() {
  return (
    <ModuloPendiente
      titulo="Cobros"
      modulo="Módulo 4: Cobros y Estado de Cuenta"
      requerimientos={[
        "RF-08: Registro de pagos (socio, monto, método, período)",
        "RF-09: Recalcular vencimiento y pasar a 'al_dia' al pagar",
        "RF-10: Detección automática de morosos",
      ]}
    />
  );
}
