
import { sql } from "@vercel/postgres";
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const tableInfo = await sql`
      SELECT column_name, data_type, numeric_precision, numeric_scale
      FROM information_schema.columns
      WHERE table_name = 'articulos'
    `;
    return NextResponse.json(tableInfo.rows);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
