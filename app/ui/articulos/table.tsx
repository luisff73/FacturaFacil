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
            <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">
              <div className="md:hidden">
                {articulos?.map((articulo) => (
                  <div
                    key={articulo.id}
                    className="mb-2 w-full rounded-md bg-white p-4"
                  >
                    <div className="flex items-center justify-between border-b pb-4">
                      <div>
                        <div className="mb-2 flex items-center">
                          <div className="flex items-center gap-3">
                            <Image
                              src={articulo.imagen[0]?.ruta || '/placeholder.png'}
                              className="rounded-full"
                              alt={`${articulo.descripcion}`}
                              width={28}
                              height={28}
                            />
                            <p>{articulo.descripcion}</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">
                          Código: {articulo.codigo}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <UpdateArticulo id={articulo.id} />
                        <DeleteArticulo id={articulo.id} />
                      </div>
                    </div>
                    <div className="flex w-full items-center justify-between border-b py-5">
                      <div className="flex w-1/2 flex-col">
                        <p className="text-xs">Precio</p>
                        <p className="font-medium">{articulo.precio.toFixed(2)} €</p>
                      </div>
                      <div className="flex w-1/2 flex-col">
                        <p className="text-xs">IVA</p>
                        <p className="font-medium">{articulo.iva.toFixed(2)} %</p>
                      </div>
                    </div>
                    <div className="pt-4 text-sm">
                      <p>Stock: {articulo.stock}</p>
                    </div>
                  </div>
                ))}
              </div>
              <table className="hidden min-w-full rounded-md text-gray-900 md:table">
                <thead className="rounded-md bg-gray-50 text-left text-sm font-normal">
                  <tr>
                    <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                      Código
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Descripción
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Precio
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      IVA
                    </th>
                    <th scope="col" className="px-4 py-5 font-medium">
                      Stock
                    </th>
                    <th scope="col" className="px-4 py-5 font-medium">
                      Imagen
                    </th>
                    <th scope="col" className="px-4 py-5 font-medium">
                      Acciones
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 text-gray-900">
                  {articulos.map((articulo) => (
                    <tr key={articulo.id} className="group">
                      <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                        {articulo.codigo}
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {articulo.descripcion}
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {articulo.precio.toFixed(2)} €
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {articulo.iva.toFixed(2)} %
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        {articulo.stock}
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                        <Image
                          src={articulo.imagen[0]?.ruta || '/placeholder.png'}
                          className="rounded-full"
                          alt={`${articulo.descripcion}`}
                          width={28}
                          height={28}
                        />
                      </td>
                      <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
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