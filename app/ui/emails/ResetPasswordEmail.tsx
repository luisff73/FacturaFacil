import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Hr,
  Link,
} from '@react-email/components';
import * as React from 'react';

interface ResetPasswordEmailProps {
  userFirstname?: string;
  resetPasswordLink?: string;
}

export const ResetPasswordEmail = ({
  userFirstname = 'Usuario',
  resetPasswordLink = 'https://facturafacil.com/reset-password',
}: ResetPasswordEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Restablece tu contraseña de FacturaFacil</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoSection}>
            <Heading style={logoText}>FacturaFacil</Heading>
          </Section>
          <Section style={contentSection}>
            <Heading style={h1}>Hola, {userFirstname}</Heading>
            <Text style={text}>
              Has solicitado restablecer tu contraseña. Haz clic en el botón de abajo para elegir una nueva.
            </Text>
            <Button style={button} href={resetPasswordLink}>
              Restablecer contraseña
            </Button>
            <Text style={text}>
              Si no solicitaste este cambio, puedes ignorar este correo de forma segura. Tu contraseña no cambiará hasta que accedas al enlace anterior y crees una nueva.
            </Text>
            <Hr style={hr} />
            <Text style={footer}>
              Si tienes problemas con el botón, copia y pega este enlace en tu navegador:
              <br />
              <Link href={resetPasswordLink} style={link}>
                {resetPasswordLink}
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default ResetPasswordEmail;

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  borderRadius: '8px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
};

const logoSection = {
  padding: '32px',
  textAlign: 'center' as const,
  backgroundColor: '#22c55e', // Tu verde de FacturaFacil
  borderRadius: '8px 8px 0 0',
};

const logoText = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0',
};

const contentSection = {
  padding: '32px',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  padding: '0',
  margin: '30px 0',
};

const text = {
  color: '#555',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
};

const button = {
  backgroundColor: '#22c55e',
  borderRadius: '5px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '100%',
  padding: '12px 0',
  marginTop: '25px',
  marginBottom: '25px',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
};

const link = {
  color: '#22c55e',
  textDecoration: 'underline',
};
