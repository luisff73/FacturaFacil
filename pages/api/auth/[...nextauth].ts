import NextAuth from 'next-auth';
import authConfig from '@/auth.config';

const authOptions = {
  ...authConfig,
  secret: process.env.AUTH_SECRET, // Add your secret here
};

export const { handlers: { GET, POST } } = NextAuth(authOptions as any);
export default NextAuth(authOptions as any);