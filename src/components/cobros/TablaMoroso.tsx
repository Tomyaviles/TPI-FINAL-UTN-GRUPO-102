// components/cobros/TablaMorosos.tsx
import React from 'react';

interface TablaMorososProps {
  morosos: any[];
  onSeleccionarParaCobrar: (m: any) => void;
}

export default function TablaMorosos({ morosos, onSeleccionarParaCobrar }: TablaMorososProps) {
  return (
    <div>
      <h2>Listado de Morosos (RF-10)</h2>
      {morosos.length === 0 ? (
        <p>No hay socios morosos registrados.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '12px' }}>
          <thead>
            <tr style={{ background: '#eee', textAlign: 'left' }}>
              <th style={{ padding: '8px' }}>Socio</th>
              <th style={{ padding: '8px' }}>DNI</th>
              <th style={{ padding: '8px' }}>Plan</th>
              <th style={{ padding: '8px' }}>Vencimiento</th>
              <th style={{ padding: '8px' }}>Días Atraso</th>
              <th style={{ padding: '8px' }}>Acción</th>
            </tr>
          </thead>
          <tbody>
            {morosos.map((m) => (
              <tr key={m.socio_id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '8px' }}>{m.nombre} {m.apellido}</td>
                <td style={{ padding: '8px' }}>{m.dni}</td>
                <td style={{ padding: '8px' }}>{m.plan_nombre} (${m.plan_precio})</td>
                <td style={{ padding: '8px', color: 'red' }}>{m.fecha_vencimiento}</td>
                <td style={{ padding: '8px' }}>{m.dias_atraso} días</td>
                <td style={{ padding: '8px' }}>
                  <button
                    onClick={() => onSeleccionarParaCobrar(m)}
                    style={{ background: '#28a745', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Cobrar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}