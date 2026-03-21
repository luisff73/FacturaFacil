// Este documento es el que se encarga de generar el PDF del listado de facturas

'use client';

import { Document, Page, Text, View, StyleSheet, Font, } from '@react-pdf/renderer';
import { formatCurrency, formatDateToLocal } from '@/app/lib/utils';
import { InvoicesTable } from '@/app/lib/definitions';

Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf', fontWeight: 400 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-italic-webfont.ttf', fontWeight: 400, fontStyle: 'italic' },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 700 },
  ],
});

const styles = StyleSheet.create({
  page: { padding: 30, fontFamily: 'Roboto' },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: { fontSize: 20, fontWeight: 700, color: '#111827' },
  companyName: { fontSize: 13, color: '#4b5563', marginTop: 4 },
  date: { fontSize: 10, color: '#6b7280' },
  table: { width: 'auto' },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f9fafb',
    borderBottomWidth: 1,
    borderBottomColor: '#111827',
    padding: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    padding: 10,
    alignItems: 'center'
  },
  headerText: { fontSize: 10, fontWeight: 700, color: '#374151', textTransform: 'uppercase' },
  rowText: { fontSize: 9, color: '#4b5563' },
  colNum: { width: '10%' },
  colCif: { width: '9%' },
  colName: { width: '30%' },
  colEstado: { width: '9%', textAlign: 'center' },
  colDate: { width: '12%', textAlign: 'left' },
  colBaseImponible: { width: '12%', textAlign: 'right' },
  colIva: { width: '9%', textAlign: 'right' },
  colRecargo: { width: '9%', textAlign: 'right' },
  colAmount: { width: '9%', textAlign: 'right' },
  summary: {
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    textAlign: 'right'
  },
  summaryText: { fontSize: 12, fontWeight: 700, color: '#111827' }
});
export default function InvoicesListPDF({ invoices, companyName }: { invoices: InvoicesTable[], companyName: string }) {
  const totalAmount = invoices.reduce((acc, inv) => acc + inv.total_factura, 0);

  return (
    <Document title="Listado de Facturas">
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.header}>
          <View style={{ alignItems: 'flex-start' }}>
            <Text style={styles.title}>Listado de Facturas</Text>
            {companyName ? <Text style={styles.companyName}>{companyName.trim().toUpperCase()}</Text> : null}
          </View>
          <Text style={styles.date}>Generado el {new Date().toLocaleDateString()}</Text>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.headerText, styles.colNum]}>Nº Factura</Text>
            <Text style={[styles.headerText, styles.colDate]}>Fecha</Text>
            <Text style={[styles.headerText, styles.colCif]}>CIF</Text>
            <Text style={[styles.headerText, styles.colName]}>Cliente</Text>
            <Text style={[styles.headerText, styles.colEstado]}>Estado</Text>
            <Text style={[styles.headerText, styles.colBaseImponible]}>Base imp.</Text>
            <Text style={[styles.headerText, styles.colIva]}>IVA</Text>
            <Text style={[styles.headerText, styles.colRecargo]}>RE</Text>
            <Text style={[styles.headerText, styles.colAmount]}>Total</Text>

          </View>

          {invoices.map((invoice) => (
            <View key={invoice.id} style={styles.tableRow}>
              <Text style={[styles.rowText, styles.colNum]}>{new Date(invoice.date).getFullYear()}/{invoice.invoice_serie}/{invoice.invoice_number}</Text>
              <Text style={[styles.rowText, styles.colDate]}>{formatDateToLocal(invoice.date)}</Text>
              <Text style={[styles.rowText, styles.colCif]}>{invoice.cif}</Text>
              <Text style={[styles.rowText, styles.colName]}>{invoice.name}</Text>
              <Text style={[styles.rowText, styles.colEstado]}>{invoice.status}</Text>
              <Text style={[styles.rowText, styles.colBaseImponible]}>{formatCurrency(invoice.base_imponible)}</Text>
              <Text style={[styles.rowText, styles.colIva]}>{formatCurrency(invoice.total_iva)}</Text>
              <Text style={[styles.rowText, styles.colRecargo]}>{formatCurrency(invoice.total_recargo)}</Text>
              <Text style={[styles.rowText, styles.colAmount, { fontWeight: 700 }]}>{formatCurrency(invoice.total_factura)}</Text>

            </View>
          ))}
        </View>

        <View style={styles.summary}>
          <Text style={styles.summaryText}>Total Facturado: {formatCurrency(totalAmount)}</Text>
          <Text style={[styles.date, { marginTop: 4 }]}>Nº de Facturas: {invoices.length}</Text>
        </View>
      </Page>
    </Document>
  );
}
