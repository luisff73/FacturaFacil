import NextAuth, { AuthOptions } from 'next-auth';

import authConfig from '@/auth.config';
import { NextApiRequest, NextApiResponse } from 'next';

const authOptions: AuthOptions = {
  ...authConfig,
  debug: true, // Modo debug para ver logs detallados
  pages: {
    signIn: '/login',
    error: '/login', // Código de error pasado en la cadena de consulta como ?error=
  },
  callbacks: {
    async session({ session, token }) {
      // Incluir user.id en el objeto session
      if (token && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    }
  }
};

export default async function authHandler(req: NextApiRequest, res: NextApiResponse) {
  // Manejo de errores
  try {
    return await NextAuth(req, res, authOptions);
  } catch (error) {
    console.error('Error de autenticación:', error);
    res.status(500).json({ error: 'Error Interno del Servidor' });
  }
}