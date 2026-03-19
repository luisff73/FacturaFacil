'use client';

import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';

interface QRCodePreviewProps {
  cif: string;
  serie?: string;
  numero: number | string;
  fecha: string | Date;
  importe: number | string;
  size?: number;
  className?: string;
}

export default function QRCodePreview({ 
  cif, 
  serie, 
  numero, 
  fecha, 
  importe, 
  size = 128,
  className = "w-full h-full object-contain"
}: QRCodePreviewProps) {
  const [src, setSrc] = useState('');

  useEffect(() => {
    const generate = async () => {
      try {
        const dateStr = new Date(fecha).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');
        const invoiceNum = serie ? `${serie}-${numero}` : numero.toString();
        // URL Oficial de Verifactu (AEAT)
        const url = `https://www2.agenciatributaria.gob.es/wlpl/TIKE-CONT/v1/f?nif=${cif}&num=${invoiceNum}&fec=${dateStr}&imp=${Number(importe).toFixed(2)}`;
        const dataUrl = await QRCode.toDataURL(url, { margin: 1, width: size });
        setSrc(dataUrl);
      } catch (e) {
        console.error('Error generating QR code:', e);
      }
    };
    generate();
  }, [cif, serie, numero, fecha, importe, size]);

  if (!src) return <div className="animate-pulse bg-gray-100 w-full h-full rounded" />;
  
  return (
    <img 
      src={src} 
      alt="Código QR Verifactu" 
      className={className}
    />
  );
}
