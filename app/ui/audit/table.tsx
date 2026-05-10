import { fetchAuditLogs } from '@/app/lib/data';
import { formatDateToLocal } from '@/app/lib/utils';

export default async function AuditTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const logs = await fetchAuditLogs(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-2 md:pt-0 shadow-sm border border-gray-100">
          <table className="min-w-full text-gray-900 dark:text-white md:table">
            <thead className="rounded-lg text-left text-sm font-bold uppercase tracking-wider text-gray-500 border-b border-gray-200">
              <tr>
                <th scope="col" className="px-4 py-5 sm:pl-6">Fecha / Hora</th>
                <th scope="col" className="px-3 py-5">Usuario</th>
                <th scope="col" className="px-3 py-5">Evento</th>
                <th scope="col" className="px-3 py-5">Recurso</th>
                <th scope="col" className="px-3 py-5">Detalles</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100">
              {logs?.map((log: any) => (
                <tr
                  key={log.id}
                  className="w-full text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <td className="whitespace-nowrap py-4 pl-6 pr-3 font-medium text-gray-600">
                    {new Date(log.timestamp).toLocaleString('es-ES')}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-gray-500">
                    {log.user_name || 'Sistema'}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                      log.event_type === 'CREATE' ? 'bg-green-100 text-green-700' :
                      log.event_type === 'UPDATE' ? 'bg-blue-100 text-blue-700' :
                      log.event_type === 'DELETE' ? 'bg-red-100 text-red-700' :
                      log.event_type === 'LOCK' ? 'bg-purple-100 text-purple-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {log.event_type}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-gray-500">
                    {log.resource_type}
                  </td>
                  <td className="px-3 py-4 text-gray-600 max-w-xs truncate" title={log.details}>
                    {log.details}
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-gray-400 italic">
                    No se han encontrado registros de auditoría.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
