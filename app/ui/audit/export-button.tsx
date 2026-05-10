'use client';

import { TableCellsIcon } from '@heroicons/react/24/outline';

export default function ExportAuditButton({ logs }: { logs: any[] }) {
  const handleExportCSV = () => {
    const headers = ['ID', 'Fecha', 'Usuario', 'Evento', 'Recurso', 'Recurso ID', 'Detalles'];
    
    const csvContent = [
      headers.join(';'),
      ...logs.map(log => [
        log.id,
        `"${new Date(log.timestamp).toLocaleString('es-ES')}"`,
        `"${log.user_name || 'Sistema'}"`,
        `"${log.event_type}"`,
        `"${log.resource_type}"`,
        `"${log.resource_id || ''}"`,
        `"${log.details?.replace(/"/g, '""') || ''}"`
      ].join(';'))
    ].join('\n');

    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Auditoria_VeriFactu_${new Date().toISOString().split('T')[0]}.csv`);

    // Log de exportación (Fase 4)
    import('@/app/lib/actions').then(m => m.logExport('AUDIT', `Exportación de registro de auditoría (${logs.length} registros) a CSV.`));

    link.click();
  };

  return (
    <button
      onClick={handleExportCSV}
      className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200 gap-2 border border-gray-200"
    >
      <TableCellsIcon className="w-5 h-5" />
      <span className="hidden md:block">Exportar Auditoría (CSV)</span>
    </button>
  );
}
