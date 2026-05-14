import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'pro.facturafacil.app',
  appName: 'facturafacil',
  webDir: 'out', // Capacitor lo ignora si usas server.url
  server: {
    url: 'https://facturafacil.pro', // <--- Ponemos la url real aquí
    cleartext: true
  }
};

export default config;
