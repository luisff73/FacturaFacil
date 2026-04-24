import { v4 as uuidv4 } from 'uuid';
import { sql } from '@vercel/postgres';

export const generatePasswordResetToken = async (email: string) => {
  const token = uuidv4();
  // El token expirará en 1 hora
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  try {
    // Asegurarnos de que la tabla existe con soporte de zona horaria (TIMESTAMPTZ)
    await sql`
      CREATE TABLE IF NOT EXISTS password_reset_tokens (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        email TEXT NOT NULL,
        token TEXT NOT NULL UNIQUE,
        expires TIMESTAMPTZ NOT NULL
      );
    `;

    // Eliminar tokens antiguos para este email si existen
    await sql`DELETE FROM password_reset_tokens WHERE email = ${email}`;

    // Insertar el nuevo token
    await sql`
      INSERT INTO password_reset_tokens (email, token, expires)
      VALUES (${email}, ${token}, ${expires.toISOString()})
    `;

    return token;
  } catch (error) {
    console.error('Error al generar el token de recuperación:', error);
    return null;
  }
};

export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    const data = await sql`SELECT * FROM password_reset_tokens WHERE token = ${token}`;
    return data.rows[0];
  } catch {
    return null;
  }
};

export const deletePasswordResetToken = async (id: string) => {
  try {
    await sql`DELETE FROM password_reset_tokens WHERE id = ${id}`;
  } catch (error) {
    console.error('Error al eliminar el token:', error);
  }
};
