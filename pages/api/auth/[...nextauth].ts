import NextAuth from 'next-auth';
import authConfig from '@/auth.config';
import { NextApiRequest, NextApiResponse } from 'next';

const authOptions = {
  ...authConfig,
  secret: process.env.NEXTAUTH_SECRET, // Añade tu secreto aquí
};

export default function authHandler(req: NextApiRequest, res: NextApiResponse) {
  return NextAuth(req, res, authOptions);
}