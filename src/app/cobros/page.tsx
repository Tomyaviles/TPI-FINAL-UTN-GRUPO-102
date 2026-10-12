import ModuloPendiente from "@/components/ModuloPendiente";
import { requerirRol } from "@/lib/auth";

export default async function CobrosPage() {
  await requerirRol(["admin", "recepcion"]);

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
