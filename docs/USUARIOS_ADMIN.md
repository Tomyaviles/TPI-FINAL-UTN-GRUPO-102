# Usuarios admin para desarrollo

Con RLS activo la app no ve ningún dato si no estás logueado con un usuario que tenga perfil.
Por ahora cada integrante tiene un usuario **admin** que puede leer y escribir todo
(política de `supabase/migrations/20261012120000_politicas_admin.sql`).

## 1. Aplicar la migración de políticas

En Supabase → SQL Editor, pegar y ejecutar el contenido de
`supabase/migrations/20261012120000_politicas_admin.sql`.
(O `npm run db:push` si tenés el proyecto vinculado con la CLI.)

## 2. Crear el usuario en Auth

Supabase → Authentication → Users → **Add user** → *Create new user*:

- Email y contraseña (mínimo 6 caracteres).
- Tildar **Auto Confirm User**, así no pide confirmar por mail.

## 3. Cargarle el perfil con rol admin

En el SQL Editor, cambiando el email y el nombre:

```sql
INSERT INTO perfiles (id, nombre, rol)
SELECT id, 'Franco Siri', 'admin'
FROM auth.users
WHERE email = 'franco@ejemplo.com';
```

Repetir para cada integrante. Para revisar que quedaron bien:

```sql
SELECT u.email, p.nombre, p.rol
FROM perfiles p
JOIN auth.users u ON u.id = p.id;
```

## 4. Probar

`npm run dev`, entrar a http://localhost:3000 → redirige a `/login`.
Después de ingresar, el Dashboard muestra tu nombre y rol, y la cantidad de registros por tabla.

Si dice *"Tu usuario no tiene perfil cargado"*, faltó el paso 3.
Si los contadores dan 0, faltó el paso 1.

## Funciones disponibles (`src/lib/auth.ts`)

| Función | Qué hace |
|---|---|
| `obtenerUsuario()` | Usuario de Supabase Auth o `null` |
| `obtenerPerfil()` | Fila de `perfiles` del usuario logueado (rol, sede) o `null` |
| `tieneRol(perfil, roles)` | `true` si el perfil tiene alguno de los roles |
| `esAdmin(perfil)` | Atajo de `tieneRol(perfil, ["admin"])` |
| `requerirRol(roles)` | Para el inicio de una página: si no corresponde, redirige |

Ejemplo en una página que solo ve admin y recepción:

```tsx
export default async function SociosPage() {
  const perfil = await requerirRol(["admin", "recepcion"]);
  // ...
}
```

## Roles y permisos

Qué ve cada rol en el menú está en `src/lib/permisos.ts` (lista `SECCIONES`).
Si agregás una pantalla nueva, sumala ahí con sus roles y poné `requerirRol([...])`
al principio de la página.

| Rol | Secciones | Datos (RLS, `20261013120000_politicas_por_rol.sql`) |
|---|---|---|
| Administrador | Todas + Usuarios | Todo |
| Recepción | Socios, Cobros, Ingreso | Socios, pagos y asistencias de su sede |
| Profesor | (ninguna por ahora, va a `/inicio`) | Lectura de socios y asistencias de su sede |
| Socio | Ingreso | Solo sus propios datos |

Sedes y planes los pueden leer todos, pero solo el admin los modifica.

## Crear recepcionistas y profesores desde la app

La pantalla **Usuarios** (solo admin) crea el usuario en Auth y su perfil de una.
Necesita la secret key en `.env.local`:

```
SUPABASE_SECRET_KEY=sb_secret_...
```

Se saca de Supabase → Project Settings → API Keys → Secret keys. No se sube al repo
ni se pega en ningún lado público: con esa key se saltea todo el RLS.
