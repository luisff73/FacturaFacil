import { sql } from "@vercel/postgres";
import { config } from "dotenv";
config({ path: ".env.local" });

async function checkSchema() {
  try {
    const result = await sql`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'invoices'`;
    console.log(JSON.stringify(result.rows, null, 2));
  } catch (err) {
    console.error(err);
  }
}

checkSchema();
