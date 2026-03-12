import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  session: { strategy: 'jwt' },
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  providers: [
 
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.type = user.type;
        token.id_empresa = user.id_empresa;
        token.css = (user as any).css;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id_empresa) {
        session.user.id_empresa = token.id_empresa;
        session.user.type = token.type;
        (session.user as any).css = (token as any).css;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user && !!(auth.user as any).id_empresa;
      const isAdmin = (auth?.user as any)?.type === 'admin';
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      const isOnUsersAdmin = nextUrl.pathname.startsWith('/dashboard/users');
      const isOnLogin = nextUrl.pathname.startsWith('/login');
      // Las rutas de creación de empresa deben ser públicas porque se está registrando la primera vez
      const isEmpresaRegistration = nextUrl.pathname === '/dashboard/empresas/create' || nextUrl.pathname === '/dashboard/empresas';
      
      if (isOnDashboard && !isEmpresaRegistration) {
        if (isLoggedIn) {
          // Si intenta acceder a cualquier ruta relativa a usuarios y NO es admin, se le devuelve a dashboard
          if (isOnUsersAdmin && !isAdmin) {
             return Response.redirect(new URL('/dashboard', nextUrl));
          }
          return true;
        }
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn && isOnLogin) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
  },
} satisfies NextAuthConfig;
