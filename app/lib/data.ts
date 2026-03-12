// Importamos la función sql de la librería @vercel/postgres
// sql: Esta es una función proporcionada por la librería @vercel/postgres.
// Se utiliza para interactuar con una base de datos PostgreSQL.
// Permite ejecutar consultas SQL de manera segura y eficiente.
import { sql } from "@vercel/postgres";
import { auth } from "../../auth";

// Importación de tipos y definiciones desde ./definitions:
import {
  Customer,
  CustomersTableType,
  Invoice,
  InvoicesTable,
  LatestInvoiceRaw,
  Revenue,
  ArticulosTableType,
  User,
  Empresas,
} from "./definitions";

import { formatCurrency } from "./utils";

// helper que extrae id_empresa del usuario autenticado
export async function requireEmpresaId(): Promise<number> {
  const session = await auth();
  if (!session || !session.user || !session.user.id_empresa) {
    // He habilitado la ruta /dashboard/empresas como pública, así que 
    // cuando no haya usuario retornara un ID ficticio (0) que los queries de SQL
    // buscarán sin romper el build en vez de forzar una intercepción por código.
    return 0;
  }
  return Number(session.user.id_empresa);
}

export async function fetchRevenue() {
  try {
    const data = await sql<Revenue>`SELECT * FROM revenue`;

    return data.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Error en el fetch revenue data.");
  }
}

export async function fetchLatestInvoices() {
  const idEmpresa = await requireEmpresaId();
  try {
    //Cambiar el 1 por el id de la empresa que quieras mostrar las facturas
    const data = await sql<LatestInvoiceRaw>`
      SELECT 
        invoices.amount,
        customers.name,
        customers.image_url,
        customers.email,
        invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE invoices.id_empresa = ${idEmpresa}
      ORDER BY invoices.date DESC
      LIMIT 5`;

    const latestInvoices = data.rows.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    return latestInvoices;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Error en el fetch the latest invoices.");
  }
}

export async function fetchCardData() {
  const idEmpresa = await requireEmpresaId();
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices where invoices.id_empresa = ${idEmpresa}`;
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers where customers.id_empresa = ${idEmpresa}`;
    const invoiceStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'Pagada' THEN amount ELSE 0 END) AS "Pagada",
         SUM(CASE WHEN status = 'Pendiente' THEN amount ELSE 0 END) AS "Pendiente",
         SUM(CASE WHEN status = 'Proforma' THEN amount ELSE 0 END) AS "Proforma"
         FROM invoices where invoices.id_empresa = ${idEmpresa}`;

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfInvoices = Number(data[0].rows[0].count ?? "0");
    const numberOfCustomers = Number(data[1].rows[0].count ?? "0");
    const totalPaidInvoices = formatCurrency(data[2].rows[0].Pagada ?? "0");
    const totalPendingInvoices = formatCurrency(
      data[2].rows[0].Pendiente ?? "0",
    );
    const totalProformaInvoices = formatCurrency(
      data[2].rows[0].Proforma ?? "0",
    );

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
      totalProformaInvoices,
    };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Error en el fetch card data.");
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  const idEmpresa = await requireEmpresaId();
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
      where invoices.id_empresa = ${idEmpresa} AND (
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`})
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Error en el fetch facturas.");
  }
}

export async function fetchInvoicesPages(query: string) {
  const idEmpresa = await requireEmpresaId();
  try {
    const count = await sql`SELECT COUNT(*)
    FROM invoices 
    JOIN customers ON invoices.customer_id = customers.id
    where invoices.id_empresa = ${idEmpresa} AND (
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`})
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Error en el fetch total number de facturas.");
  }
}

export async function fetchInvoiceById(id: string) {
  const idEmpresa = await requireEmpresaId();
  try {
    const data = await sql<Invoice>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices where invoices.id_empresa = ${idEmpresa}
      and invoices.id = ${id};
    `;

    const invoice = data.rows.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));
    console.log(invoice); // Devolvera Invoice que es un array vacio []
    return invoice[0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Error en el fetch facturas.");
  }
}

export async function fetchCustomers() {
  const idEmpresa = await requireEmpresaId();
  try {
    const data = await sql<Customer>`
      SELECT
        id,
        name
      FROM customers where customers.id_empresa = ${idEmpresa}
      ORDER BY name ASC
    `;

    const customers = data.rows;
    return customers;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Error en el fetch all clientes.");
  }
}

export async function fetchCustomersById(id: string) {
  const idEmpresa = await requireEmpresaId();
  try {
    const data = await sql<Customer>`
      SELECT *
      FROM customers
      WHERE id = ${id} and id_empresa = ${idEmpresa};
    `;

    const customer = data.rows.map((customer) => ({
      ...customer,
    }));
    console.log(customer);
    return customer[0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Error en el fetch cliente.");
  }
}

export async function fetchCustomersPages(query: string) {
  const idEmpresa = await requireEmpresaId();
  try {
    const count = await sql`SELECT COUNT(*)
    FROM customers
    WHERE customers.id_empresa = ${idEmpresa}
    AND (
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`})`;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Error en el fetch total number of clientes.");
  }
}

export async function fetchFilteredCustomers(query: string) {
  const idEmpresa = await requireEmpresaId();
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
    WHERE customers.id_empresa = ${idEmpresa} AND (
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} )
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
    console.error("Database Error:", err);
    throw new Error("Error en el fetch de la tabla de clientes.");
  }
}
export async function fetchFilteredArticulos(query: string) {
  const idEmpresa = await requireEmpresaId();
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
      WHERE articulos.id_empresa = ${idEmpresa} AND (
        codigo ILIKE ${`%${query}%`} OR
        descripcion ILIKE ${`%${query}%`}
      )
      ORDER BY codigo ASC
    `;

    const articulos = data.rows.map((articulo) => ({
      ...articulo,
    }));

    return articulos;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Error en el fetch en la tabla de articulos.");
  }
}

export async function fetchArticulosPages(query: string) {
  const idEmpresa = await requireEmpresaId();
  try {
    const count = await sql`SELECT COUNT(*)
    FROM articulos
    WHERE articulos.id_empresa = ${idEmpresa} AND (
      articulos.codigo ILIKE ${`%${query}%`} OR
      articulos.descripcion ILIKE ${`%${query}%`}
    )
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Error en el fetch total number de articulos.");
  }
}

export async function fetchArticulosById(
  id: string,
): Promise<ArticulosTableType | null> {
  const idEmpresa = await requireEmpresaId();
  try {
    const data = await sql<ArticulosTableType>`
      SELECT id, codigo, descripcion, precio, iva, stock, imagen
      FROM  articulos 
      WHERE articulos.id_empresa = ${idEmpresa} AND id = ${id}`;

    const articulos = data.rows.map((articulo) => ({
      ...articulo,
      precio: parseFloat(articulo.precio as unknown as string),
      iva: parseFloat(articulo.iva as unknown as string),
      stock: parseFloat(articulo.stock as unknown as string),
      imagen: articulo.imagen, // Ya no necesitas JSON.parse aquí
    }));

    return articulos[0] || null;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Error en el fetch de la tabla articulos.");
  }
}

export async function fetchArticulos() {
  const idEmpresa = await requireEmpresaId();
  try {
    const data = await sql<ArticulosTableType>`
      SELECT *
      FROM articulos where articulos.id_empresa = ${idEmpresa}
      ORDER BY codigo ASC
    `;

    const articulos = data.rows;
    return articulos;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Error en el fetch all de la tabla articulos.");
  }
}
export async function fetchUsers() {
  const idEmpresa = await requireEmpresaId();
  try {
    const data = await sql<User>`
      SELECT *
      FROM users where users.id_empresa = ${idEmpresa}
      ORDER BY name ASC
    `;

    const users = data.rows;
    return users;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Error en el fetch all de la tabla.");
  }
}
export async function fetchFilteredUsers(query: string) {
  const idEmpresa = await requireEmpresaId();
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
      WHERE users.id_empresa = ${idEmpresa} AND (
        name ILIKE ${`%${query}%`} OR
        email ILIKE ${`%${query}%`}
      )
      ORDER BY name ASC
    `;

    const user = data.rows.map((user) => ({
      ...user,
    }));

    return user;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Error en el fetch de la tabla users.");
  }
}
export async function fetchUsersById(id: string): Promise<User | null> {
  const idEmpresa = await requireEmpresaId();
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
      WHERE users.id_empresa = ${idEmpresa} AND id = ${id};
    `;

    const users = data.rows.map((users) => ({
      ...users,
    }));

    return users[0] || null;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Error en el fetch de la tabla users.");
  }
}

export async function fetchEmpresaById(id: string): Promise<Empresas | null> {
  try {
    const data = await sql<Empresas>`
      SELECT
        id,
        nombre,
        direccion,
        c_postal,
        poblacion,
        provincia,
        cif,
        telefono,
        email,
        iva,
        recargo_equivalencia,
        activa,
        password,
        fecha_creacion
      FROM empresas
      WHERE id = ${id};
    `;

    const empresas = data.rows.map((empresas) => ({
      ...empresas,
    }));

    return empresas[0] || null;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Error en el fetch de la tabla empresas.");
  }
}

export async function fetchEmpresas() {
  try {
    const data = await sql<Empresas>`
      SELECT *
      FROM empresas 
      ORDER BY nombre ASC
    `;

    const empresas = data.rows;
    return empresas;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Error en el fetch all de la tabla empresas.");
  }
}

/**
 * Para búsqueda y paginación en la lista de empresas.
 * Se usa desde el componente de tabla y también para calcular
 * el número total de páginas en la interfaz.
 */
export async function fetchEmpresasPages(query: string) {
  try {
    const count = await sql`SELECT COUNT(*)
      FROM empresas
      where (
        nombre ILIKE ${`%${query}%`} OR
        email ILIKE ${`%${query}%`}
      )`;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Error en el fetch total number de empresas.");
  }
}

export async function fetchFilteredEmpresas(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    const data = await sql<Empresas>`
      SELECT *
      FROM empresas
      WHERE 
        nombre ILIKE ${`%${query}%`} OR
        email ILIKE ${`%${query}%`}
      
      ORDER BY nombre ASC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return data.rows;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Error en el fetch filtrado de la tabla empresas.");
  }
}
