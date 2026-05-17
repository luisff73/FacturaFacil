'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createArticulo, uploadImage } from '@/app/lib/actions'; // esta es la accion que crea el articulo y sube la imagen
import { ArticulosTableType } from '@/app/lib/definitions';
import { Button } from '@/app/ui/button';
import Link from 'next/link';

interface FormProps {
  articulos: ArticulosTableType[]; // recibe todos los artículos de la funcion fetchArticulos() de dashboard/articulos/page.tsx
}

const CreateArticulosForm: React.FC<FormProps> = () => {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<{ errors: { codigo?: string[]; descripcion?: string[]; precio?: string[]; iva?: string[]; stock?: string[]; imagen?: string[] }, message: string }>({ errors: {}, message: '' });
  const router = useRouter();

  const formAction = async (event: React.FormEvent<HTMLFormElement>) => { // funcion que se ejecuta al enviar el formulario
    event.preventDefault();  // evita que la pagina se recargue al enviar el formulario
    const formData = new FormData(event.target as HTMLFormElement); // crea un objeto FormData con los datos del formulario
    const fileInput = inputFileRef.current?.files?.[0]; // obtiene el archivo seleccionado del input file
    let imageUrl = '';

    if (fileInput && fileInput.size > 0) { // si se ha seleccionado un archivo y tiene tamaño
      // Crear un FormData con solo el archivo para enviarlo a la Server Action
      const uploadData = new FormData();
      uploadData.append('file', fileInput);

      const uploadedPath = await uploadImage(uploadData); // sube la imagen a la carpeta de imagenes en blob storage
      if (uploadedPath) { // si la imagen se ha subido correctamente
        imageUrl = uploadedPath; // almacena la ruta de la imagen
      }
    }

    // crea un objeto con los datos del formulario
    const data = {
      codigo: formData.get('codigo') as string,
      descripcion: formData.get('descripcion') as string,
      precio: parseFloat(formData.get('precio') as string),
      iva: parseFloat(formData.get('iva') as string),
      stock: parseFloat(formData.get('stock') as string),
      imagen: imageUrl ? [{ id: 1, ruta: imageUrl }] : [{ id: 1, ruta: 'articulo.png' }]
    };

    try {
      const result = await createArticulo(data);
      if (result.success) {
        setState({ errors: {}, message: 'Artículo creado correctamente' });
      } else {
        setState(result as any);
      }
    } catch (error) {
      if (error instanceof Error) {
        setState({ errors: (error as any).errors || {}, message: error.message }); // actualiza el estado del formulario y muestra los errores
      }
    }
  };

  return (
    // Formulario para crear un artículo
    <form onSubmit={formAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Articulo Código */}
        <div className="mb-4">
          <label htmlFor="codigo" className="mb-2 block text-sm font-medium">
            Código del artículo
          </label>
          <div className="relative">
            <input
              id="codigo"
              name="codigo"
              type="text"
              placeholder="Introduce el código del artículo"
              className="peer block w-full rounded-md border border-gray-200 py-1 pl-2 text-sm outline-2 placeholder:text-gray-400"
              aria-describedby="codigo-error"
            />
          </div>
          <div id="codigo-error" aria-live="polite" aria-atomic="true">
            {state.errors?.codigo &&
              state.errors.codigo.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Articulo Descripción */}
        <div className="mb-4">
          <label htmlFor="descripcion" className="mb-2 block text-sm font-medium">
            Descripción del artículo
          </label>
          <div className="relative">
            <input
              id="descripcion"
              name="descripcion"
              type="text"
              placeholder="Introduce la descripción del artículo"
              className="peer block w-full rounded-md border border-gray-200 py-1 pl-2 text-sm outline-2 placeholder:text-gray-400"
              aria-describedby="descripcion-error"
            />
          </div>
          <div id="descripcion-error" aria-live="polite" aria-atomic="true">
            {state.errors?.descripcion &&
              state.errors.descripcion.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Articulo Precio */}
        <div className="mb-4">
          <label htmlFor="precio" className="mb-2 block text-sm font-medium">
            Precio del artículo
          </label>
          <div className="relative">
            <input
              id="precio"
              name="precio"
              type="number"
              step="any"
              lang="en"
              placeholder="Introduce el precio del artículo"
              className="peer block w-full rounded-md border border-gray-200 py-1 pl-2 text-sm outline-2 placeholder:text-gray-400"
              aria-describedby="precio-error"
            />
          </div>
          <div id="precio-error" aria-live="polite" aria-atomic="true">
            {state.errors?.precio &&
              state.errors.precio.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Articulo IVA */}
        <div className="mb-4">
          <label htmlFor="iva" className="mb-2 block text-sm font-medium">
            IVA del artículo
          </label>
          <div className="relative">
            <input
              id="iva"
              name="iva"
              type="number"
              step="any"
              lang="en"
              placeholder="Introduce el IVA del artículo"
              className="peer block w-full rounded-md border border-gray-200 py-1 pl-2 text-sm outline-2 placeholder:text-gray-400"
              aria-describedby="iva-error"
            />
          </div>
          <div id="iva-error" aria-live="polite" aria-atomic="true">
            {state.errors?.iva &&
              state.errors.iva.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Articulo Stock */}
        <div className="mb-4">
          <label htmlFor="stock" className="mb-2 block text-sm font-medium">
            Stock del artículo
          </label>
          <div className="relative">
            <input
              id="stock"
              name="stock"
              type="number"
              step="any"
              lang="en"
              placeholder="Introduce el stock del artículo"
              className="peer block w-full rounded-md border border-gray-200 py-1 pl-2 text-sm outline-2 placeholder:text-gray-400"
              aria-describedby="stock-error"
            />
          </div>
          <div id="stock-error" aria-live="polite" aria-atomic="true">
            {state.errors?.stock &&
              state.errors.stock.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Articulo Imagen */}
        <div className="mb-4">
          <label htmlFor="imagen" className="mb-2 block text-sm font-medium">
            Imagen del artículo
          </label>
          <div className="relative">
            <input
              id="imagen"
              name="file"
              ref={inputFileRef} // referencia al input file para poder acceder a el
              type="file" // tipo de input file para poder subir archivos
              accept="image/jpeg, image/png, image/webp"
              //capture="environment" // solo sirve para moviles, obliga a usar la camara
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file && file.size > 3 * 1024 * 1024) {
                  setState({ errors: { ...state.errors, imagen: ['La imagen no puede pesar más de 3MB'] }, message: '' });
                  e.target.value = '';
                } else if (file) {
                  const nuevasOpciones = { ...state.errors };
                  delete nuevasOpciones.imagen;
                  setState({ errors: nuevasOpciones, message: '' });
                }
              }}
              className="peer block w-full rounded-md border border-gray-200 py-1 pl-2 text-sm outline-2 placeholder:text-gray-400"
              aria-describedby="imagen-error"
            />
          </div>
          <div id="imagen-error" aria-live="polite" aria-atomic="true">
            {state.errors?.imagen &&
              state.errors.imagen.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        <div aria-live="polite" aria-atomic="true">
          {state.message && (
            <div 
              className={`mt-4 p-4 text-sm rounded-md ${
                state.message === 'Artículo creado correctamente' 
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              <p>{state.message}</p>
            </div>
          )}
        </div>
      </div>
      <div className="mt-6 flex flex-wrap justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Volver
        </button>
        <Link
          href="/dashboard/articulos"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancelar
        </Link>
        <Button type="submit">Crear Artículo</Button>
      </div>
    </form>
  );
};

export default CreateArticulosForm;

