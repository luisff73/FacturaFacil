import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import bcrypt from "bcrypt";
import { sql } from "@vercel/postgres";
import { z } from "zod";
import type { User } from "@/app/lib/definitions";

// Función para obtener un usuario por email
async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0];
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

// Configuración de NextAuth.js
const authOptions = {
  pages: {
    signIn: "/login", // Ruta personalizada para el inicio de sesión
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;

          // Busca el usuario en la base de datos
          const user = await getUser(email);
          if (!user) return null;

          // Compara la contraseña hasheada
          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch) return user;
        }

        console.log("Invalid credentials");
        return null;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.type = user.type; // Añade el campo type al token JWT
      }
      console.log("Luis este es el token con el type" + token);
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      // Añade el tipo (type) a la sesión
      session.user.type = token.type;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET, // Clave secreta para firmar los tokens
};

// Exporta NextAuth como manejador de API
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };