 
// Importamos la función sql de la librería @vercel/postgres
// sql: Esta es una función proporcionada por la librería @vercel/postgres. 
// Se utiliza para interactuar con una base de datos PostgreSQL. 
// Permite ejecutar consultas SQL de manera segura y eficiente.
import { sql } from '@vercel/postgres';


// Importación de tipos y definiciones desde ./definitions:
import {
  Customer,
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  Revenue,
  ArticulosTableType,
  User,
} from './definitions';




import { formatCurrency } from './utils';

export async function fetchRevenue() {
  
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    // console.log('Fetching revenue data...');
    // await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await sql<Revenue>`SELECT * FROM revenue`;

    // console.log('Data fetch completed after 3 seconds.');

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Error en el fetch revenue data.');
  }
}

export async function fetchLatestInvoices() {
  try {
    const data = await sql<LatestInvoiceRaw>`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5`;

    const latestInvoices = data.rows.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Error en el fetch the latest invoices.');
  }
}

export async function fetchCardData() {
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    const invoiceStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'Pagada' THEN amount ELSE 0 END) AS "Pagada",
         SUM(CASE WHEN status = 'Pendiente' THEN amount ELSE 0 END) AS "Pendiente",
         SUM(CASE WHEN status = 'Proforma' THEN amount ELSE 0 END) AS "Proforma"
         FROM invoices`;

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfInvoices = Number(data[0].rows[0].count ?? '0');
    const numberOfCustomers = Number(data[1].rows[0].count ?? '0');
    const totalPaidInvoices = formatCurrency(data[2].rows[0].Pagada ?? '0');
    const totalPendingInvoices = formatCurrency(data[2].rows[0].Pendiente ?? '0');
    const totalProformaInvoices = formatCurrency(data[2].rows[0].Proforma ?? '0');

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
      totalProformaInvoices
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Error en el fetch card data.');
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await sql<InvoicesTable>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Error en el fetch invoices.');
  }
}

export async function fetchInvoicesPages(query: string) {
  try {
    const count = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Error en el fetch total number of invoices.');
  }
}

export async function fetchInvoiceById(id: string) {
  try {
    const data = await sql<InvoiceForm>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id};
    `;

    const invoice = data.rows.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));
    console.log(invoice); // Devolvera Invoice que es un array vacio []
    return invoice[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Error en el fetch invoice.');
  }
}

export async function fetchCustomers() {
  try {
    const data = await sql<CustomerField>`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `;

    const customers = data.rows;
    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Error en el fetch all customers.');
  }
}

export async function fetchCustomersById(id: string) {

  
  try {
    const data = await sql<Customer>`
      SELECT *
      FROM customers
      WHERE id = ${id};
    `;

    const customer = data.rows.map((customer) => ({
      ...customer,
    }));
    console.log(customer);
    return customer[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Error en el fetch customer.');
  }
}

export async function fetchCustomersPages(query: string) {
  try {
    const count = await sql`SELECT COUNT(*)
    FROM customers
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Error en el fetch total number of customers.');
  }
}

export async function fetchFilteredCustomers(query: string) {

  // const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  
  try {
    const data = await sql<CustomersTableType>`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'Pendiente' THEN invoices.amount ELSE 0 END) AS total_pendiente,
		  SUM(CASE WHEN invoices.status = 'Pagada' THEN invoices.amount ELSE 0 END) AS total_pagada,
      SUM(CASE WHEN invoices.status = 'Proforma' THEN invoices.amount ELSE 0 END) AS total_proforma
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
	  `;

    const customers = data.rows.map((customer) => ({
      ...customer,
      total_pendiente: formatCurrency(customer.total_pendiente),
      total_pagada: formatCurrency(customer.total_pagada),
      total_proforma: formatCurrency(customer.total_proforma),
    }));

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Error en el fetch de la tabla de clientes customer.');
  }
}
export async function fetchFilteredArticulos(query: string) {

  // const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  
  try {
    const data = await sql<ArticulosTableType>`
      SELECT
        id,
        codigo,
        descripcion,
        precio,
        iva,
        stock,
        imagen AS imagen
      FROM articulos
      WHERE
        codigo ILIKE ${`%${query}%`} OR
        descripcion ILIKE ${`%${query}%`}
      ORDER BY codigo ASC
    `;
  
    const articulos = data.rows.map((articulo) => ({
      ...articulo,
    }));
  
    return articulos;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Error en el fetch en la tabla de articulos.');
  }
}

export async function fetchArticulosPages(query: string) {
  try {
    const count = await sql`SELECT COUNT(*)
    FROM articulos
    WHERE
      articulos.codigo ILIKE ${`%${query}%`} OR
      articulos.descripcion ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Error en el fetch total number de articulos.');
  }
}

export async function fetchArticulosById(id: string): Promise<ArticulosTableType | null> {
  try {
    const data = await sql<ArticulosTableType>`
      SELECT id, codigo, descripcion, precio, iva, stock, imagen
      FROM articulos
      WHERE id = ${id};
    `;

    const articulos = data.rows.map((articulo) => ({
      ...articulo,
      precio: parseFloat(articulo.precio as unknown as string),
      iva: parseFloat(articulo.iva as unknown as string),
      stock: parseFloat(articulo.stock as unknown as string),
      imagen: articulo.imagen // Ya no necesitas JSON.parse aquí
    }));
    
    return articulos[0] || null;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Error en el fetch de la tabla articulos.');
  }
}

export async function fetchArticulos() {
  try {
    const data = await sql<ArticulosTableType>`
      SELECT *
      FROM articulos
      ORDER BY codigo ASC
    `;

    const articulos = data.rows;
    return articulos;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Error en el fetch all de la tabla articulos.');
  }
}
export async function fetchUsers() {
  try {
    const data = await sql<User>`
      SELECT *
      FROM users
      ORDER BY name ASC
    `;

    const users = data.rows;
    return users;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Error en el fetch all de la tabla.');
  }
}
export async function fetchFilteredUsers(query: string) {
  
  try {
    const data = await sql<User>`
      SELECT
        id,
        name,
        email,
        password,
        type,
        token
      FROM users
      WHERE
        name ILIKE ${`%${query}%`} OR
        email ILIKE ${`%${query}%`}
      ORDER BY name ASC
    `;
  
    const user = data.rows.map((user) => ({
      ...user,
    }));
  
    return user;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Error en el fetch de la tabla users.');
  }
}
export async function fetchUsersById(id: string): Promise<User | null> {
  try {
    const data = await sql<User>`
      SELECT
        id,
        name,
        email,
        password,
        type,
        token
      FROM users
      WHERE id = ${id};
    `;

    const users = data.rows.map((users) => ({
      ...users,
    }));
    
    return users[0] || null;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Error en el fetch de la tabla users.');
  }
}
