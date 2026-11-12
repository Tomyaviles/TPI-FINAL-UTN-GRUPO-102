'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

interface Pago {
  id: string;
  monto: number;
  metodo_pago: string;
  fecha_pago: string;
  periodo_mes: number;
  periodo_anio: number;
}

export default function HistorialPagos({ socioId }: { socioId: string }) {
  const supabase = createClient();
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerHistorial = async () => {
      const { data, error } = await supabase
        .from('pagos')
        .select('*')
        .eq('socio_id', socioId)
        .order('fecha_pago', { ascending: false });

      if (!error && data) {
        setPagos(data);
      }
      setCargando(false);
    };

    if (socioId) obtenerHistorial();
  }, [socioId]);

  if (cargando) return <p>Cargando historial de pagos...</p>;
  if (pagos.length === 0) return <p>El socio no registra pagos anteriores.</p>;

  return (
    <div style={{ marginTop: '20px' }}>
      <h3>Historial de Pagos</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f0f0f0', textAlign: 'left' }}>
            <th style={{ padding: '8px' }}>Fecha de Pago</th>
            <th style={{ padding: '8px' }}>Monto</th>
            <th style={{ padding: '8px' }}>Método</th>
            <th style={{ padding: '8px' }}>Período</th>
          </tr>
        </thead>
        <tbody>
          {pagos.map((pago) => (
            <tr key={pago.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '8px' }}>{new Date(pago.fecha_pago).toLocaleDateString()}</td>
              <td style={{ padding: '8px' }}>${pago.monto}</td>
              <td style={{ padding: '8px', textTransform: 'capitalize' }}>{pago.metodo_pago.replace('_', ' ')}</td>
              <td style={{ padding: '8px' }}>{pago.periodo_mes}/{pago.periodo_anio}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}