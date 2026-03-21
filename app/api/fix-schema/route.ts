
import { sql } from "@vercel/postgres";
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await sql`ALTER TABLE articulos ALTER COLUMN stock TYPE NUMERIC(20,2)`;
    await sql`ALTER TABLE articulos ALTER COLUMN iva TYPE NUMERIC(10,2)`;
    await sql`ALTER TABLE articulos ALTER COLUMN precio TYPE NUMERIC(20,2)`;
    return NextResponse.json({ message: "Columnas de la tabla articulos actualizadas correctamente!" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
