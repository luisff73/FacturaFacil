import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Hr,
} from '@react-email/components';

interface InvoiceEmailProps {
  customerName: string;
  invoiceNumber: string;
  totalAmount: string;
  companyName: string;
}

export const InvoiceEmail = ({
  customerName = 'Cliente',
  invoiceNumber = '2024/001',
  totalAmount = '0,00 €',
  companyName = 'Mi Empresa',
}: InvoiceEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Tu factura de {companyName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={logo}>FacturaFacil</Heading>
          </Section>
          <Section style={content}>
            <Heading style={h1}>Hola, {customerName}</Heading>
            <Text style={text}>
              Adjunto a este correo encontrará la factura <strong>{invoiceNumber}</strong> correspondiente a sus servicios con <strong>{companyName}</strong>.
            </Text>

            <Section style={infoBox}>
              <Text style={infoTitle}>Resumen de la factura:</Text>
              <Text style={infoValue}>Número: {invoiceNumber}</Text>
              <Text style={infoValue}>Importe Total: <span style={total}>{totalAmount}</span></Text>
            </Section>

            <Text style={text}>
              Puede descargar el PDF adjunto para sus registros contables.
            </Text>

            <Hr style={hr} />

            <Text style={footer}>
              Si tiene cualquier duda sobre esta factura, simplemente responda a este correo y estaremos encantados de ayudarle.
            </Text>
            <Text style={footer}>
              Atentamente,<br />
              El equipo de {companyName}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default InvoiceEmail;

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '40px auto',
  padding: '0',
  borderRadius: '12px',
  overflow: 'hidden',
  maxWidth: '600px',
  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
};

const header = {
  backgroundColor: '#313d35ff',
  padding: '30px',
  textAlign: 'center' as const,
};

const logo = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0',
};

const content = {
  padding: '40px',
};

const h1 = {
  color: '#1f2937',
  fontSize: '24px',
  fontWeight: '700',
  margin: '0 0 20px',
};

const text = {
  color: '#4b5563',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
};

const infoBox = {
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
  border: '1px solid #e5e7eb',
};

const infoTitle = {
  fontSize: '14px',
  fontWeight: 'bold',
  color: '#9ca3af',
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
  margin: '0 0 10px',
};

const infoValue = {
  fontSize: '16px',
  color: '#1f2937',
  margin: '4px 0',
};

const total = {
  fontWeight: 'bold',
  color: '#3a433dff',
  fontSize: '18px',
};

const hr = {
  borderColor: '#e5e7eb',
  margin: '30px 0',
};

const footer = {
  color: '#9ca3af',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '10px 0',
};
