// components/cobros/BuscadorSocio.tsx
import React from 'react';

interface BuscadorSocioProps {
  busqueda: string;
  setBusqueda: (query: string) => void;
  buscarSocios: (query: string) => void;
  sociosEncontrados: any[];
  seleccionarSocio: (socio: any) => void;
}

export default function BuscadorSocio({
  busqueda,
  buscarSocios,
  sociosEncontrados,
  seleccionarSocio,
}: BuscadorSocioProps) {
  return (
    <div style={{ marginBottom: '16px', position: 'relative' }}>
      <label style={{ display: 'block', marginBottom: '4px' }}>Buscar Socio (DNI o Nombre):</label>
      <input
        type="text"
        value={busqueda}
        onChange={(e) => buscarSocios(e.target.value)}
        placeholder="Escribí DNI o apellido..."
        style={{ width: '100%', padding: '8px' }}
      />

      {sociosEncontrados.length > 0 && (
        <ul style={{ background: '#fff', border: '1px solid #ccc', position: 'absolute', width: '100%', zIndex: 10, listStyle: 'none', padding: 0, margin: 0 }}>
          {sociosEncontrados.map((s) => (
            <li
              key={s.id}
              onClick={() => seleccionarSocio(s)}
              style={{ padding: '8px', cursor: 'pointer', borderBottom: '1px solid #eee' }}
            >
              <strong>{s.nombre} {s.apellido}</strong> - DNI: {s.dni} | Plan: {s.planes?.nombre ?? 'Sin plan'}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}