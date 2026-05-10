import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  session: { 
    strategy: 'jwt',
    maxAge: 30 * 60, // 30 minutos (1800 segundos)
    updateAge: 0,    // Se actualiza en cada petición para resetear el contador de inactividad
  },
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  providers: [
 
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.type = user.type;
        token.id_empresa = user.id_empresa;
        token.css = (user as any).css;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.id_empresa = token.id_empresa as number;
        session.user.type = token.type as "admin" | "user";
        (session.user as any).css = (token as any).css;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user; // si esta logueado
      const hasEmpresa = !!(auth?.user as any)?.id_empresa; // si tiene empresa
      const isAdmin = (auth?.user as any)?.type === 'admin'; // si es admin
      
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard'); // si esta en el dashboard
      const isOnLogin = nextUrl.pathname === '/login'; // si esta en el login
      const isPublicEmpresaPath = nextUrl.pathname === '/dashboard/empresas/create' || nextUrl.pathname === '/dashboard/empresas'; // si esta en la creacion de empresas
      const isUsersAdminPath = nextUrl.pathname.startsWith('/dashboard/users'); // si esta en la ruta de usuarios
      const isAuditPath = nextUrl.pathname.startsWith('/dashboard/audit'); // si esta en la ruta de auditoria
      const isEmpresasAdminPath = (nextUrl.pathname.startsWith('/dashboard/empresas') && !isPublicEmpresaPath);

      // Si estamos en el dashboard
      if (isOnDashboard) {
        // PERMITIR registro de empresa sin id_empresa (pero logueado)
        if (isPublicEmpresaPath) {
          return true; // Permitimos a los usuarios logueados o no el registro de empresa inicial
        }

        // Proteger rutas admin
        if ((isUsersAdminPath || isEmpresasAdminPath || isAuditPath) && !isAdmin) {
          return Response.redirect(new URL('/dashboard', nextUrl));
        }

        // Para el resto del dashboard REQUIRE login + id_empresa
        if (!isLoggedIn || !hasEmpresa) return false;

        // Si es ruta de usuarios o empresas administrador y NO es admin, redirigir al dashboard
        if ((isUsersAdminPath || isEmpresasAdminPath) && !isAdmin) {
          return Response.redirect(new URL('/dashboard', nextUrl));
        }

        return true;
      }

      // Si está logueado e intenta ir a login, redirigir al dashboard
      if (isOnLogin && isLoggedIn && hasEmpresa) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
