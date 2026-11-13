// app/cobros/page.tsx (o pages/cobros.tsx)
'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client'; // Ajusta según tu proyecto
import BuscadorSocio from '@/components/cobros/BuscadorSocio';
import FormularioCobro from '@/components/cobros/FormularioCobro';
import TablaMorosos from '@/components/cobros/TablaMoroso';

export default function CobrosPage() {
  const supabase = createClient();
  
  const [busqueda, setBusqueda] = useState('');
  const [sociosEncontrados, setSociosEncontrados] = useState<any[]>([]);
  const [socioSeleccionado, setSocioSeleccionado] = useState<any | null>(null);
  const [monto, setMonto] = useState<number | ''>('');
  const [metodoPago, setMetodoPago] = useState('efectivo');
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: 'exito' | 'error'; texto: string } | null>(null);
  const [morosos, setMorosos] = useState<any[]>([]);

  useEffect(() => {
    cargarMorosos();
  }, []);

  const cargarMorosos = async () => {
    const { data, error } = await supabase.from('v_socios_morosos').select('*');

    console.log("Datos que llegaron de morosos:", data);
    console.log("Error de Supabase (si lo hay):", error);

    if(error) {
      console.error("Error detallado:", error.message);
    }
    if (!error && data) setMorosos(data);
  };

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

    if (data) setSociosEncontrados(data);
  };

  const seleccionarSocio = (socio: any) => {
    setSocioSeleccionado(socio);
    setSociosEncontrados([]);
    setBusqueda(`${socio.nombre} ${socio.apellido} (${socio.dni})`);
    if (socio.planes?.precio) {
      setMonto(socio.planes.precio);
    } else if (socio.plan_precio) {
      // Por si viene de la tabla de morosos
      setMonto(socio.plan_precio);
    }
  };

  const handleRegistrarPago = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!socioSeleccionado || !monto) return;

    setCargando(true);
    setMensaje(null);

    const hoy = new Date();
    const { error } = await supabase.rpc('registrar_pago', {
      p_socio_id: socioSeleccionado.id ?? socioSeleccionado.socio_id,
      p_monto: Number(monto),
      p_metodo_pago: metodoPago,
      p_periodo_mes: hoy.getMonth() + 1,
      p_periodo_anio: hoy.getFullYear(),
    });

    setCargando(false);

    if (error) {
      setMensaje({ tipo: 'error', texto: `Error al registrar pago: ${error.message}` });
    } else {
      setMensaje({ tipo: 'exito', texto: '¡Pago registrado exitosamente!' });
      setSocioSeleccionado(null);
      setBusqueda('');
      setMonto('');
      cargarMorosos();
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>Gestión de Cobros</h1>

      <FormularioCobro
        socioSeleccionado={socioSeleccionado}
        monto={monto}
        setMonto={setMonto}
        metodoPago={metodoPago}
        setMetodoPago={setMetodoPago}
        cargando={cargando}
        mensaje={mensaje}
        onSubmit={handleRegistrarPago}
        busquedaComponent={
          <BuscadorSocio
            busqueda={busqueda}
            setBusqueda={setBusqueda}
            buscarSocios={buscarSocios}
            sociosEncontrados={sociosEncontrados}
            seleccionarSocio={seleccionarSocio}
          />
        }
      />

      <TablaMorosos
        morosos={morosos}
        onSeleccionarParaCobrar={(m) => {
          seleccionarSocio({
            id: m.socio_id,
            nombre: m.nombre,
            apellido: m.apellido,
            dni: m.dni,
            fecha_vencimiento: m.fecha_vencimiento,
            estado_cuota: 'vencido',
            planes: { nombre: m.plan_nombre, precio: m.plan_precio }
          });
        }}
      />
    </div>
  );
}