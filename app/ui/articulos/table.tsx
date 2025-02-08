import { ArticulosTableType } from '@/app/lib/definitions';
import Image from 'next/image';
import { UpdateArticulo, DeleteArticulo } from '@/app/ui/articulos/buttons';
import Search from '@/app/ui/search';

interface ArticulosTableProps {
  articulos: ArticulosTableType[];
}

export default function ArticulosTable({ articulos }: ArticulosTableProps) {
  return (
    <div className="w-full">
      <Search placeholder="Buscar artículos..." />
      <div className="mt-6 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-md bg-gray-50 dark:bg-gray-800 p-2 md:pt-0">
              <div className="md:hidden">
                {articulos?.map((articulo) => (
                  <div
                    key={articulo.id}
                    className="mb-2 w-full rounded-md bg-white dark:bg-gray-900 p-4"
                  >
                    <div className="flex items-center justify-between border-b dark:border-gray-700 pb-4">
                      <div>
                        <div className="mb-2 flex items-center">
                          <div className="flex items-center gap-3">
                            <Image
                              src={articulo.imagen && articulo.imagen[0] && articulo.imagen[0]?.ruta.startsWith('/') ? articulo.imagen[0].ruta : articulo.imagen && articulo.imagen[0] ? `/${articulo.imagen[0]?.ruta}` : ''}
                              alt={articulo.descripcion}
                              width={50}
                              height={50}
                              className="rounded-full"
                            />
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {articulo.descripcion}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {articulo.codigo}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex w-1/2 flex-col">
                          <p className="text-xs dark:text-gray-400">Precio</p>
                          <p className="font-medium dark:text-white">{articulo.precio} €</p>
                        </div>
                        <div className="flex w-1/2 flex-col">
                          <p className="text-xs dark:text-gray-400">IVA</p>
                          <p className="font-medium dark:text-white">{articulo.iva} %</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <UpdateArticulo id={articulo.id} />
                        <DeleteArticulo id={articulo.id} />
                      </div>
                    </div>
                    <div className="pt-4 text-sm dark:text-gray-300">
                      <p>Stock: {articulo.stock}</p>
                    </div>
                  </div>
                ))}
              </div>

              <table className="hidden min-w-full rounded-md text-gray-900 dark:text-white md:table">
                <thead className="rounded-md bg-gray-50 dark:bg-gray-800 text-left text-sm font-normal">
                  <tr>
                    <th scope="col" className="px-4 py-5 font-medium dark:text-gray-200 sm:pl-6">
                      Código
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium dark:text-gray-200">
                      Descripción
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium dark:text-gray-200">
                      Precio
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium dark:text-gray-200">
                      IVA
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium dark:text-gray-200">
                      Stock
                    </th>
                    <th scope="col" className="px-4 py-5 font-medium dark:text-gray-200">
                      Acciones
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 text-gray-900 dark:text-white">
                  {articulos.map((articulo) => (
                    <tr key={articulo.id} className="group hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="whitespace-nowrap bg-white dark:bg-gray-900 py-5 pl-4 pr-3 text-sm text-black dark:text-white group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                        <div className="flex items-center gap-3">
                          <Image
                            src={articulo.imagen && articulo.imagen[0] && articulo.imagen[0]?.ruta.startsWith('/') ? articulo.imagen[0].ruta : articulo.imagen && articulo.imagen[0] ? `/${articulo.imagen[0]?.ruta}` : ''}
                            alt={articulo.descripcion}
                            width={28}
                            height={28}
                            className="rounded-full"
                          />
                          <p>{articulo.descripcion}</p>
                        </div>
                      </td>
                      <td className="whitespace-nowrap bg-white dark:bg-gray-900 px-4 py-5 text-sm dark:text-gray-200">
                        {articulo.codigo}
                      </td>
                      <td className="whitespace-nowrap bg-white dark:bg-gray-900 px-4 py-5 text-sm dark:text-gray-200">
                        {articulo.precio} €
                      </td>
                      <td className="whitespace-nowrap bg-white dark:bg-gray-900 px-4 py-5 text-sm dark:text-gray-200">
                        {articulo.iva} %
                      </td>
                      <td className="whitespace-nowrap bg-white dark:bg-gray-900 px-4 py-5 text-sm dark:text-gray-200">
                        {articulo.stock}
                      </td>
                      <td className="whitespace-nowrap bg-white dark:bg-gray-900 px-4 py-5 text-sm">
                        <div className="flex items-center gap-2">
                          <UpdateArticulo id={articulo.id} />
                          <DeleteArticulo id={articulo.id} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}