import { Resend } from 'resend';
import { render } from '@react-email/render';
import ResetPasswordEmail from '@/app/ui/emails/ResetPasswordEmail';
import InvoiceEmail from '@/app/ui/emails/InvoiceEmail';
import { generateInvoicePDFBuffer } from '@/app/lib/invoice-pdf-server';
import { Invoice, invoices_lines, Customer, Empresas } from '@/app/lib/definitions';
import { formatCurrency } from './utils';

// Importante: No inicializar con process.env.RESEND_API_KEY directamente fuera de una función, 
// ya que esto rompe el build de Vercel si la clave no está disponible en tiempo de compilación.
const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder_for_build');


export const sendEmail = async (
  to: string, 
  subject: string, 
  html: string, 
  attachments?: { filename: string; content: Buffer }[]
) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Factura Facil Soporte <info@facturafacil.pro>',
      to,
      subject,
      html,
      attachments,
    });

    if (error) {
      console.error('Error detallado de Resend:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error inesperado al enviar el correo:', error);
    return { success: false, error };
  }
};

export const sendInvoiceEmail = async (
  invoice: Invoice,
  lines: invoices_lines[],
  customer: Customer,
  empresa: Empresas
) => {
  const invoiceNumber = `${new Date(invoice.date).getFullYear()}/${invoice.invoice_serie ? invoice.invoice_serie + '/' : ''}${invoice.invoice_number}`;
  
  // 1. Generar el PDF en el servidor como Buffer
  const pdfBuffer = await generateInvoicePDFBuffer(invoice, lines, customer, empresa);


  // 2. Renderizar el cuerpo del email
  const emailHtml = await render(InvoiceEmail({
    customerName: customer.name,
    invoiceNumber: invoiceNumber,
    totalAmount: formatCurrency(invoice.total_factura),
    companyName: empresa.nombre,
  }));

  // 3. Enviar el email con el adjunto
  return await sendEmail(
    customer.email,
    `Factura ${invoiceNumber} - ${empresa.nombre}`,
    emailHtml,
    [
      {
        filename: `Factura_${invoiceNumber.replace(/\//g, '-')}.pdf`,
        content: pdfBuffer,
      },
    ]
  );
};
export const sendPasswordResetEmail = async (email: string, token: string, name: string) => {
  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/new-password?token=${token}`;
  
  // Renderizamos el componente React a HTML
  const emailHtml = await render(ResetPasswordEmail({
    userFirstname: name,
    resetPasswordLink: resetLink,
  }));

  return await sendEmail(
    email,
    'Restablece tu contraseña - FacturaFacil',
    emailHtml
  );
};
