"use server";

import { z } from "zod";
import { put } from "@vercel/blob";
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { signIn, auth, signOut } from "@/auth";
import { AuthError } from "next-auth";
import {
  Customer,
  ArticulosTableType,
  User,
  Empresas,
} from "@/app/lib/definitions";
import { requireEmpresaId } from "./data";
import bcrypt from "bcrypt";

// Define el esquema para FormSchema
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: "Por favor selecciona un cliente.",
  }),
  base_imponible: z.coerce
    .number()
    .gt(0, { message: "Por favor introduce un importe mayor a $0." }),

  status: z.enum(["Pendiente", "Pagada", "Proforma"], {
    invalid_type_error: "Por favor selecciona un estado de factura.",
  }),
  date: z.string(),
  lines: z.string().optional(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ date: true, id: true });

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
  cif: z.string().regex(/^[ABCDEFGHJNPQRSUVW]\d{7}[0-9A-J]$/i, {
    message: "El formato del CIF no es válido (ej: A1234567B).",
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
    lines?: string[];
    name?: string[];
    email?: string[];
    direccion?: string[];
    c_postal?: string[];
    poblacion?: string[];
    provincia?: string[];
    id_empresa?: string[];
  };
  message: string;
  success?: boolean;
};

export async function createInvoice(prevState: State, formData: FormData): Promise<State> {


  // Valida los campos del formulario. usando zod
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get("customerId"),
    base_imponible: formData.get("base_imponible"),
    status: formData.get("status"),
    lines: formData.get("lines"),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Crear Factura.",
    };
  }

  // Prepare data for insertion into the database
  const { customerId, base_imponible, status, lines } = validatedFields.data;
  const idEmpresa = await requireEmpresaId();

  // Obtener datos del cliente y de la empresa para calcular impuestos
  const [customerResult, empresaResult] = await Promise.all([
    sql`SELECT tiene_iva, tiene_re FROM customers WHERE id = ${customerId} AND id_empresa = ${idEmpresa}`,
    sql`SELECT iva FROM empresas WHERE id = ${idEmpresa}`,
  ]);

  const customer = customerResult.rows[0];
  const ivaEmpresa = Number(empresaResult.rows[0].iva) || 21;
  const reRate = ivaEmpresa === 21 ? 5.2 : (ivaEmpresa === 10 ? 1.4 : 0.5);

  const base_imponibleInCents = Math.round(base_imponible * 100); // BI
  let tax_ivaInCents = 0;
  let tax_rec_equivalenciaInCents = 0;

  if (customer.tiene_iva) {
    tax_ivaInCents = Math.round(base_imponibleInCents * (ivaEmpresa / 100));
    if (customer.tiene_re) {
      tax_rec_equivalenciaInCents = Math.round(base_imponibleInCents * (reRate / 100));
    }
  }

  const totalInCents = base_imponibleInCents + tax_ivaInCents + tax_rec_equivalenciaInCents;

  try {
    const result = await sql`
      INSERT INTO invoices (customer_id, base_imponible, status, date, id_empresa, total_iva, total_recargo, total_factura)
      VALUES (${customerId}, ${base_imponibleInCents}, ${status}, CURRENT_DATE, ${idEmpresa}, ${tax_ivaInCents}, ${tax_rec_equivalenciaInCents}, ${totalInCents})
      RETURNING id
    `;
    
    const invoiceId = result.rows[0].id;

    // Insertar las líneas de la factura si existen
    if (lines) {
      const parsedLines = JSON.parse(lines);
      for (const line of parsedLines) {
        await sql`
          INSERT INTO invoices_lines (id_invoice, linea, descripcion, observaciones, cantidad, precio, total, id_articulo, id_empresa)
          VALUES (${invoiceId}, ${line.linea}, ${line.descripcion}, ${line.observaciones}, ${line.cantidad}, ${line.precio}, ${line.total}, ${line.id_articulo}, ${idEmpresa})
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
    lines: formData.get("lines"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Faltan campos por rellenar. No se ha podido actualizar la factura.",
    };
  }

  const { customerId, base_imponible, status, lines } = validatedFields.data;
  const idEmpresa = await requireEmpresaId();

  // Obtener datos del cliente y de la empresa para calcular impuestos
  const [customerResult, empresaResult] = await Promise.all([
    sql`SELECT tiene_iva, tiene_re FROM customers WHERE id = ${customerId} AND id_empresa = ${idEmpresa}`,
    sql`SELECT iva FROM empresas WHERE id = ${idEmpresa}`,
  ]);

  const customer = customerResult.rows[0];
  const ivaEmpresa = Number(empresaResult.rows[0].iva) || 21;
  const reRate = ivaEmpresa === 21 ? 5.2 : (ivaEmpresa === 10 ? 1.4 : 0.5);

  const base_imponibleInCents = Math.round(base_imponible * 100); // BI
  let tax_ivaInCents = 0;
  let tax_rec_equivalenciaInCents = 0;

  if (customer.tiene_iva) {
    tax_ivaInCents = Math.round(base_imponibleInCents * (ivaEmpresa / 100));
    if (customer.tiene_re) {
      tax_rec_equivalenciaInCents = Math.round(base_imponibleInCents * (reRate / 100));
    }
  }

  const totalInCents = base_imponibleInCents + tax_ivaInCents + tax_rec_equivalenciaInCents;

  try {
    await sql`
        UPDATE invoices
        SET customer_id = ${customerId}, base_imponible = ${base_imponibleInCents}, status = ${status}, total_iva = ${tax_ivaInCents}, total_recargo = ${tax_rec_equivalenciaInCents}, total_factura = ${totalInCents}
        WHERE id = ${id} AND id_empresa = ${idEmpresa}
      `;

    // Actualizar líneas: borrar las viejas e insertar las nuevas (estrategia simple)
    await sql`DELETE FROM invoices_lines WHERE id_invoice = ${id} AND id_empresa = ${idEmpresa}`;

    if (lines) {
      const parsedLines = JSON.parse(lines);
      for (const line of parsedLines) {
        await sql`
          INSERT INTO invoices_lines (id_invoice, linea, descripcion, observaciones, cantidad, precio, total, id_articulo, id_empresa)
          VALUES (${id}, ${line.linea}, ${line.descripcion}, ${line.observaciones}, ${line.cantidad}, ${line.precio}, ${line.total}, ${line.id_articulo}, ${idEmpresa})
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

export async function deleteInvoice(id: string) {
  await sql`DELETE FROM invoices WHERE id = ${id}`;
  revalidatePath("/dashboard/invoices");
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

  const {
    name,
    email,
    image_url,
    direccion,
    c_postal,
    poblacion,
    provincia,
    telefono,
    cif,
    pais,
    tiene_iva,
    tiene_re,
  } = validatedFields.data;
  
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
  const {
    name,
    email,
    image_url,
    direccion,
    c_postal,
    poblacion,
    provincia,
    telefono,
    cif,
    pais,
    tiene_iva,
    tiene_re,
  } = data;
  try {
    // Consulta SQL para actualizar un cliente
    await sql`
      UPDATE customers
      SET name = ${name}, email = ${email}, image_url = ${image_url}, direccion = ${direccion}, c_postal = ${c_postal}, poblacion = ${poblacion}, provincia = ${provincia}, telefono = ${telefono}, cif = ${cif}, pais = ${pais}, tiene_iva = ${tiene_iva}, tiene_re = ${tiene_re}
      WHERE id = ${id}
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
  await sql`DELETE FROM customers WHERE id = ${id}`;
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
          return "Invalid credentials.";
        default:
          return "Algo ha ido mal.";
      }
    }
    throw error;
  }
}

export async function deleteArticulo(id: string) {
  await sql`DELETE FROM articulos WHERE id = ${id}`;
  revalidatePath("/dashboard/articulos");
}

// Función para actualizar un articulo
export async function updateArticulo(
  id: string,
  data: Omit<ArticulosTableType, "id" | "id_empresa">,
) {
  const { codigo, descripcion, precio, iva, stock, imagen } = data;

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
    WHERE id = ${id}
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

  // Encriptar la contraseña
  const saltRounds = 5; // nivel de encriptacion (más alto = más seguro, pero más lento)
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Consulta SQL para actualizar un USUARIO
  const result = await sql`
    UPDATE users
    SET 
      name = ${name}, 
      email = ${email}, 
      password = ${hashedPassword}, 
      type = ${type}, 
      token = ${token},
      css = ${css},
      image_url = ${image_url}
    WHERE id = ${id}
    RETURNING id, name, email, password, type, token, css, image_url;
  `;

  // Devolver el usuario actualizado
  return result.rows[0];
}

export async function createUser(data: Omit<User, "id">) {
  let { name, email, password, type, token, id_empresa, css, image_url } = data;

  if (!id_empresa) {
    id_empresa = await requireEmpresaId();
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
  const {
    nombre,
    direccion,
    c_postal,
    poblacion,
    provincia,
    telefono,
    cif,
    email,
    iva,
    activa,
    password,
  } = data;

  // Encriptar la contraseña
  const saltRounds = 5; // nivel de encriptacion (más alto = más seguro, pero más lento)
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Consulta SQL para actualizar una empresa
  const result = await sql`
    UPDATE empresas
    SET 
      nombre = ${nombre}, 
      direccion = ${direccion}, 
      c_postal = ${c_postal}, 
      poblacion = ${poblacion}, 
      provincia = ${provincia}, 
      telefono = ${telefono}, 
      cif = ${cif},
      email = ${email},
      iva = ${iva},
      activa = ${activa},
      password = ${hashedPassword}
    WHERE id = ${id}
    RETURNING id, nombre, direccion, c_postal, poblacion, provincia, telefono, cif, email, iva, password;
  `;

  // Devolver la empresa actualizada
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
    iva,
    password,
    activa,
  } = data;

  // Encriptar la contraseña de la empresa
  const saltRounds = 5;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Insertar la empresa
  const result = await sql`
    INSERT INTO empresas (nombre, direccion, c_postal, poblacion, provincia, telefono, cif, email, iva, password, activa)
    VALUES (${nombre}, ${direccion}, ${c_postal}, ${poblacion}, ${provincia}, ${telefono}, ${cif}, ${email}, ${iva}, ${hashedPassword}, ${activa})
    RETURNING id, nombre, direccion, c_postal, poblacion, provincia, telefono, cif, email, iva, password;
  `;

  const empresa = result.rows[0];

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
  if (!session?.user?.email) {
    throw new Error("No session found");
  }

  try {
    await sql`
      UPDATE users
      SET css = ${css}
      WHERE email = ${session.user.email}
    `;
  } catch (error) {
    console.error("Database Error: Failed to Update User CSS.", error);
    throw new Error("Failed to update user CSS.");
  }
}

export async function uploadImage(formData: FormData) {
  const file = formData.get('file') as File | null;
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

