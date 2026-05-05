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

  tipo: "Pedido" | "Factura";
  status: "Pendiente" | "Pagada";
  date: string;
  total_iva: number;
  total_recargo: number;
  total_factura: number;
  invoice_number: number;
  invoice_serie: string;
  hash?: string;
  prev_hash?: string;
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
  cif: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  base_imponible: number;
  tipo: "Pedido" | "Factura";
  status: "Pendiente" | "Pagada";
  total_iva: number;
  total_recargo: number;
  total_factura: number;
  invoice_number:number;
  invoice_serie:string;  
  hash?: string;
  prev_hash?: string;
};

export type invoices_lines = {
  id: number;
  linea: number;
  descripcion: string;
  observaciones: string;
  cantidad: number;
  precio: number;
  total: number;
  id_articulo: string;
  id_invoice: number;
  id_empresa: number;
  iva: number;
  re: number;
};

export type Revenue = {
  id_empresa: number;
  month: string;
  revenue: number;
};

// La base de datos devuelve un número para base_imponible,
// pero luego lo formateamos a una cadena con la función formatCurrency 
// para mostrarlo en la tabla
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
  logotipo: string;
  fecha_creacion: Date;
  activa: boolean;
};

export type Series = {
  id: string;
  id_empresa: number;
  name: string;
}
