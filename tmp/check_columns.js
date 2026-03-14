const { sql } = require("@vercel/postgres");
require("dotenv").config({ path: ".env.local" });

async function checkColumns() {
  try {
    const result = await sql`SELECT * FROM invoices LIMIT 1`;
    console.log(Object.keys(result.rows[0]));
  } catch (err) {
    console.error(err);
  }
}

checkColumns();
