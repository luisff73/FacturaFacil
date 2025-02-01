"use server";

import { z } from "zod";
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { Customer, ArticulosTableType, User } from "@/app/lib/definitions";
import bcrypt from "bcrypt";

// Define el esquema para FormSchema
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: "Please select a customer.",
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: "Please enter an amount greater than $0." }),

  status: z.enum(["Pendiente", "Pagada", "Proforma"], {
    invalid_type_error: "Please select an invoice status.",
  }),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ date: true, id: true });
// const CreateCustomer = z.object({
//   name: z.string(),
//   email: z.string().email(),
//   image_url: z.string(),
//   direccion: z.string(),
//   c_postal: z.string(),
//   poblacion: z.string(),
//   provincia: z.string(),
//   telefono: z.string(),
//   cif: z.string(),
//   pais: z.string(),
// });

// const UpdateCustomer = CreateCustomer.omit({ image_url: true });

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

export async function createInvoice(prevState: State, formData: FormData) {
  // Log the formData values
  console.log("customerId:", formData.get("customerId"));
  console.log("amount:", formData.get("amount"));
  console.log("status:", formData.get("status"));
  console.log("FormData entries:", Array.from(formData.entries()));

  // Valida los campos del formulario. usando zod
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Invoice.",
    };
  }

  // Prepare data for insertion into the database
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = Math.round(amount * 100); //convierte el valor de amount a centavos
  const date = new Date().toISOString().split("T")[0]; //obtiene la fecha actual en formato aaa-mm-dd
  try {
    // Inserta una nueva factura en la base de datos.
    await sql`INSERT INTO invoices (customer_id, amount, status, date) VALUES (${customerId}, ${amountInCents}, ${status}, ${date})`;
  } catch (error) {
    console.error("Error al crear la factura:", error);
    throw new Error("No se pudo crear la factura");
  }

  //Una vez actualizada la base de datos, /dashboard/invoicesse volverá a validar la ruta y se obtendrán
  // datos nuevos del servidor.
  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData
) {
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Invoice.",
    };
  }

  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;

  try {
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
  } catch (error) {
    return { message: "Database Error: Failed to Update Invoice." + error };
  }

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

export async function deleteInvoice(id: string) {
  await sql`DELETE FROM invoices WHERE id = ${id}`;
  revalidatePath("/dashboard/invoices");
}

// Función para crear un cliente
export async function createCustomer(data: Omit<Customer, "id">) {
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
  } = data;

  // Consulta SQL para insertar un nuevo cliente
  const result = await sql`
    INSERT INTO customers (name, email, image_url, direccion,c_postal,poblacion,provincia,telefono,cif,pais)
    VALUES (${name}, ${email}, ${image_url}, ${direccion},${c_postal},${poblacion},${provincia},${telefono},${cif},${pais})
    RETURNING id, name, email, image_url ,direccion,c_postal,poblacion,provincia,telefono,cif,pais;
  `;

  // Devolver el cliente creado
  return result.rows[0];
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
  } = data;

  // Consulta SQL para actualizar un cliente
  const result = await sql`
    UPDATE customers
    SET name = ${name}, email = ${email}, image_url = ${image_url}, direccion = ${direccion}, c_postal = ${c_postal}, poblacion = ${poblacion}, provincia = ${provincia}, telefono = ${telefono}, cif = ${cif}, pais = ${pais}
    WHERE id = ${id}
    RETURNING id, name, email, image_url ,direccion,c_postal,poblacion,provincia,telefono,cif,pais;
  `;

  // Devolver el cliente actualizado
  return result.rows[0];
}

export async function deleteCustomers(id: string) {
  await sql`DELETE FROM customers WHERE id = ${id}`;
  revalidatePath("/dashboard/customers");
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
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
  data: Omit<ArticulosTableType, "id">
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
export async function createArticulo(data: Omit<ArticulosTableType, "id">) {
  const { codigo, descripcion, precio, iva, stock, imagen } = data;

  // Consulta SQL para insertar un nuevo artículo
  const result = await sql`
    INSERT INTO articulos (codigo, descripcion, precio, iva, stock, imagen)
    VALUES (${codigo}, ${descripcion}, ${precio}, ${iva}, ${stock}, ${JSON.stringify(
    imagen
  )})
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
  const { name, email, password, type, token } = data;

  // Encriptar la contraseña
  const saltRounds = 5; // nivel de encriptacion (más alto = más seguro, pero más lento)
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Consulta SQL para actualizar un artículo
  const result = await sql`
    UPDATE users
    SET 
      name = ${name}, 
      email = ${email}, 
      password = ${hashedPassword}, 
      type = ${type}, 
      token = ${token}   
    WHERE id = ${id}
    RETURNING id, name, email, password, type, token;
  `;

  // Devolver el artículo actualizado
  return result.rows[0];
}

export async function createUser(data: Omit<User, "id">) {
  const { name, email, password, type, token } = data;

  // Encriptar la contraseña
  const saltRounds = 5; // nivel de encriptacion (más alto = más seguro, pero más lento)
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Consulta SQL para insertar un nuevo usuario con la contraseña encriptada
  const result = await sql`
    INSERT INTO users (name, email, password, type, token)
    VALUES (${name}, ${email}, ${hashedPassword}, ${type}, ${token})
    RETURNING id, name, email, password, type, token;
  `;

  // Devolver el usuario creado
  return result.rows[0];
}
