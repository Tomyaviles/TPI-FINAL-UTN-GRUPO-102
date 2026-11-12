'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client'; // Ajustá la ruta según tu proyecto

interface Socio {
  id: string;
  nombre: string;
  apellido: string;
  dni: string;
  fecha_vencimiento: string;
  estado_cuota: string;
  planes: { nombre: string; precio: number } | null;
}

interface SocioMoroso {
  socio_id: string;
  nombre: string;
  apellido: string;
  dni: string;
  fecha_vencimiento: string;
  plan_nombre: string;
  plan_precio: number;
  dias_atraso: number;
}

export default function CobrosPage() {
  const supabase = createClient();
  
  // Estados para búsqueda y cobro
  const [busqueda, setBusqueda] = useState('');
  const [sociosEncontrados, setSociosEncontrados] = useState<Socio[]>([]);
  const [socioSeleccionado, setSocioSeleccionado] = useState<Socio | null>(null);
  const [monto, setMonto] = useState<number | ''>('');
  const [metodoPago, setMetodoPago] = useState('efectivo');
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: 'exito' | 'error'; texto: string } | null>(null);

  // Estado para la vista de morosos
  const [morosos, setMorosos] = useState<SocioMoroso[]>([]);

  // Cargar lista de morosos al montar la pantalla
  useEffect(() => {
    cargarMorosos();
  }, []);

  const cargarMorosos = async () => {
    const { data, error } = await supabase.from('v_socios_morosos').select('*');
    if (!error && data) setMorosos(data);
  };

  // Buscar socios por DNI o Nombre
  const buscarSocios = async (query: string) => {
    setBusqueda(query);
    if (query.trim().length < 2) {
      setSociosEncontrados([]);
      return;
    }

    const { data } = await supabase
      .from('socios')
      .select('id, nombre, apellido, dni, fecha_vencimiento, estado_cuota, planes(nombre, precio)')
      .or(`dni.ilike.%${query}%,nombre.ilike.%${query}%,apellido.ilike.%${query}%`)
      .limit(5);

    if (data) setSociosEncontrados(data as unknown as Socio[]);
  };

  const seleccionarSocio = (socio: Socio) => {
    setSocioSeleccionado(socio);
    setSociosEncontrados([]);
    setBusqueda(`${socio.nombre} ${socio.apellido} (${socio.dni})`);
    if (socio.planes?.precio) {
      setMonto(socio.planes.precio);
    }
  };

  // Procesar el pago ejecutando la función RPC de Supabase
  const handleRegistrarPago = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!socioSeleccionado || !monto) return;

    setCargando(true);
    setMensaje(null);

    const hoy = new Date();
    const periodoMes = hoy.getMonth() + 1;
    const periodoAnio = hoy.getFullYear();

    const { error } = await supabase.rpc('registrar_pago', {
      p_socio_id: socioSeleccionado.id,
      p_monto: Number(monto),
      p_metodo_pago: metodoPago,
      p_periodo_mes: periodoMes,
      p_periodo_anio: periodoAnio,
    });

    setCargando(false);

    if (error) {
      setMensaje({ tipo: 'error', texto: `Error al registrar pago: ${error.message}` });
    } else {
      setMensaje({ tipo: 'exito', texto: '¡Pago registrado exitosamente!' });
      setSocioSeleccionado(null);
      setBusqueda('');
      setMonto('');
      cargarMorosos(); // Actualiza la lista de morosos
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>Gestión de Cobros</h1>

      {/* SECCIÓN 1: FORMULARIO DE PAGO */}
      <div style={{ background: '#f5f5f5', padding: '20px', borderRadius: '8px', marginBottom: '32px' }}>
        <h2>Registrar Nuevo Pago (RF-08 / RF-09)</h2>

        {mensaje && (
          <div style={{ color: mensaje.tipo === 'exito' ? 'green' : 'red', marginBottom: '12px' }}>
            {mensaje.texto}
          </div>
        )}

        <form onSubmit={handleRegistrarPago}>
          {/* Búsqueda autocompletada */}
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

      {/* SECCIÓN 2: LISTADO DE MOROSOS */}
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
                      onClick={() => seleccionarSocio({
                        id: m.socio_id,
                        nombre: m.nombre,
                        apellido: m.apellido,
                        dni: m.dni,
                        fecha_vencimiento: m.fecha_vencimiento,
                        estado_cuota: 'vencido',
                        planes: { nombre: m.plan_nombre, precio: m.plan_precio }
                      })}
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
    </div>
  );
}
