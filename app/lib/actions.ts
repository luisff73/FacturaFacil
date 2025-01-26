'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { Customer } from '@/app/lib/definitions';

// Define el esquema para FormSchema
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid', 'proforma'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ date: true, id: true });

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
  console.log('customerId:', formData.get('customerId'));
  console.log('amount:', formData.get('amount'));
  console.log('status:', formData.get('status'));
  console.log('FormData entries:', Array.from(formData.entries()));

  // Valida los campos del formulario. usando zod
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }

  // Prepare data for insertion into the database
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = Math.round(amount * 100); //convierte el valor de amount a centavos
  const date = new Date().toISOString().split('T')[0]; //obtiene la fecha actual en formato aaa-mm-dd
  try {
    // Inserta una nueva factura en la base de datos.
    await sql`INSERT INTO invoices (customer_id, amount, status, date) VALUES (${customerId}, ${amountInCents}, ${status}, ${date})`;
  } catch (error) {
    console.error('Error al crear la factura:', error);
    throw new Error('No se pudo crear la factura');
  }

  //Una vez actualizada la base de datos, /dashboard/invoicesse volverá a validar la ruta y se obtendrán 
  // datos nuevos del servidor.
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData,
) {
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.',
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
    return { message: 'Database Error: Failed to Update Invoice.' };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  await sql`DELETE FROM invoices WHERE id = ${id}`;
  revalidatePath('/dashboard/invoices');
}

// Función para crear un cliente
export async function createCustomer(data: Omit<Customer, 'id'>) {
  const { name, email, image_url } = data;

  // Consulta SQL para insertar un nuevo cliente
  const result = await sql`
    INSERT INTO customers (name, email, image_url)
    VALUES (${name}, ${email}, ${image_url})
    RETURNING id, name, email, image_url;
  `;

  // Devolver el cliente creado
  return result.rows[0];
}

export async function deleteCustomers(id: string) {
  await sql`DELETE FROM customers WHERE id = ${id}`;
  revalidatePath('/dashboard/customers');
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}
