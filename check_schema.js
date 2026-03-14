
const { sql } = require('@vercel/postgres');

async function checkSchema() {
    try {
        const customers = await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'customers'`;
        console.log('Customers:', customers.rows.map(r => r.column_name).join(', '));
        
        const invoices = await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'invoices'`;
        console.log('Invoices:', invoices.rows.map(r => r.column_name).join(', '));
    } catch (e) {
        console.error(e);
    }
}
checkSchema();
