// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type User = {
  id: string;
  id_empresa: number;
  name: string;
  email: string;
  password: string;
  token: string;
  type: "admin" | "user";
  css: string;
  image_url: string;
};


export type Customer = {
  id: string;
  id_empresa: number;
  name: string;
  email: string;
  image_url: string;
  direccion: string;
  c_postal: string;
  poblacion: string;
  provincia: string;
  telefono: string;
  cif: string;
  pais: string;
  tiene_iva: boolean;
  tiene_re: boolean;
};


export type CustomersTableType = Customer & {
  // añadimos las propiedades de total_invoices, total_pendiente, total_pagada y total_proforma a la tabla de clientes
  total_invoices: number;
  total_pendiente: number;
  total_pagada: number;
  total_proforma: number;
};

export type Invoice = {
  // definicion base de la tabla de facturas sin formatear, con el base_imponible como number
  id: string;
  id_empresa: number;
  customer_id: string;
  base_imponible: number;
  // In TypeScript, this is called a string union type.
  // It means that the "status" property can only be one of the two strings: 'Pendiente' or 'Pagada'.
  status: "Pendiente" | "Pagada" | "Proforma";
  date: string;
  total_iva: number;
  total_recargo: number;
  total_factura: number;
};

export type LatestInvoice = {
  id: string;
  id_empresa: number;
  name: string;
  image_url: string;
  email: string;
  base_imponible: string;
  total_factura: string;
};

export type InvoicesTable = {
  id: string;
  id_empresa: number;
  customer_id: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  base_imponible: number;
  status: "Pendiente" | "Pagada" | "Proforma";
  total_iva: number;
  total_recargo: number;
  total_factura: number;
};

export type invoices_lines = {
  id: number;
  linea: number;
  descripcion: string;
  observaciones: string;
  cantidad: number;
  precio: number;
  total: number;
  id_articulo: number;
  id_invoice: number;
  id_empresa: number;
};

export type Revenue = {
  id_empresa: number;
  month: string;
  revenue: number;
};

// The database returns a number for base_imponible, but we later format it to a string with the formatCurrency function
export type LatestInvoiceRaw = Omit<LatestInvoice, "base_imponible"> & {
  base_imponible: number;
};

export type FormattedCustomersTable = {
  id: string;
  id_empresa: number;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pendiente: string;
  total_pagada: string;
  total_proforma: string;
};

export type ArticulosTableType = {
  id: string;
  id_empresa: number;
  codigo: string;
  descripcion: string;
  precio: number;
  iva: number;
  stock: number;
  imagen: { id: number; ruta: string }[] | null; // imagen puede ser null
};

export type Empresas = {
  id: number;
  nombre: string;
  direccion: string;
  c_postal: string;
  poblacion: string;
  provincia: string;
  cif: string;
  telefono: string;
  email: string;
  iva: number;
  password: string;
  fecha_creacion: Date;
  activa: boolean;
};
