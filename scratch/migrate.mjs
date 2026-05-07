import { sql } from "@vercel/postgres";

async function main() {
  try {
    await sql`ALTER TABLE invoices ADD COLUMN bloqueada BOOLEAN DEFAULT false;`;
    console.log("Columna 'bloqueada' añadida correctamente a la tabla 'invoices'");
  } catch (err) {
    console.error("Error al añadir la columna:", err);
  }
}

main();
