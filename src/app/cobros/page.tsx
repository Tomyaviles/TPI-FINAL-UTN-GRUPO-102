import { requerirRol } from "@/lib/auth";
import PantallaCobros from "@/components/cobros/PantallaCobros";

// La pantalla es de cliente, así que el control de rol se hace acá
export default async function CobrosPage() {
  await requerirRol(["admin", "recepcion"]);

  return <PantallaCobros />;
}
