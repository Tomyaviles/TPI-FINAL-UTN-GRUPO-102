// components/cobros/FormularioCobro.tsx
import React from 'react';

interface FormularioCobroProps {
  socioSeleccionado: any;
  monto: number | '';
  setMonto: (monto: number | '') => void;
  metodoPago: string;
  setMetodoPago: (metodo: string) => void;
  cargando: boolean;
  mensaje: { tipo: 'exito' | 'error'; texto: string } | null;
  onSubmit: (e: React.FormEvent) => void;
  busquedaComponent: React.ReactNode;
}

export default function FormularioCobro({
  socioSeleccionado,
  monto,
  setMonto,
  metodoPago,
  setMetodoPago,
  cargando,
  mensaje,
  onSubmit,
  busquedaComponent,
}: FormularioCobroProps) {
  return (
    <div style={{ background: '#f5f5f5', padding: '20px', borderRadius: '8px', marginBottom: '32px' }}>
      <h2>Registrar Nuevo Pago (RF-08 / RF-09)</h2>

      {mensaje && (
        <div style={{ color: mensaje.tipo === 'exito' ? 'green' : 'red', marginBottom: '12px' }}>
          {mensaje.texto}
        </div>
      )}

      <form onSubmit={onSubmit}>
        {busquedaComponent}

        {socioSeleccionado && (
          <>
            <div style={{ marginBottom: '12px' }}>
              <p><strong>Socio:</strong> {socioSeleccionado.nombre} {socioSeleccionado.apellido}</p>
              <p><strong>Vencimiento Actual:</strong> {socioSeleccionado.fecha_vencimiento ?? 'Sin fecha'}</p>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block' }}>Monto ($):</label>
              <input
                type="number"
                value={monto}
                onChange={(e) => setMonto(Number(e.target.value))}
                required
                style={{ width: '100%', padding: '8px' }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block' }}>Método de Pago:</label>
              <select
                value={metodoPago}
                onChange={(e) => setMetodoPago(e.target.value)}
                style={{ width: '100%', padding: '8px' }}
              >
                <option value="efectivo">Efectivo</option>
                <option value="transferencia">Transferencia</option>
                <option value="tarjeta_debito">Tarjeta de Débito</option>
                <option value="tarjeta_credito">Tarjeta de Crédito</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={cargando}
              style={{ background: '#0070f3', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              {cargando ? 'Registrando...' : 'Confirmar y Cobrar'}
            </button>
          </>
        )}
      </form>
    </div>
  );
}