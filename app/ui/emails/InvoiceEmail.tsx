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

import * as styles from './InvoiceEmailStyles';

interface InvoiceEmailProps {
  customerName: string;
  invoiceNumber: string;
  totalAmount: string;
  companyName: string;
}

export const InvoiceEmail = ({
  customerName,
  invoiceNumber,
  totalAmount,
  companyName,
}: InvoiceEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Factura {invoiceNumber} de {companyName}</Preview>
      <Body style={styles.main}>
        <Container style={styles.container}>
          <Section style={styles.header}>
            <Heading style={styles.logo}>FacturaFacil</Heading>
          </Section>
          <Section style={styles.content}>
            <Heading style={styles.h1}>Hola, {customerName}</Heading>
            <Text style={styles.text}>
              Adjunto a este correo encontrará la factura <strong>{invoiceNumber}</strong> correspondiente a sus servicios con <strong>{companyName}</strong>.
            </Text>

            <Section style={styles.infoBox}>
              <Text style={styles.infoTitle}>Resumen de la factura:</Text>
              <Text style={styles.infoValue}>Número: {invoiceNumber}</Text>
              <Text style={styles.infoValue}>Importe Total: <span style={styles.total}>{totalAmount}</span></Text>
            </Section>

            <Text style={styles.text}>
              Puede descargar el PDF adjunto para sus registros contables.
            </Text>

            <Hr style={styles.hr} />

            <Text style={styles.footer}>
              Si tiene cualquier duda sobre esta factura, simplemente responda a este correo y estaremos encantados de ayudarle.
            </Text>
            <Text style={styles.footer}>
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
