-- Datos de prueba para desarrollo.
-- Sirven para que cada módulo se pueda probar sin depender de las pantallas de los demás.
-- Las fechas son relativas a CURRENT_DATE, así los estados siempre tienen sentido.

-- SEDES
INSERT INTO sedes (id, nombre, direccion) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Sede Central', 'Av. Corrientes 1234'),
  ('22222222-2222-2222-2222-222222222222', 'Sede Belgrano', 'Av. Cabildo 2500');

-- PLANES
INSERT INTO planes (id, nombre, precio, duracion_dias) VALUES
  ('aaaaaaaa-0000-0000-0000-000000000001', 'Pase Libre', 35000.00, 30),
  ('aaaaaaaa-0000-0000-0000-000000000002', '3 Días por Semana', 25000.00, 30),
  ('aaaaaaaa-0000-0000-0000-000000000003', 'Trimestral Pase Libre', 90000.00, 90);

-- SOCIOS (mezcla de al día, vencidos y suspendidos en ambas sedes)
INSERT INTO socios (id, nombre, apellido, dni, email, telefono, sede_id, plan_id, fecha_vencimiento, estado_cuota) VALUES
  ('bbbbbbbb-0000-0000-0000-000000000001', 'Juan', 'Pérez', '30111222', 'juan.perez@mail.com', '1155550001', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-0000-0000-0000-000000000001', CURRENT_DATE + 20, 'al_dia'),
  ('bbbbbbbb-0000-0000-0000-000000000002', 'María', 'Gómez', '31222333', 'maria.gomez@mail.com', '1155550002', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-0000-0000-0000-000000000002', CURRENT_DATE + 5, 'al_dia'),
  ('bbbbbbbb-0000-0000-0000-000000000003', 'Lucas', 'Fernández', '32333444', 'lucas.f@mail.com', '1155550003', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-0000-0000-0000-000000000001', CURRENT_DATE - 3, 'vencido'),
  ('bbbbbbbb-0000-0000-0000-000000000004', 'Sofía', 'López', '33444555', NULL, '1155550004', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-0000-0000-0000-000000000003', CURRENT_DATE + 60, 'al_dia'),
  ('bbbbbbbb-0000-0000-0000-000000000005', 'Martín', 'Díaz', '34555666', 'martin.diaz@mail.com', NULL, '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-0000-0000-0000-000000000002', CURRENT_DATE - 15, 'vencido'),
  ('bbbbbbbb-0000-0000-0000-000000000006', 'Valentina', 'Martínez', '35666777', 'vale.m@mail.com', '1155550006', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-0000-0000-0000-000000000001', CURRENT_DATE - 45, 'suspendido'),
  ('bbbbbbbb-0000-0000-0000-000000000007', 'Tomás', 'Romero', '36777888', 'tomas.r@mail.com', '1155550007', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-0000-0000-0000-000000000001', CURRENT_DATE + 1, 'al_dia'),
  ('bbbbbbbb-0000-0000-0000-000000000008', 'Camila', 'Sosa', '37888999', 'camila.s@mail.com', '1155550008', '22222222-2222-2222-2222-222222222222', 'aaaaaaaa-0000-0000-0000-000000000002', CURRENT_DATE + 12, 'al_dia'),
  ('bbbbbbbb-0000-0000-0000-000000000009', 'Nicolás', 'Torres', '38999000', NULL, '1155550009', '22222222-2222-2222-2222-222222222222', 'aaaaaaaa-0000-0000-0000-000000000001', CURRENT_DATE + 28, 'al_dia'),
  ('bbbbbbbb-0000-0000-0000-000000000010', 'Julieta', 'Álvarez', '39000111', 'juli.a@mail.com', '1155550010', '22222222-2222-2222-2222-222222222222', 'aaaaaaaa-0000-0000-0000-000000000003', CURRENT_DATE - 1, 'vencido'),
  ('bbbbbbbb-0000-0000-0000-000000000011', 'Agustín', 'Ruiz', '40111222', 'agus.ruiz@mail.com', '1155550011', '22222222-2222-2222-2222-222222222222', 'aaaaaaaa-0000-0000-0000-000000000002', CURRENT_DATE + 8, 'al_dia'),
  ('bbbbbbbb-0000-0000-0000-000000000012', 'Florencia', 'Benítez', '41222333', 'flor.b@mail.com', NULL, '22222222-2222-2222-2222-222222222222', 'aaaaaaaa-0000-0000-0000-000000000001', CURRENT_DATE - 7, 'vencido'),
  ('bbbbbbbb-0000-0000-0000-000000000013', 'Matías', 'Acosta', '42333444', 'mati.a@mail.com', '1155550013', '22222222-2222-2222-2222-222222222222', 'aaaaaaaa-0000-0000-0000-000000000001', CURRENT_DATE + 15, 'al_dia'),
  ('bbbbbbbb-0000-0000-0000-000000000014', 'Lucía', 'Medina', '43444555', 'lucia.m@mail.com', '1155550014', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-0000-0000-0000-000000000002', CURRENT_DATE + 3, 'al_dia'),
  -- Socio recién dado de alta, sin plan ni pagos todavía
  ('bbbbbbbb-0000-0000-0000-000000000015', 'Pedro', 'Herrera', '44555666', NULL, '1155550015', '11111111-1111-1111-1111-111111111111', NULL, NULL, 'vencido');

-- PAGOS (mes actual y anterior, para que el dashboard tenga datos)
INSERT INTO pagos (socio_id, monto, metodo_pago, fecha_pago, periodo_mes, periodo_anio) VALUES
  ('bbbbbbbb-0000-0000-0000-000000000001', 35000.00, 'efectivo',      NOW() - INTERVAL '10 days', EXTRACT(MONTH FROM CURRENT_DATE)::INT, EXTRACT(YEAR FROM CURRENT_DATE)::INT),
  ('bbbbbbbb-0000-0000-0000-000000000002', 25000.00, 'transferencia', NOW() - INTERVAL '25 days', EXTRACT(MONTH FROM CURRENT_DATE)::INT, EXTRACT(YEAR FROM CURRENT_DATE)::INT),
  ('bbbbbbbb-0000-0000-0000-000000000004', 90000.00, 'mercadopago',   NOW() - INTERVAL '30 days', EXTRACT(MONTH FROM CURRENT_DATE)::INT, EXTRACT(YEAR FROM CURRENT_DATE)::INT),
  ('bbbbbbbb-0000-0000-0000-000000000007', 35000.00, 'efectivo',      NOW() - INTERVAL '29 days', EXTRACT(MONTH FROM CURRENT_DATE)::INT, EXTRACT(YEAR FROM CURRENT_DATE)::INT),
  ('bbbbbbbb-0000-0000-0000-000000000008', 25000.00, 'mercadopago',   NOW() - INTERVAL '18 days', EXTRACT(MONTH FROM CURRENT_DATE)::INT, EXTRACT(YEAR FROM CURRENT_DATE)::INT),
  ('bbbbbbbb-0000-0000-0000-000000000009', 35000.00, 'transferencia', NOW() - INTERVAL '2 days',  EXTRACT(MONTH FROM CURRENT_DATE)::INT, EXTRACT(YEAR FROM CURRENT_DATE)::INT),
  ('bbbbbbbb-0000-0000-0000-000000000011', 25000.00, 'efectivo',      NOW() - INTERVAL '22 days', EXTRACT(MONTH FROM CURRENT_DATE)::INT, EXTRACT(YEAR FROM CURRENT_DATE)::INT),
  ('bbbbbbbb-0000-0000-0000-000000000013', 35000.00, 'mercadopago',   NOW() - INTERVAL '15 days', EXTRACT(MONTH FROM CURRENT_DATE)::INT, EXTRACT(YEAR FROM CURRENT_DATE)::INT),
  ('bbbbbbbb-0000-0000-0000-000000000014', 25000.00, 'efectivo',      NOW() - INTERVAL '27 days', EXTRACT(MONTH FROM CURRENT_DATE)::INT, EXTRACT(YEAR FROM CURRENT_DATE)::INT),
  ('bbbbbbbb-0000-0000-0000-000000000003', 35000.00, 'efectivo',      NOW() - INTERVAL '33 days', EXTRACT(MONTH FROM CURRENT_DATE - 30)::INT, EXTRACT(YEAR FROM CURRENT_DATE - 30)::INT),
  ('bbbbbbbb-0000-0000-0000-000000000005', 25000.00, 'transferencia', NOW() - INTERVAL '45 days', EXTRACT(MONTH FROM CURRENT_DATE - 45)::INT, EXTRACT(YEAR FROM CURRENT_DATE - 45)::INT),
  ('bbbbbbbb-0000-0000-0000-000000000010', 90000.00, 'mercadopago',   NOW() - INTERVAL '91 days', EXTRACT(MONTH FROM CURRENT_DATE - 91)::INT, EXTRACT(YEAR FROM CURRENT_DATE - 91)::INT);

-- ASISTENCIAS (algunos ingresos recientes, incluido uno en otra sede)
INSERT INTO asistencias (socio_id, sede_id, fecha_hora) VALUES
  ('bbbbbbbb-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', NOW() - INTERVAL '1 day'),
  ('bbbbbbbb-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222', NOW() - INTERVAL '3 days'),
  ('bbbbbbbb-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', NOW() - INTERVAL '2 hours'),
  ('bbbbbbbb-0000-0000-0000-000000000008', '22222222-2222-2222-2222-222222222222', NOW() - INTERVAL '5 hours'),
  ('bbbbbbbb-0000-0000-0000-000000000009', '22222222-2222-2222-2222-222222222222', NOW() - INTERVAL '1 day'),
  ('bbbbbbbb-0000-0000-0000-000000000013', '22222222-2222-2222-2222-222222222222', NOW() - INTERVAL '2 days');
