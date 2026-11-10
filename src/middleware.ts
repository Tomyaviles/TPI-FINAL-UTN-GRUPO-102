import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Corre antes de cada página. Hace dos cosas:
// 1. Refresca la sesión de Supabase (si no, el token vence y te desloguea solo).
// 2. Si no hay usuario logueado manda al /login. Si ya está logueado y entra
//    al /login, lo manda al dashboard.
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Las cookies nuevas se copian al request y a la respuesta
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const enLogin = request.nextUrl.pathname.startsWith("/login");

  if (!user && !enLogin) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (user && enLogin) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

// No hace falta correrlo para archivos estáticos ni imágenes
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
