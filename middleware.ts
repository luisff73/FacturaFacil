import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  // Intentar obtener el token de la sesión
  const session = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  console.log(session?.type);
  console.log(request.nextUrl.pathname);
  console.log("Middleware ejecutado - Sesión obtenida:", session);

  // Rutas protegidas
  const protectedPaths = ["/dashboard"];

  // Verificar si la ruta actual es una ruta protegida
  const isProtectedPath = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );
  console.log("Ruta actual:", request.nextUrl.pathname);
  console.log("Comprobando ruta protegida", protectedPaths);

  // Log para verificar si la ruta está protegida
  console.log("Ruta protegida:", isProtectedPath);

  // Si la ruta es protegida y no hay sesión, redirigir a la página de login
  if (isProtectedPath && !session) {
    console.log("Redirigiendo a login, no hay sesión");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Si el usuario no es admin y está intentando acceder a /dashboard/users, denegar acceso
  if (
    request.nextUrl.pathname.startsWith("/dashboard/users") &&
    session?.type !== "admin"
  ) {
    console.log("Acceso denegado a /dashboard/users, no es admin");
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|.*\\.png$).*)",
    //"/dashboard/:path*", // Protege todas las rutas bajo /dashboard
    "/dashboard/users", // Protege la ruta /dashboard/users
  ],
};
