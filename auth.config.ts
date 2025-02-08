import type { NextAuthConfig } from 'next-auth';
import { getToken } from 'next-auth/jwt';
import { NextResponse, NextRequest } from "next/server";

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  providers: [
    // added later in auth.ts since it requires bcrypt which is only compatible with Node.js
    // while this file is also used in non-Node.js environments
  ],
  callbacks: {
    authorized: async ({ auth, request }) => {
      const session = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
      });

      console.log(session?.type);
      console.log(request.nextUrl.pathname);

      const isLoggedIn = !!session;
      const isOnDashboard = request.nextUrl.pathname.startsWith('/dashboard');
      const isUsersPath = request.nextUrl.pathname.startsWith('/dashboard/users');
      const isAdmin = session?.type === 'admin';

      if (isUsersPath && !isAdmin) {
        return false;
      }

      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false;
      } else if (isLoggedIn) {
        return NextResponse.redirect(new URL('/dashboard', request.nextUrl));
      }

      return true;
    },  },
} satisfies NextAuthConfig;
