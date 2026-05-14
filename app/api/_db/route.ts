// este fichero es un endpoint que devuelve todas las tablas de la base de datos
// y las relaciones entre ellas
// se accede a el mediante la ruta /api/db
// y devuelve un json con todas las tablas y sus relaciones
// y los últimos 10 registros de cada tabla
//

import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const relaciones = await sql`
      SELECT
        conname AS constraint_name,
        conrelid::regclass AS table_name,
        a.attname AS column_name,
        confrelid::regclass AS foreign_table_name,
        af.attname AS foreign_column_name
      FROM
        pg_constraint c
      JOIN pg_attribute a ON a.attnum = ANY(c.conkey) AND a.attrelid = c.conrelid
      JOIN pg_attribute af ON af.attnum = ANY(c.confkey) AND af.attrelid = c.confrelid
      WHERE conname = 'constraint_1';`;
    // Obtenemos los últimos 10 clientes, artículos empresas usuarios y facturas
    const customers = await sql`SELECT * FROM customers;`;
    const articulos = await sql`SELECT * FROM articulos;`;
    const invoices = await sql`SELECT * FROM invoices;`;
    const empresas = await sql`SELECT * FROM empresas;`;
    const users = await sql`SELECT * FROM users;`;


    // Devolvemos todos los datos de forma estructurada
    return NextResponse.json({
      relaciones: relaciones.rows,
      customers: customers.rows,
      articulos: articulos.rows,
      invoices: invoices.rows,
      empresas: empresas.rows,
      users: users.rows,

    });

  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
