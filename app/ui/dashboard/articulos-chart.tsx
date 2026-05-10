import { fetchArticulosMostWanted } from '@/app/lib/data';
import { lusitana } from '@/app/ui/fonts';
import { formatCurrency } from '@/app/lib/utils';

export default async function ArticulosChart() {
  const articulos = await fetchArticulosMostWanted();

  if (!articulos || articulos.length === 0) {
    return <p className={`${lusitana.className} mt-4 text-gray-400`}>No hay datos disponibles.</p>;
  }

  const totalGeneral = articulos.reduce((acc, art) => acc + Number(art.total), 0);
  
  // Usamos el valor máximo como el 100% del ancho de la barra para que la más grande llene el contenedor
  const maxTotal = Math.max(...articulos.map(art => Number(art.total)));

  return (
    <div className="w-full md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl dark:text-white`}>
        Artículos más vendidos
      </h2>
      <div className="grow rounded-xl bg-gray-50 dark:bg-gray-800 p-4">
        <div className="flex flex-col gap-4">
          {articulos.map((art, index) => {
            const percentageOfMax = (Number(art.total) / maxTotal) * 100;
            const percentageOfTotal = (Number(art.total) / totalGeneral) * 100;

            return (
              <div key={art.id_articulo} className="flex flex-col gap-1">
                {/* Textos: Posición, Nombre, Porcentaje y Total */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className="font-bold text-gray-400 dark:text-gray-500 w-5 flex-shrink-0">
                      #{index + 1}
                    </span>
                    <span className="font-medium dark:text-gray-200 truncate" title={art.descripcion}>
                      {art.descripcion}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      ({percentageOfTotal.toFixed(1)}%)
                    </span>
                    <span className="font-semibold dark:text-white">
                      {formatCurrency(Number(art.total))}
                    </span>
                  </div>
                </div>

                {/* Barra de progreso */}
                <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-color-user-300 h-full rounded-full" 
                    style={{ width: `${percentageOfMax}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
