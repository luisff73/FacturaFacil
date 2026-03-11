import NextAuth from "next-auth"; // biblioteca de autenticación
import Credentials from "next-auth/providers/credentials"; // proveedor de autenticación de credenciales
import bcrypt from "bcrypt";
import { sql } from "@vercel/postgres";
import { z } from "zod";
import type { JWT } from "next-auth/jwt";
import type { User } from "@/app/lib/definitions";
import { authConfig } from "./auth.config";
import type { AdapterUser } from "next-auth/adapters"; // Importar el tipo AdapterUser

// esta función obtiene un usuario de la base de datos por su email
async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0];
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      //
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;

          const user = await getUser(email);
          if (!user) return null;
          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch)
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              type: user.type, // Incluir el campo type en el objeto de usuario
            };
        }

        console.log("Invalid credentials");
        return null;
      },
    }),
  ],
  // Este callback se ejecuta cada vez que se crea un token JWT
  callbacks: {
    async jwt({ token, user }) {
      // Si el usuario existe, añadir los campos type e id_empresa al token
      if (user) {
        token = {
          ...token,
          type: (user as User).type,
          id_empresa: (user as any).id_empresa,
        };
      }
      console.log("JWT Token contenido:", token); // muestra todo el contenido del token
      console.log("Type en el token:", token.type);
      console.log("id_empresa en el token:", (token as any).id_empresa);
      return token;
    },
    async session({ session, token }) {
      console.log("Sesión actual:", session);
      console.log("Token en sesión:", token);
      // incluir id_empresa en el objeto user de la sesión para poder accederlo
      if (session.user && (token as any).id_empresa) {
        (session.user as any).id_empresa = (token as any).id_empresa;
      }
      return session;
    },
  },
});
