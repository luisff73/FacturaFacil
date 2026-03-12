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

export const { handlers, auth, signIn, signOut } = NextAuth({
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
              id_empresa: user.id_empresa, // Incluir el campo id_empresa
            };
        }

        console.log("Invalid credentials");
        return null;
      },
    }),
  ],
});
