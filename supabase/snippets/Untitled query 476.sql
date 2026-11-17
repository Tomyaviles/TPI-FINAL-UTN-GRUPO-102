CREATE OR REPLACE FUNCTION registrar_pago(
    p_socio_id UUID,
    p_monto DECIMAL,
    p_metodo_pago VARCHAR,
    p_periodo_mes INT,
    p_periodo_anio INT
)
RETURNS JSONB AS $$
DECLARE
    v_nueva_fecha DATE;
BEGIN
    -- 1. Calcular la nueva fecha usando la función que creamos en la Semana 1
    v_nueva_fecha := calcular_nuevo_vencimiento(p_socio_id);

    -- 2. Insertar en la tabla PAGOS
    INSERT INTO pagos (socio_id, monto, metodo_pago, fecha_pago, periodo_mes, periodo_anio)
    VALUES (p_socio_id, p_monto, p_metodo_pago, NOW(), p_periodo_mes, p_periodo_anio);

    -- 3. Actualizar la fecha de vencimiento y estado del socio
    UPDATE socios
    SET fecha_vencimiento = v_nueva_fecha,
        estado_cuota = 'al_dia'
    WHERE id = p_socio_id;

    RETURN jsonb_build_object('success', true, 'nueva_fecha_vencimiento', v_nueva_fecha);
END;
$$ LANGUAGE plpgsql;