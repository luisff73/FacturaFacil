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

import * as styles from './ResetPasswordEmailStyles';

interface ResetPasswordEmailProps {
  userFirstname?: string;
  resetPasswordLink?: string;
}

export const ResetPasswordEmail = ({
  userFirstname = 'Usuario',
  resetPasswordLink = 'https://facturafacil.pro/auth/new-password',
}: ResetPasswordEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Restablece tu contraseña de FacturaFacil</Preview>
      <Body style={styles.main}>
        <Container style={styles.container}>
          <Section style={styles.logoSection}>
            <Heading style={styles.logoText}>FacturaFacil</Heading>
          </Section>
          <Section style={styles.contentSection}>
            <Heading style={styles.h1}>Hola, {userFirstname}</Heading>
            <Text style={styles.text}>
              Has solicitado restablecer tu contraseña. Haz clic en el botón de abajo para elegir una nueva.
            </Text>
            <Button style={styles.button} href={resetPasswordLink}>
              Restablecer contraseña
            </Button>
            <Text style={styles.text}>
              Si no solicitaste este cambio, puedes ignorar este correo de forma segura. Tu contraseña no cambiará hasta que accedas al enlace anterior y crees una nueva.
            </Text>
            <Hr style={styles.hr} />
            <Text style={styles.footer}>
              Si tienes problemas con el botón, copia y pega este enlace en tu navegador:
              <br />
              <Link href={resetPasswordLink} style={styles.link}>
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

