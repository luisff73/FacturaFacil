require('dotenv').config({ path: '.env.local' });
const { sql } = require('@vercel/postgres');

async function checkConstraint() {
  try {
    const res = await sql`
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
      WHERE conname = 'constraint_1';
    `;
    console.log("Constraint info:", res.rows);
  } catch(e) {
    console.error(e);
  }
}
checkConstraint();
