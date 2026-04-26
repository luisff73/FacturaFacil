// Estilos para la plantilla de correo de facturas
// Separamos los estilos en este archivo para evitar warnings de CSS inline en el componente principal

export const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
};

export const container = {
  backgroundColor: '#ffffff',
  margin: '40px auto',
  padding: '0',
  borderRadius: '12px',
  overflow: 'hidden',
  maxWidth: '600px',
  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
};

export const header = {
  backgroundColor: '#313d35ff',
  padding: '30px',
  textAlign: 'center' as const,
};

export const logo = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0',
};

export const content = {
  padding: '40px',
};

export const h1 = {
  color: '#1f2937',
  fontSize: '24px',
  fontWeight: '700',
  margin: '0 0 20px',
};

export const text = {
  color: '#4b5563',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
};

export const infoBox = {
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
  border: '1px solid #e5e7eb',
};

export const infoTitle = {
  fontSize: '14px',
  fontWeight: 'bold',
  color: '#9ca3af',
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
  margin: '0 0 10px',
};

export const infoValue = {
  fontSize: '16px',
  color: '#1f2937',
  margin: '4px 0',
};

export const total = {
  fontWeight: 'bold',
  color: '#3a433dff',
  fontSize: '18px',
};

export const hr = {
  borderColor: '#e5e7eb',
  margin: '30px 0',
};

export const footer = {
  color: '#9ca3af',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '10px 0',
};
