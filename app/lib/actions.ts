"use server";

import { z } from "zod";
import { put } from "@vercel/blob";
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { signIn, auth, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { validateDocument } from "@/app/lib/valitacionnifcif";
import { generatePasswordResetToken, getPasswordResetTokenByToken, deletePasswordResetToken } from "@/app/lib/tokens";
import { sendPasswordResetEmail, sendInvoiceEmail } from "@/app/lib/mail";
import { Invoice, invoices_lines, Customer, Empresas, ArticulosTableType, User } from "@/app/lib/definitions";
import { fetchInvoiceById, fetchinvoices_lines, fetchCustomersById, fetchEmpresaById } from "@/app/lib/data";
import { requireEmpresaId } from "./data";
import { generateInvoiceHash } from "./utils";
import bcrypt from 'bcryptjs';

const ResetSchema = z.object({
  email: z.string().email({
    message: "Email inválido",
  }),
});

const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "La contraseña debe tener al menos 6 caracteres",
  }),
});

export async function resetPassword(prevState: any, formData: FormData, token: string | null) {
  if (!token) {
    return "Token no encontrado.";
  }

  const validatedFields = NewPasswordSchema.safeParse({
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return "Contraseña inválida. Mínimo 6 caracteres.";
  }

  const { password } = validatedFields.data;

  try {
    const existingToken = await getPasswordResetTokenByToken(token);

    if (!existingToken) {
      return "Token inválido o expirado.";
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
      return "El token ha expirado. Por favor, solicita uno nuevo.";
    }

    const user = await sql`SELECT * FROM users WHERE email = ${existingToken.email}`;

    if (user.rows.length === 0) {
      return "El usuario ya no existe.";
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Actualizar contraseña
    await sql`
      UPDATE users 
      SET password = ${hashedPassword}
      WHERE email = ${existingToken.email}
    `;

    // Eliminar el token usado
    await deletePasswordResetToken(existingToken.id);

    return undefined; // Éxito
  } catch (error) {
    console.error("Error en resetPassword:", error);
    return "Error al cambiar la contraseña. Inténtalo de nuevo.";
  }
}

export async function sendInvoiceEmailAction(
  invoice: Invoice,
  lines: invoices_lines[],
  customer: Customer,
  empresa: Empresas
) {
  try {
    const result = await sendInvoiceEmail(invoice, lines, customer, empresa);
    if (result.success) {
      return { success: true, message: "Factura enviada correctamente" };
    } else {
      return { success: false, message: "Error al enviar la factura" };
    }
  } catch (error) {
    console.error("Error en sendInvoiceEmailAction:", error);
    return { success: false, message: "Error inesperado al enviar la factura" };
  }
}

export async function sendInvoiceEmailByIdAction(invoiceId: string) {
  try {
    const invoice = await fetchInvoiceById(invoiceId);
    if (!invoice) return { success: false, message: "Factura no encontrada" };

    const [lines, customer] = await Promise.all([
      fetchinvoices_lines(invoiceId),
      fetchCustomersById(invoice.customer_id),
    ]);

    const empresa = await fetchEmpresaById(invoice.id_empresa.toString());

    if (!customer || !empresa) {
        return { success: false, message: "Datos de cliente o empresa incompletos" };
    }

    const result = await sendInvoiceEmail(invoice, lines, customer, empresa);
    return result.success 
      ? { success: true, message: "Factura enviada correctamente" }
      : { success: false, message: "Error al enviar la factura" };

  } catch (error) {
    console.error("Error en sendInvoiceEmailByIdAction:", error);
    return { success: false, message: "Error al procesar el envío" };
  }
}

export async function requestPasswordReset(prevState: any, formData: FormData) {
  const validatedFields = ResetSchema.safeParse({
    email: formData.get("email"),
  });

  if (!validatedFields.success) {
    return "Email inválido. Por favor, revisa el formato.";
  }

  const { email } = validatedFields.data;

  try {
    // Verificar si el usuario existe
    const user = await sql`SELECT * FROM users WHERE email = ${email}`;
    
    if (user.rows.length === 0) {
      // Por seguridad, no decimos si el email existe o no
      return "Este correo electrónico no está registrado en el sistema."; 
    }

    const userData = user.rows[0];
    
    // Generar Token
    const token = await generatePasswordResetToken(email);
    if (!token) {
      return "Error al generar el token. Inténtalo de nuevo.";
    }

    // Enviar Email
    await sendPasswordResetEmail(userData.email, token, userData.name);

    return undefined; // Éxito
  } catch (error) {
    console.error("Error en requestPasswordReset:", error);
    return "Algo salió mal. Inténtalo de nuevo más tarde.";
  }
}




// Define el esquema para FormSchema de facturas
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: "Por favor selecciona un cliente.",
  }),
  base_imponible: z.coerce
    .number()
    .gt(0, { message: "Por favor introduce un importe mayor a $0." }),

  status: z.enum(["Pendiente", "Pagada"], {
    invalid_type_error: "Por favor selecciona un estado de factura.",
  }),
  tipo: z.enum(["Pedido", "Factura"], {
    invalid_type_error: "Por favor selecciona un tipo de documento.",
  }),
  fecha: z.string().min(1, { message: "Por favor selecciona una fecha para la factura." }),
  lines: z.string().optional(),
  invoice_serie: z.string().min(1, { message: "La serie es obligatoria." }).optional(),
});

const CreateInvoice = FormSchema.omit({ id: true });
const UpdateInvoice = FormSchema.omit({ id: true }).extend({
  // Conviertimos el valor de invoiceNumber a número con el z.coerce
  invoiceNumber: z.coerce.number({ 
    invalid_type_error: "El número de factura debe ser un número.",
  }).min(1, { message: "El número de factura es obligatorio." }),
});

// Función auxiliar para calcular el Recargo de Equivalencia (RE) según el IVA (Estándares España)
function getReRate(iva: number, hasRe: boolean): number {
  if (!hasRe) return 0;
  if (iva === 21) return 5.2;
  if (iva === 10) return 1.4;
  if (iva === 5 || iva === 4) return 0.5;
  return 0;
}

// Esquema para Clientes y validacion de campos zod
const CustomerSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: "El nombre es obligatorio." }),
  email: z.string().email({ message: "Introduce un email válido." }),
  image_url: z.string().optional(),
  direccion: z.string().min(1, { message: "La dirección es obligatoria." }),
  c_postal: z.string().min(1, { message: "El código postal es obligatorio." }),
  poblacion: z.string().min(1, { message: "La población es obligatoria." }),
  provincia: z.string().min(1, { message: "La provincia es obligatoria." }),
  telefono: z.string().optional(),
  cif: z.string().refine((value) => validateDocument(value), { // refine es una funcion que valida el campo de zod
    message: "El formato del NIF/CIF no es válido.",
  }),
  pais: z.string().min(1, { message: "El país es obligatorio." }),
  id_empresa: z.number().optional(),
  tiene_iva: z.boolean().default(true),
  tiene_re: z.boolean().default(false),
});

const CreateCustomer = CustomerSchema.omit({ id: true });
//const UpdateCustomer = CustomerSchema.omit({ id: true });


export type State = { 
  errors?: {
    customerId?: string[];
    base_imponible?: string[];
    status?: string[];
    tipo?: string[];
    lines?: string[];
    name?: string[];
    email?: string[];
    direccion?: string[];
    c_postal?: string[];
    poblacion?: string[];
    provincia?: string[];
    id_empresa?: string[];
    fecha?: string[];
    invoiceNumber?: string[];
    invoice_serie?: string[];
  };
  message: string;
  success?: boolean;
  values?: {
    customerId?: string;
    invoice_serie?: string;
    status?: string;
    tipo?: string;
    fecha?: string;
    base_imponible?: string;
    invoiceNumber?: string;
    lines?: string;
  };
};

export async function createInvoice(prevState: State, formData: FormData): Promise<State> {
  // Valida los campos del formulario. usando zod
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get("customerId"),
    base_imponible: formData.get("base_imponible"),
    status: formData.get("status"),
    tipo: formData.get("tipo"),
    lines: formData.get("lines"),
    fecha: formData.get("fecha"),
    invoice_serie: formData.get("invoice_serie"),
  });

  // Si falla la validación del formulario, devuelve los errores.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Por favor, corrige los errores del formulario.",
      values: {
        customerId: formData.get("customerId") as string,
        invoice_serie: formData.get("invoice_serie") as string,
        status: formData.get("status") as string,
        tipo: formData.get("tipo") as string,
        fecha: formData.get("fecha") as string,
        base_imponible: formData.get("base_imponible") as string,
        lines: formData.get("lines") as string,
      }
    };
  }

  // Prepara los datos para la inserción en la base de datos
  const { customerId, base_imponible, status, tipo, lines, fecha, invoice_serie } = validatedFields.data;
  const idEmpresa = await requireEmpresaId();

  const [customerResult, empresaResult] = await Promise.all([
    sql`SELECT tiene_iva, tiene_re, cif FROM customers WHERE id = ${customerId} AND id_empresa = ${idEmpresa}`,
    sql`SELECT cif FROM empresas WHERE id = ${idEmpresa}`,
  ]);

  const customer = customerResult.rows[0];
  const empresa = empresaResult.rows[0];

  // Obtener el siguiente número de factura (filtrando por tipo) y el hash anterior para Verifactu
  const [nextNumberResult, lastHashResult] = await Promise.all([
    sql`
      SELECT COALESCE(MAX(invoice_number), 0) + 1 as next_number 
      FROM invoices 
      WHERE id_empresa = ${idEmpresa} 
      AND date_part('year', date) = date_part('year', ${fecha}::date)
      AND tipo = ${tipo}
    `,
    tipo === 'Factura' ? sql`
      SELECT hash FROM invoices 
      WHERE id_empresa = ${idEmpresa} 
      AND tipo = 'Factura' AND hash IS NOT NULL AND hash != ''
      ORDER BY date DESC, invoice_number DESC, id DESC 
      LIMIT 1
    ` : Promise.resolve({ rows: [] })
  ]);

  const invoice_number = nextNumberResult.rows[0].next_number;
  const prev_hash = lastHashResult.rows[0]?.hash || '';
  
  const base_imponibleInCents = Math.round(base_imponible * 100); // BI total
  let tax_ivaInCents = 0;
  let tax_rec_equivalenciaInCents = 0;

  const parsedLines = lines ? JSON.parse(lines) : [];

  if (customer.tiene_iva) {
    parsedLines.forEach((line: any) => {
      const lineBaseInCents = Math.round((Number(line.cantidad) * Number(line.precio)) * 100);
      const lineIvaRate = Number(line.iva) || 21;
      
      tax_ivaInCents += Math.round(lineBaseInCents * (lineIvaRate / 100));

      if (line.re) {
        const reRate = getReRate(lineIvaRate, !!customer.tiene_re);
        tax_rec_equivalenciaInCents += Math.round(lineBaseInCents * (reRate / 100));
      }
    });
  }

  const totalInCents = base_imponibleInCents + tax_ivaInCents + tax_rec_equivalenciaInCents;

  // Cálculo de la huella digital (Verifactu) solo si es Factura
  let hash = '';
  if (tipo === 'Factura') {
    const hashData = `${empresa.cif || ''}|${invoice_serie ? invoice_serie + '-' : ''}${invoice_number}|${fecha}|${totalInCents}|${prev_hash}`;
    hash = generateInvoiceHash(hashData);
  }

  try {
    const result = await sql`
      INSERT INTO invoices (
        customer_id, 
        base_imponible, 
        status, 
        tipo,
        date, 
        id_empresa, 
        total_iva, 
        total_recargo, 
        total_factura, 
        invoice_number,
        invoice_serie,
        cif,
        hash,
        prev_hash
      )
      VALUES (
        ${customerId}, 
        ${base_imponibleInCents}, 
        ${status}, 
        ${tipo},
        ${fecha}, 
        ${idEmpresa}, 
        ${tax_ivaInCents}, 
        ${tax_rec_equivalenciaInCents}, 
        ${totalInCents}, 
        ${invoice_number},
        ${invoice_serie},
        ${customer.cif},
        ${hash || null},
        ${prev_hash || null}
      )
      RETURNING id, invoice_number;
    `;
    
    const invoiceId = result.rows[0].id;  // Obtiene el ID de la factura recién insertada
    //const invoiceNumber = result.rows[0].invoice_number;  // Obtiene el número de la factura recién insertada

    // Insertar las líneas de la factura si existen
    if (lines) {
      const parsedLines = JSON.parse(lines);
      for (const line of parsedLines) {
        await sql`
          INSERT INTO invoices_lines (id_invoice, linea, descripcion, observaciones, cantidad, precio, total, id_articulo, id_empresa, iva, re)
          VALUES (
            ${invoiceId}, 
            ${line.linea}, 
            ${line.descripcion}, 
            ${line.observaciones}, 
            ${Math.round(line.cantidad * 100)}, 
            ${Math.round(line.precio * 100)}, 
            ${Math.round(line.total * 100)}, 
            ${line.id_articulo}, 
            ${idEmpresa}, 
            ${line.iva || 21}, 
            ${line.re || 0}
          )
        `;
      }
    }
  } catch (error) {
    console.error("Error al crear la factura:", error);
    return {
      message: "Database Error: Failed to Crear Factura.",
    };
  }

  //Una vez actualizada la base de datos, /dashboard/invoices se volverá a validar la ruta y se obtendrán
  // datos nuevos del servidor.
  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData,
): Promise<State> {
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get("customerId"),
    base_imponible: formData.get("base_imponible"),
    status: formData.get("status"),
    tipo: formData.get("tipo"),
    lines: formData.get("lines"),
    fecha: formData.get("fecha"),
    invoiceNumber: formData.get("invoiceNumber"),
    invoice_serie: formData.get("invoice_serie"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Faltan campos por rellenar. No se ha podido actualizar la factura.",
      values: {
        customerId: formData.get("customerId") as string,
        invoice_serie: formData.get("invoice_serie") as string,
        status: formData.get("status") as string,
        tipo: formData.get("tipo") as string,
        fecha: formData.get("fecha") as string,
        base_imponible: formData.get("base_imponible") as string,
        invoiceNumber: formData.get("invoiceNumber") as string,
        lines: formData.get("lines") as string,
      }
    };
  }

  const { customerId, base_imponible, status, tipo, lines, fecha, invoiceNumber, invoice_serie } = validatedFields.data;
  const idEmpresa = await requireEmpresaId();

  // Obtener datos del cliente para calcular impuestos
  const [customerResult] = await Promise.all([
    sql`SELECT tiene_iva, tiene_re, cif FROM customers WHERE id = ${customerId} AND id_empresa = ${idEmpresa}`,
  ]);

  const customer = customerResult.rows[0];
  const base_imponibleInCents = Math.round(base_imponible * 100); // BI
  let tax_ivaInCents = 0;
  let tax_rec_equivalenciaInCents = 0;

  const parsedLines = lines ? JSON.parse(lines) : [];

  if (customer.tiene_iva) {
    parsedLines.forEach((line: any) => {
      const lineBaseInCents = Math.round((Number(line.cantidad) * Number(line.precio)) * 100);
      const lineIvaRate = Number(line.iva) || 21;
      
      tax_ivaInCents += Math.round(lineBaseInCents * (lineIvaRate / 100));

      if (line.re) {
        const reRate = getReRate(lineIvaRate, !!customer.tiene_re);
        tax_rec_equivalenciaInCents += Math.round(lineBaseInCents * (reRate / 100));
      }
    });
  }

  const totalInCents = base_imponibleInCents + tax_ivaInCents + tax_rec_equivalenciaInCents;

  try {
    // Obtener estado actual de la factura en BD
    const currentInvoiceResult = await sql`SELECT tipo, hash, bloqueada FROM invoices WHERE id = ${id} AND id_empresa = ${idEmpresa}`;
    const currentInvoice = currentInvoiceResult.rows[0];
    
    if (currentInvoice.bloqueada) {
      return { message: "Esta factura está bloqueada y no puede ser modificada." };
    }

    const currentTipo = currentInvoice.tipo;
    const isLocking = formData.get("action") === "lock";
    let bloqueada = false;
    
    let finalInvoiceNumber = invoiceNumber;
    let finalHash = currentInvoice.hash || null;
    let finalPrevHash = null;

    // Si se bloquea y es Factura, generamos el hash (y número si venía de Pedido)
    if (isLocking && tipo === 'Factura') {
      bloqueada = true;
      if (currentTipo === 'Pedido' || !currentInvoice.hash) {
        const [nextNumberResult, lastHashResult, empresaResult] = await Promise.all([
        sql`SELECT COALESCE(MAX(invoice_number), 0) + 1 as next_number FROM invoices WHERE id_empresa = ${idEmpresa} AND date_part('year', date) = date_part('year', ${fecha}::date) AND tipo = 'Factura'`,
        sql`SELECT hash FROM invoices WHERE id_empresa = ${idEmpresa} AND tipo = 'Factura' AND hash IS NOT NULL AND hash != '' ORDER BY date DESC, invoice_number DESC, id DESC LIMIT 1`,
        sql`SELECT cif FROM empresas WHERE id = ${idEmpresa}`
      ]);
      
      // Si era un Pedido, le asignamos el SIGUIENTE número correlativo de las facturas
      if (currentTipo === 'Pedido') {
        finalInvoiceNumber = nextNumberResult.rows[0].next_number;
      }
      
      finalPrevHash = lastHashResult.rows[0]?.hash || '';
      const empresa = empresaResult.rows[0];
      const hashData = `${empresa.cif || ''}|${invoice_serie ? invoice_serie + '-' : ''}${finalInvoiceNumber}|${fecha}|${totalInCents}|${finalPrevHash}`;
      finalHash = generateInvoiceHash(hashData);
      }
    }

    await sql`
        UPDATE invoices
        SET customer_id = ${customerId}, 
            base_imponible = ${base_imponibleInCents}, 
            status = ${status}, 
            tipo = ${tipo},
            date = ${fecha}, 
            total_iva = ${tax_ivaInCents}, 
            total_recargo = ${tax_rec_equivalenciaInCents}, 
            total_factura = ${totalInCents},
            invoice_number = ${finalInvoiceNumber},
            invoice_serie = ${invoice_serie},
            cif = ${customer.cif},
            hash = COALESCE(${finalHash}, hash),
            prev_hash = COALESCE(${finalPrevHash}, prev_hash),
            bloqueada = ${bloqueada}
        WHERE id = ${id} AND id_empresa = ${idEmpresa}
      `;

    // Actualizar líneas: borrar las viejas e insertar las nuevas
    await sql`DELETE FROM invoices_lines WHERE id_invoice = ${id} AND id_empresa = ${idEmpresa}`;

    if (lines) {
      const parsedLines = JSON.parse(lines);
      for (const line of parsedLines) {
        await sql`
          INSERT INTO invoices_lines (id_invoice, linea, descripcion, observaciones, cantidad, precio, total, id_articulo, id_empresa, iva, re)
          VALUES (
            ${id}, 
            ${line.linea}, 
            ${line.descripcion}, 
            ${line.observaciones}, 
            ${Math.round(line.cantidad * 100)}, 
            ${Math.round(line.precio * 100)}, 
            ${Math.round(line.total * 100)}, 
            ${line.id_articulo}, 
            ${idEmpresa}, 
            ${line.iva || 21}, 
            ${line.re || 0}
          )
        `;
      }
    }
  } catch (error) {
    console.error("Error al actualizar la factura:", error);
    return { message: "Error en la base de datos: No se ha podido actualizar la factura." };
  }
  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

export async function deleteInvoice(id: string, formData?: FormData) {
  const idEmpresa = await requireEmpresaId();
  try {
    const currentInvoiceResult = await sql`SELECT bloqueada FROM invoices WHERE id = ${id} AND id_empresa = ${idEmpresa}`;
    if (currentInvoiceResult.rows.length > 0 && currentInvoiceResult.rows[0].bloqueada) {
      return { message: "No se puede eliminar una factura que está bloqueada/confirmada." };
    }

    // Primero borramos las líneas asociadas para evitar el error de clave foránea
    await sql`DELETE FROM invoices_lines WHERE id_invoice = ${id} and id_empresa = ${idEmpresa}`;
    // Ahora podemos borrar la factura
    await sql`DELETE FROM invoices WHERE id = ${id} and id_empresa = ${idEmpresa}`;
    
    revalidatePath("/dashboard/invoices");
    return { message: "Factura eliminada correctamente." };
  } catch (error) {
    console.error("Error al eliminar la factura:", error);
    return { message: "Error al borrar la factura y sus líneas." };
  }
}

// Función para crear un cliente
export async function createCustomer(data: Omit<Customer, "id">): Promise<State> {
  // Validar campos con Zod
  const validatedFields = CreateCustomer.safeParse(data);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Faltan campos obligatorios.",
    };
  }

  const {name, email, image_url, direccion, c_postal, poblacion, provincia, telefono, cif, pais, tiene_iva, tiene_re,} = validatedFields.data;
  
  const id_empresa = await requireEmpresaId();

  try {
    // Consulta SQL para insertar un nuevo cliente
    await sql`
      INSERT INTO customers (name, email, image_url, direccion,c_postal,poblacion,provincia,telefono,cif,pais, id_empresa, tiene_iva, tiene_re)
      VALUES (${name}, ${email}, ${image_url}, ${direccion},${c_postal},${poblacion},${provincia},${telefono},${cif},${pais}, ${id_empresa}, ${tiene_iva}, ${tiene_re})
    `;

    // Devolver el cliente creado
    return {
      success: true,
      message: "Cliente creado correctamente.",
    };
  } catch (error) {
    console.error("Database Error:", error);
    return {
      success: false,
      message: "Error de base de datos: No se pudo crear el cliente.",
    };
  }
}

// Función para actualizar un cliente
export async function updateCustomer(id: string, data: Omit<Customer, "id">) {
  const {name, email, image_url, direccion, c_postal, poblacion, provincia, telefono, cif, pais, tiene_iva, tiene_re,} = data;
  const idEmpresa = await requireEmpresaId();
  try {
    // Consulta SQL para actualizar un cliente
    await sql`
      UPDATE customers
      SET name = ${name}, email = ${email}, image_url = ${image_url}, direccion = ${direccion}, c_postal = ${c_postal}, poblacion = ${poblacion}, provincia = ${provincia}, telefono = ${telefono}, cif = ${cif}, pais = ${pais}, tiene_iva = ${tiene_iva}, tiene_re = ${tiene_re}
      WHERE id = ${id} and id_empresa = ${idEmpresa}
    `;

    return {
      success: true,
      message: "Cliente actualizado correctamente.",
    };
  } catch (error) {
    console.error("Database Error:", error);
    return {
      success: false,
      message: "Error de base de datos: No se pudo actualizar el cliente.",
    };
  }
}

export async function deleteCustomers(id: string) {
  const idEmpresa = await requireEmpresaId();
  await sql`DELETE FROM customers WHERE id = ${id} and id_empresa = ${idEmpresa}`;
  revalidatePath("/dashboard/customers");
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Correo electronico o contraseña incorrectas.";
        default:
          return "Algo ha ido mal.";
      }
    }
    throw error;
  }
}

export async function deleteArticulo(id: string) {
  const idEmpresa = await requireEmpresaId();
  await sql`DELETE FROM articulos WHERE id = ${id} and id_empresa = ${idEmpresa}`;
  revalidatePath("/dashboard/articulos");
}

// Función para actualizar un articulo
export async function updateArticulo(
  id: string,
  data: Omit<ArticulosTableType, "id" | "id_empresa">,
) {
  const { codigo, descripcion, precio, iva, stock, imagen } = data;
  const idEmpresa = await requireEmpresaId();

  // Consulta SQL para actualizar un artículo
  const result = await sql`
    UPDATE articulos
    SET 
      codigo = ${codigo}, 
      descripcion = ${descripcion}, 
      precio = ${precio}, 
      iva = ${iva}, 
      stock = ${stock}, 
      imagen = ${JSON.stringify(imagen)}
    WHERE id = ${id} and id_empresa = ${idEmpresa}
    RETURNING id, codigo, descripcion, precio, iva, stock, imagen;
  `;

  // Devolver el artículo actualizado
  return result.rows[0];
}

// Función para crear un artículo
export async function createArticulo(
  data: Omit<ArticulosTableType, "id" | "id_empresa">,
) {
  const { codigo, descripcion, precio, iva, stock, imagen } = data;
  const idEmpresa = await requireEmpresaId();

  // Consulta SQL para insertar un nuevo artículo
  const result = await sql`
    INSERT INTO articulos (codigo, descripcion, precio, iva, stock, imagen, id_empresa)
    VALUES (${codigo}, ${descripcion}, ${precio}, ${iva}, ${stock}, ${JSON.stringify(
      imagen,
    )}, ${idEmpresa})
    RETURNING id, codigo, descripcion, precio, iva, stock, imagen;
  `;

  // Devolver el artículo creado
  return result.rows[0];
}

// Función para eliminar una imagen de un artículo
export async function deleteArticuloImage(articuloId: number, imageId: number) {
  try {
    const result = await sql`
UPDATE articulos
      SET imagen = (
        SELECT COALESCE(
          jsonb_agg(elem) - ${imageId}::int,
          '[]'::jsonb
        )
        FROM jsonb_array_elements(imagen) elem
      )
      WHERE id = ${articuloId}
    `;
    return result;
  } catch (error) {
    console.error("Error al eliminar la imagen del artículo:", error);
    return {
      success: false,
      error: "Error al eliminar la imagen del artículo",
    };
  }
}

export async function handleDeleteImage(articuloId: number, imageId: number) {
  try {
    await deleteArticuloImage(articuloId, imageId);
    revalidatePath("/dashboard/articulos");
    return { success: true };
  } catch (error) {
    console.error("Error al eliminar la imagen", error);
    return {
      success: false,
      error: "Error al eliminar la imagen",
    };
  }
}

export async function deleteUser(id: string) {
  await sql`DELETE FROM users WHERE id = ${id}`;
  revalidatePath("/dashboard/users");
}

// Función para actualizar un usuario
export async function updateUser(id: string, data: Omit<User, "id">) {
  const { name, email, password, type, token, css, image_url } = data;

  // Encriptar la contraseña si se proporciona una nueva
  if (password) {
    const saltRounds = 5; // nivel de seguridad de bcrypt mas alto es 10 mas lento pero mas seguro
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Consulta SQL para actualizar un usuario (excluyendo nombre y email que son inmutables)
    const result = await sql`
      UPDATE users
      SET password = ${hashedPassword}, type = ${type}, token = ${token}, css = ${css}, image_url = ${image_url}
      WHERE id = ${id}
      RETURNING id, name, email, password, type, token, css, image_url;
    `;
    return result.rows[0];
  } else {
    const result = await sql`
      UPDATE users
      SET type = ${type}, token = ${token}, css = ${css}, image_url = ${image_url}
      WHERE id = ${id}
      RETURNING id, name, email, password, type, token, css, image_url;
    `;
    
    // Devolver el usuario actualizado
    return result.rows[0];
  }
}

export async function createUser(data: Omit<User, "id">) {
  let { name, email, password, type, token, id_empresa, css, image_url } = data;

  if (!id_empresa) {
    id_empresa = await requireEmpresaId();
  }

  // Si no se proporciona un CSS, usamos el del usuario actual o el por defecto
  if (!css) {
    const session = await auth();
    css = (session?.user as any)?.css || '#1a1c1eff';
  }

  // Validar que la contraseña no esté vacía
  if (!password || password.trim() === "") {
    throw new Error("La contraseña es obligatoria.");
  }

  // Encriptar la contraseña
  const saltRounds = 5; // nivel de encriptacion (más alto = más seguro, pero más lento)
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const result = await sql`
    INSERT INTO users (name, email, password, type, token, id_empresa, css, image_url)
    VALUES (${name}, ${email}, ${hashedPassword}, ${type}, ${token}, ${id_empresa}, ${css}, ${image_url})
    RETURNING id, name, email, password, type, token, id_empresa, css, image_url;
  `;

  // Devolver el usuario creado
  return result.rows[0];
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}

export async function deleteEmpresa(id: string) {
  await sql`DELETE FROM empresas WHERE id = ${id}`;
  revalidatePath("/dashboard/empresas");
}

// Función para actualizar una empresa
export async function updateEmpresa(id: string, data: Omit<Empresas, "id">) {
  const { nombre, direccion, c_postal, poblacion, provincia, telefono, cif, email, logotipo, activa } = data;

  const result = await sql`
    UPDATE empresas
    SET nombre = ${nombre}, direccion = ${direccion}, c_postal = ${c_postal}, poblacion = ${poblacion}, provincia = ${provincia}, telefono = ${telefono}, cif = ${cif}, email = ${email}, logotipo = ${logotipo}, activa = ${activa}
    WHERE id = ${id}
    RETURNING id, nombre, logotipo;
  `;
  
  revalidatePath("/dashboard/empresas");
  return result.rows[0];
}

// cuando llamamos desde el cliente aún no conocemos el id de la empresa, por lo que el usuario inicial puede omitirlo.  La función helper se encargará de fusionarlo automáticamente después de crear la empresa.  Por eso `initialUser` puede omitir tanto `id` como `id_empresa`.

export async function createEmpresa(
  data: Omit<Empresas, "id">,
  initialUser?: Omit<User, "id" | "id_empresa">,
) {
  const {
    nombre,
    direccion,
    c_postal,
    poblacion,
    provincia,
    telefono,
    cif,
    email,
    logotipo,
    activa,
  } = data;

  // Insertar la empresa
  const result = await sql`
    INSERT INTO empresas (nombre, direccion, c_postal, poblacion, provincia, telefono, cif, email, logotipo, activa)
    VALUES (${nombre}, ${direccion}, ${c_postal}, ${poblacion}, ${provincia}, ${telefono}, ${cif}, ${email}, ${logotipo}, ${activa})
    RETURNING id, nombre, direccion, c_postal, poblacion, provincia, telefono, cif, email, logotipo, activa;
  `;
  // Crea la serie 001 por defecto
  const result2 = await sql`
    INSERT INTO series (id, name, id_empresa)
    VALUES ('001', 'Nacional', ${result.rows[0].id})
    RETURNING id, name, id_empresa;
  `;

  const empresa = result.rows[0];

  const serie = result2.rows[0];
  console.log(serie);

  // Si se ha pasado un usuario inicial, crearlo y asociarlo a la nueva empresa
  if (initialUser) {
    try {
      // we merge the newly-created empresa id here before delegating to
      // createUser, satisfying its expectation for `id_empresa`.
      await createUser({
        ...initialUser,
        id_empresa: empresa.id,
      });
    } catch (err) {
      // opcional: puedes manejar errores de usuario aquí o propagarlos
      console.error("Failed to create initial user for empresa", err);
    }
  }

  return empresa;
}

export async function updateUserCss(css: string) {
  const session = await auth();
  
  // Si no hay sesión (ej: el usuario está cerrando sesión), no lanzamos error, cerramos silenciosamente.
  if (!session?.user?.email) {
    return { success: false, message: "No active session" };
  }

  try {
    await sql`
      UPDATE users
      SET css = ${css} 
      WHERE email = ${session.user.email}
    `;
    return { success: true };
  } catch (error) {
    // Si la base de datos falla, aquí sí queremos que Sentry nos avise.
    console.error("Database Error: Failed to Update User CSS.", error);
    throw new Error(`Failed to update user CSS for ${session.user.email}`);
  }
}

export async function uploadImage(formData: FormData, fieldName: string = 'file') {
  const file = formData.get(fieldName) as File | null;
  if (!file || !file.name || file.name === "undefined") {
    return null;
  }

  try {
    // Sube la imagen a Vercel Blob usando put
    const blob = await put(file.name, file, { 
      access: 'public',
      // Esto hace que si subes archivos con el mismo nombre, les añade caracteres random al final para que no se sobreescriban
      addRandomSuffix: true 
    });

    console.log(`Imagen guardada correctamente en Vercel Blob: ${blob.url}`);

    // Devolvemos SOLAMENTE el nombre de guardado (pathname) para la BD
    return blob.pathname;
  } catch (error) {
    console.error("Error al guardar la imagen en Blob:", error);
    return null;
  }
}

export async function getArticulosForInvoice(query: string) {
  const { fetchFilteredArticulos } = await import("./data");
  return await fetchFilteredArticulos(query);
}

