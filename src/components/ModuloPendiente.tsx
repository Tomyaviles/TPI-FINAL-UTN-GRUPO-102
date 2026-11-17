// Placeholder para las secciones que todavía no se implementaron.
// Cada responsable reemplaza el page.tsx de su módulo.
export default function ModuloPendiente({
  titulo,
  modulo,
  requerimientos,
}: {
  titulo: string;
  modulo: string;
  requerimientos: string[];
}) {
  return (
    <div>
      <h1 className="text-2xl font-bold">{titulo}</h1>
      <p className="mt-1 text-sm text-slate-500">{modulo} — en desarrollo</p>
      <ul className="mt-4 list-disc pl-5 text-sm text-slate-700">
        {requerimientos.map((rf) => (
          <li key={rf}>{rf}</li>
        ))}
      </ul>
    </div>
  );
}
