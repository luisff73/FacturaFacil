// Este documento es el que se encarga de generar el PDF de la factura
// Se usa la librería @react-pdf/renderer para generar el PDF
// hay generar un documento por cada formato de factura

'use client';

import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';
import { Invoice, invoices_lines, Customer, Empresas } from '@/app/lib/definitions';
import { formatCurrency, formatDateToLocal } from '@/app/lib/utils';
import { useState, useEffect } from 'react';
import QRCode from 'qrcode';

const BLOB_URL = process.env.NEXT_PUBLIC_BLOB_URL || '';

// Registramos la fuente roboto
Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf', fontWeight: 300 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf', fontWeight: 400 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-italic-webfont.ttf', fontWeight: 400, fontStyle: 'italic' },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf', fontWeight: 500 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 700 },
  ],
});

// Estilos del documento
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Roboto',
    fontSize: 10,
    color: '#333',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 2,
    borderBottomColor: '#f3f4f6',
    paddingBottom: 20,
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: 'column',
  },
  invoiceTitle: {
    fontSize: 24,
    fontWeight: 700,
    color: '#1f2937',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  invoiceMeta: {
    color: '#6b7280',
    fontWeight: 500,
  },
  companyInfo: {
    textAlign: 'right',
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 5,
    alignSelf: 'flex-end',
  },
  placeholderLogo: {
    width: 100,
    height: 30,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignSelf: 'flex-end',
  },
  placeholderLogoText: {
    fontSize: 8,
    color: '#9ca3af',
    fontWeight: 700,
  },
  companyName: {
    fontSize: 16,
    fontWeight: 700,
    color: '#30374cff',
    marginBottom: 2,
  },
  companyText: {
    color: '#4b5563',
  },
  customerSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 8,
    fontWeight: 700,
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  customerCard: {
    backgroundColor: '#f9fafb',
    padding: 15,
    borderRadius: 8,
  },
  customerName: {
    fontSize: 12,
    fontWeight: 700,
    color: '#1f2937',
    marginBottom: 2,
  },
  customerText: {
    color: '#4b5563',
  },
  table: {
    width: 'auto',
    marginBottom: 30,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#1f2937',
    paddingBottom: 8,
    marginBottom: 8,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    paddingVertical: 8,
    alignItems: 'center',
  },
  colDesc: { width: '55%' },
  colQty: { width: '15%', textAlign: 'right' },
  colPrice: { width: '15%', textAlign: 'right' },
  colTotal: { width: '15%', textAlign: 'right' },
  headerLabel: {
    fontSize: 8,
    fontWeight: 700,
    color: '#4b5563',
    textTransform: 'uppercase',
  },
  lineDesc: {
    fontWeight: 500,
    color: '#1f2937',
  },
  lineObs: {
    fontSize: 8,
    color: '#6b7280',
    fontStyle: 'italic',
    marginTop: 2,
  },
  lineText: {
    color: '#4b5563',
  },
  lineTotal: {
    fontWeight: 700,
    color: '#111827',
  },
  footer: {
    marginTop: 'auto',
    paddingTop: 20,
  },
  totalsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 30,
  },
  totalsBox: {
    width: 200,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    backgroundColor: '#1f2937',
    color: '#ffffff',
    padding: 10,
    borderRadius: 6,
  },
  grandTotalLabel: {
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  grandTotalAmount: {
    fontSize: 16,
    fontWeight: 700,
  },
  closingMessage: {
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 15,
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: 8,
  },
  qrContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 10,
    gap: 15,
  },
  qrImage: {
    width: 60,
    height: 60,
  },
  qrText: {
    fontSize: 7,
    color: '#6b7280',
    maxWidth: 200,
  },
});

// Props del documento PDF
interface InvoicePDFProps {
  invoice: Invoice;
  lines: invoices_lines[];
  customer: Customer;
  empresa: Empresas;
}

export default function InvoicePDFDocument({ invoice, lines, customer, empresa }: InvoicePDFProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const isProforma = invoice.tipo === 'Pedido';
  const title = isProforma ? 'Pedido' : 'Factura';
  const accentColor = isProforma ? '#64748b' : '#30374cff'; // Gris azulado para proforma, tu color para el resto

  useEffect(() => {
    const generateQR = async () => {
      try {
        // Enlace oficial tentativo Verifactu / AEAT para verificación de facturas
        const dateStr = new Date(invoice.date).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');
        const invoiceNum = invoice.invoice_serie ? `${invoice.invoice_serie}-${invoice.invoice_number}` : invoice.invoice_number.toString();
        // URL Oficial de Verifactu (AEAT) para verificación de facturas (Entorno de pruebas)
        const verifactuUrl = `https://prewww2.aeat.es/wlpl/TIKE-CONT/ValidarQR?nif=${empresa.cif}&numserie=${invoice.invoice_serie ? invoice.invoice_serie + '/' : ''}${invoice.invoice_number}&fecha=${dateStr}&importe=${(invoice.total_factura / 100).toFixed(2)}`;

        const url = await QRCode.toDataURL(verifactuUrl, {
          margin: 1,
          color: {
            dark: '#1f2937',
            light: '#ffffff'
          }
        });
        setQrCodeUrl(url);
      } catch (err) {
        console.error('Error generating QR code:', err);
      }
    };
    generateQR();
  }, [invoice, empresa]);

  return (
    <Document title={`${title} ${invoice.id}`}>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={[styles.invoiceTitle, { color: accentColor }]}>{title}</Text>
            <Text style={styles.invoiceMeta}>Nº: {new Date(invoice.date).getFullYear()}/{invoice.invoice_serie ? invoice.invoice_serie + '/' : ''}{invoice.invoice_number}</Text>
            <Text style={styles.invoiceMeta}>Fecha: {formatDateToLocal(invoice.date)}</Text>
          </View>
          <View style={styles.companyInfo}>
            <View style={styles.placeholderLogo}>
              <Text style={styles.placeholderLogoText}>SU LOGO AQUÍ</Text>
            </View>
            <Text style={[styles.companyName, { color: accentColor }]}>{empresa.nombre}</Text>
            <Text style={styles.companyText}>{empresa.direccion}</Text>
            <Text style={styles.companyText}>{empresa.c_postal} - {empresa.poblacion}</Text>
            <Text style={styles.companyText}>{empresa.provincia}</Text>
            <Text style={styles.companyText}>CIF: {empresa.cif}</Text>
          </View>
        </View>

        {/* Cliente */}
        <View style={styles.customerSection}>
          <Text style={styles.sectionTitle}>Cliente</Text>
          <View style={styles.customerCard}>
            <Text style={styles.customerName}>{customer.name}</Text>
            <Text style={styles.customerText}>{customer.email}</Text>
            <Text style={styles.customerText}>{customer.direccion}</Text>
            <Text style={styles.customerText}>{customer.c_postal} {customer.poblacion}</Text>
            <Text style={styles.customerText}>{customer.provincia}</Text>
            <Text style={styles.customerText}>{customer.pais}</Text>
            <Text style={styles.customerText}>{customer.cif}</Text>
          </View>
        </View>

        {/* Tabla Lineas */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.headerLabel, styles.colDesc]}>Descripción</Text>
            <Text style={[styles.headerLabel, styles.colQty]}>Cant.</Text>
            <Text style={[styles.headerLabel, styles.colPrice]}>Precio</Text>
            <Text style={[styles.headerLabel, styles.colTotal]}>Total</Text>
          </View>

          {lines.map((line) => (
            <View key={line.linea} style={styles.tableRow}>
              <View style={styles.colDesc}>
                <Text style={styles.lineDesc}>{line.descripcion}</Text>
                {line.observaciones && <Text style={styles.lineObs}>{line.observaciones}</Text>}
              </View>
              <Text style={[styles.lineText, styles.colQty]}>{(line.cantidad / 100).toFixed(2)}</Text>
              <Text style={[styles.lineText, styles.colPrice]}>{formatCurrency(line.precio)}</Text>
              <Text style={[styles.lineTotal, styles.colTotal]}>{formatCurrency(line.total)}</Text>
            </View>
          ))}
        </View>

        {/* Totales y Pie */}
        <View style={styles.footer}>
          <View style={styles.totalsContainer}>
            <View style={styles.totalsBox}>
              <View style={styles.totalRow}>
                <Text style={styles.companyText}>Base Imponible</Text>
                <Text style={styles.lineDesc}>{formatCurrency(invoice.base_imponible)}</Text>
              </View>

              {invoice.total_iva > 0 && (
                <View style={styles.totalRow}>
                  <Text style={styles.companyText}>IVA</Text>
                  <Text style={styles.lineDesc}>{formatCurrency(invoice.total_iva)}</Text>
                </View>
              )}

              {invoice.total_recargo > 0 && (
                <View style={styles.totalRow}>
                  <Text style={styles.companyText}>Recargo (RE)</Text>
                  <Text style={styles.lineDesc}>{formatCurrency(invoice.total_recargo)}</Text>
                </View>
              )}

              <View style={[styles.grandTotalRow, { backgroundColor: accentColor }]}>
                <Text style={styles.grandTotalLabel}>Total</Text>
                <Text style={styles.grandTotalAmount}>{formatCurrency(invoice.total_factura)}</Text>
              </View>
            </View>
          </View>

          <View style={styles.closingMessage}>
            <Text>Gracias por su confianza.</Text>
            <Text style={{ marginTop: 4 }}>{empresa.nombre} - Generado por FacturaFácil</Text>
          </View>

          {/* QR Verifactu AEAT */}
          {!isProforma && qrCodeUrl && (
            <View style={styles.qrContainer}>
              <Image src={qrCodeUrl} style={styles.qrImage} />
              <View style={styles.qrText}>
                <Text style={{ fontWeight: 700, color: '#2563eb', marginBottom: 2 }}>VERI*FACTU</Text>
                <Text>Esta factura cumple con los requisitos de la normativa de la Agencia Tributaria.</Text>
                {invoice.hash && (
                  <Text style={{ marginTop: 3, fontSize: 5, color: '#d1d5db', fontFamily: 'Courier' }}>
                    HUÉRGARA: {invoice.hash.substring(0, 16)}...
                  </Text>
                )}
              </View>
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
}
