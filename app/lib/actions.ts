'use server';

// Al agregar 'use server', se marcan todas las funciones exportadas dentro del archivo como Acciones de servidor. 
// Estas funciones de servidor se pueden importar y utilizar en los componentes de cliente y servidor.

import { z } from 'zod'; //importa zod para validar los datos que se envian en el formulario
import {sql} from '@vercel/postgres' //importa sql para hacer consultas a la base de datos

// Dado que estás actualizando los datos que se muestran en la ruta de facturas, deseas borrar este caché 
// y activar una nueva solicitud al servidor. Puedes hacerlo con la revalidatePathfunción de Next.js:
import { revalidatePath } from 'next/cache'; //importa revalidatePath para hacer una nueva consulta a la base de datos

import { redirect } from 'next/navigation'; //importa Redirect para redirigir a otra pagina

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';


 // Define the schema for FormSchema
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid', 'proforma' ], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
});
 
const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
 
  const amountInCents = Math.round(amount * 100);
 
  try {
    await sql`
        UPDATE invoices
        SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
        WHERE id = ${id}
      `;
  } catch {
    return { message: 'Database Error: Failed to Update Invoice.' };
  }
 
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}


// La función createInvoice toma un FormData objeto y lo envía a un servidor para crear una nueva factura.
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

  if (!validatedFields.success) {
    console.log('Validation errors:', validatedFields.error.flatten().fieldErrors);
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
} catch  {
  console.error('Error al crear la factura:', Error);
  throw new Error('No se pudo crear la factura');
}
  
  //Una vez actualizada la base de datos, /dashboard/invoicesse volverá a validar la ruta y se obtendrán 
  // datos nuevos del servidor.
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
  

 // esto seria una alternativa si hubesen muchos campos en el formulario
 const rawFormData = Object.fromEntries(formData.entries())

  // Test it out:
  console.log('Este es el valor de FormData ' + JSON.stringify(rawFormData));
  //console.log(typeof FormData.amount);  //esto es para ver el tipo de dato que se esta enviando ojo que es un string

}

export async function deleteInvoice(id: string) {
  
  try{
  await sql`DELETE FROM invoices WHERE id = ${id}`;
  revalidatePath('/dashboard/invoices');;
  }catch  {
    console.error('Error al eliminar la factura:', Error);
    throw new Error('No se pudo eliminar la factura');
  }
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
