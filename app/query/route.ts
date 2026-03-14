import { db } from "@vercel/postgres";

const client = await db.connect(); // Conexion a la base de datos.

async function listInvoices() { // Función que realiza la consulta a la base de datos.
	const data = await client.sql`
    SELECT invoices.base_imponible, customers.name
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE invoices.base_imponible = 666;
  `;

	return data.rows;
}

export async function GET() {

  try {
  	return Response.json(await listInvoices());
  } catch (error) {
  	return Response.json({ error }, { status: 500 });
  }
}
