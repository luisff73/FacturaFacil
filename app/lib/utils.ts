import { Revenue } from './definitions';
import crypto from 'crypto';

// Función para obtener el color del usuario
export const getUserColor = (session: any) => {
  return (session?.user as any)?.css || '#1a1c1eff';
};

// Función para formatear la moneda
export const formatCurrency = (base_imponible: number) => {
  return (base_imponible / 100).toLocaleString('es-ES', {
    style: 'currency',
    currency: 'EUR',
  });
};

// Función para formatear la fecha
export const formatDateToLocal = (
  dateStr: string,
  locale: string = 'es-ES',
) => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};

// Función para generar el eje Y
export const generateYAxis = (revenue: Revenue[]) => {
  // Calculate what labels we need to display on the y-axis
  // based on highest record and in 1000s
  const yAxisLabels = [];
  const highestRecord = Math.max(...revenue.map((month) => month.revenue));
  const topLabel = Math.ceil(highestRecord / 1000) * 1000;

  for (let i = topLabel; i >= 0; i -= 1000) {
    yAxisLabels.push(`€${i / 1000}K`);
  }

  return { yAxisLabels, topLabel };
};

// Función para generar la paginación
export const generatePagination = (currentPage: number, totalPages: number) => {

  // Si el total de paginas es 7 o menos, muestra todas las paginas sin puntos suspensivos
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // Si la pagina actual esta entre las primeras 3, muestra las primeras 3, puntos suspensivos y las ultimas 2
  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages];
  }

  // Si la pagina actual esta entre las ultimas 3, muestra las primeras 2, puntos suspensivos y las ultimas 3
  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  // Si la pagina actual esta en medio, muestra la primera pagina, puntos suspensivos, la pagina actual y sus vecinos, otros puntos suspensivos y la ultima pagina
  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
};

/**
 * Genera un Hash SHA-256 para el encadenamiento de facturas (Verifactu)
 */
export const generateInvoiceHash = (data: string) => {
  return crypto.createHash('sha256').update(data).digest('hex').toUpperCase();
};

/**
 * Devuelve la URL completa de una imagen, gestionando si es absoluta o relativa (Blob Storage)
 */
export const getImageUrl = (path: string | null | undefined, fallback: string = "/user.png") => {
  if (!path) return fallback;
  if (path.startsWith("http")) return path;
  
  // Limpiamos posibles comillas de la variable de entorno
  const baseUrl = (process.env.NEXT_PUBLIC_BLOB_URL || "").replace(/"/g, "");
  
  // Si no hay base URL y no es absoluta, devolvemos el path tal cual
  if (!baseUrl) return path;

  // Nos aseguramos de no duplicar slashes
  const cleanBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  
  return `${cleanBase}/${cleanPath}`;
};
