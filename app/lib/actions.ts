'use server';

// Al agregar 'use server', se marcan todas las funciones exportadas dentro del archivo como Acciones de servidor. 
// Estas funciones de servidor se pueden importar y utilizar en los componentes de cliente y servidor.

import { z } from 'zod'; //importa zod para validar los datos que se envian en el formulario
import {sql} from '@vercel/postgres' //importa sql para hacer consultas a la base de datos

// Dado que estás actualizando los datos que se muestran en la ruta de facturas, deseas borrar este caché 
// y activar una nueva solicitud al servidor. Puedes hacerlo con la revalidatePathfunción de Next.js:
import { revalidatePath } from 'next/cache'; //importa revalidatePath para hacer una nueva consulta a la base de datos

import { redirect } from 'next/navigation'; //importa Redirect para redirigir a otra pagina

 
const FormSchema = z.object({ //crea un objeto con los campos que se van a validar antes de enviarlos al servidor
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(), //convierte el valor string a un numero
  status: z.enum(['pending', 'paid', 'proforma']),
  date: z.string(),
});
 
const CreateInvoice = FormSchema.omit({ id: true, date: true });

// La función createInvoice toma un FormData objeto y lo envía a un servidor para crear una nueva factura.
export async function createInvoice(formData: FormData) {
    const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
  const amountInCents = Math.round(amount * 100); //convierte el valor de amount a centavos
  const date = new Date().toISOString().split('T')[0]; //obtiene la fecha actual en formato aaa-mm-dd

  await sql`INSERT INTO invoices (customer_id, amount, status, date) VALUES (${customerId}, ${amountInCents}, ${status}, ${date})`;

  
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
