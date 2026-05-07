import { renderToBuffer } from '@react-pdf/renderer';
import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';
import { Invoice, invoices_lines, Customer, Empresas } from '@/app/lib/definitions';
import { formatCurrency, formatDateToLocal } from '@/app/lib/utils';
import QRCode from 'qrcode';

// Registramos la fuente roboto
Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf', fontWeight: 300 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf', fontWeight: 400 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf', fontWeight: 500 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 700 },
  ],
});

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Roboto', fontSize: 10, color: '#333' },
  header: { flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 2, borderBottomColor: '#f3f4f6', paddingBottom: 20, marginBottom: 20 },
  titleContainer: { flexDirection: 'column' },
  invoiceTitle: { fontSize: 24, fontWeight: 700, color: '#1f2937', textTransform: 'uppercase', marginBottom: 4 },
  invoiceMeta: { color: '#6b7280', fontWeight: 500 },
  companyInfo: { textAlign: 'right' },
  companyName: { fontSize: 16, fontWeight: 700, color: '#30374cff', marginBottom: 2 },
  companyText: { color: '#4b5563' },
  customerSection: { marginBottom: 30 },
  sectionTitle: { fontSize: 8, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  customerCard: { backgroundColor: '#f9fafb', padding: 15, borderRadius: 8 },
  customerName: { fontSize: 12, fontWeight: 700, color: '#1f2937', marginBottom: 2 },
  customerText: { color: '#4b5563' },
  table: { width: 'auto', marginBottom: 30 },
  tableHeader: { flexDirection: 'row', borderBottomWidth: 2, borderBottomColor: '#1f2937', paddingBottom: 8, marginBottom: 8 },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#f3f4f6', paddingVertical: 8, alignItems: 'center' },
  colDesc: { width: '55%' },
  colQty: { width: '15%', textAlign: 'right' },
  colPrice: { width: '15%', textAlign: 'right' },
  colTotal: { width: '15%', textAlign: 'right' },
  headerLabel: { fontSize: 8, fontWeight: 700, color: '#4b5563', textTransform: 'uppercase' },
  lineDesc: { fontWeight: 500, color: '#1f2937' },
  lineObs: { fontSize: 8, color: '#6b7280', fontStyle: 'italic', marginTop: 2 },
  lineText: { color: '#4b5563' },
  lineTotal: { fontWeight: 700, color: '#111827' },
  footer: { marginTop: 'auto', paddingTop: 20 },
  totalsContainer: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 30 },
  totalsBox: { width: 200 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  grandTotalRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, backgroundColor: '#1f2937', color: '#ffffff', padding: 10, borderRadius: 6 },
  grandTotalLabel: { fontWeight: 700, textTransform: 'uppercase' },
  grandTotalAmount: { fontSize: 16, fontWeight: 700 },
  closingMessage: { borderTopWidth: 1, borderTopColor: '#f3f4f6', paddingTop: 15, textAlign: 'center', color: '#9ca3af', fontSize: 8 },
  qrContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 20, borderTopWidth: 1, borderTopColor: '#f3f4f6', paddingTop: 10, gap: 15 },
  qrImage: { width: 60, height: 60 },
  qrText: { fontSize: 7, color: '#6b7280', maxWidth: 200 },
});

export async function generateInvoicePDFBuffer(invoice: Invoice, lines: invoices_lines[], customer: Customer, empresa: Empresas) {
  const dateStr = new Date(invoice.date).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');
  const verifactuUrl = `https://prewww2.aeat.es/wlpl/TIKE-CONT/ValidarQR?nif=${empresa.cif}&numserie=${invoice.invoice_serie ? invoice.invoice_serie + '/' : ''}${invoice.invoice_number}&fecha=${dateStr}&importe=${(invoice.total_factura / 100).toFixed(2)}`;
  
  const qrCodeUrl = await QRCode.toDataURL(verifactuUrl, { margin: 1 });

  const isProforma = invoice.tipo === 'Pedido';
  const title = isProforma ? 'Pedido' : 'Factura';
  const accentColor = isProforma ? '#64748b' : '#30374cff';

  const MyDoc = (
    <Document title={`${title} ${invoice.id}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={[styles.invoiceTitle, { color: accentColor }]}>{title}</Text>
            <Text style={styles.invoiceMeta}>Nº: {new Date(invoice.date).getFullYear()}/{invoice.invoice_serie ? invoice.invoice_serie + '/' : ''}{invoice.invoice_number}</Text>
            <Text style={styles.invoiceMeta}>Fecha: {formatDateToLocal(invoice.date)}</Text>
          </View>
          <View style={styles.companyInfo}>
            <Text style={[styles.companyName, { color: accentColor }]}>{empresa.nombre}</Text>
            <Text style={styles.companyText}>{empresa.direccion}</Text>
            <Text style={styles.companyText}>{empresa.c_postal} - {empresa.poblacion}</Text>
            <Text style={styles.companyText}>{empresa.provincia}</Text>
            <Text style={styles.companyText}>CIF: {empresa.cif}</Text>
          </View>
        </View>

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
          {!isProforma && (
            invoice.bloqueada && qrCodeUrl ? (
              <View style={styles.qrContainer}>
                <Image src={qrCodeUrl} style={styles.qrImage} />
                <View style={styles.qrText}>
                  <Text style={{ fontWeight: 700, color: '#2563eb', marginBottom: 2 }}>VERI*FACTU</Text>
                  <Text>Esta factura cumple con la normativa de la Agencia Tributaria.</Text>
                </View>
              </View>
            ) : (
              <View style={[styles.qrContainer, { padding: 15, backgroundColor: '#fffbeb', borderLeftWidth: 4, borderLeftColor: '#f59e0b', borderRadius: 4, marginTop: 20 }]}>
                <View style={[styles.qrText, { maxWidth: '100%' }]}>
                  <Text style={{ fontWeight: 700, color: '#d97706', marginBottom: 2 }}>PENDIENTE DE VALIDACIÓN FISCAL</Text>
                  <Text style={{ color: '#92400e' }}>Documento interno sin validez fiscal hasta su confirmación y bloqueo definitivo.</Text>
                </View>
              </View>
            )
          )}
        </View>
      </Page>
    </Document>
  );

  return await renderToBuffer(MyDoc);
}
