'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateArticulo, deleteArticuloImage } from '@/app/lib/actions';
import { ArticulosTableType } from '@/app/lib/definitions';
import { Button } from '@/app/ui/button';
import Link from 'next/link';
import Image from 'next/image';

interface EditFormProps {
  articulo: ArticulosTableType;
}

const EditArticulosForm: React.FC<EditFormProps> = ({ articulo }) => {
  const [state, setState] = useState<{ errors: { codigo?: string[]; descripcion?: string[]; precio?: string[]; iva?: string[]; stock?: string[]; imagen?: string[] }, message: string }>({ errors: {}, message: '' });
  const [images, setImages] = useState(articulo.imagen);
  const router = useRouter();

  const formAction = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const fileInput = formData.get('imagen') as File;

    let imageUrl = '';
    if (fileInput && fileInput.name) {
      // Aquí va la ruta local
      const filePath = `/articulos/${fileInput.name}`;
      imageUrl = filePath;

      // Aquí puede ir la lógica para guardar el archivo en el servidor
    }

    const newImage = imageUrl ? { id: (images?.length || 0) + 1, ruta: imageUrl } : null;
    const updatedImages = newImage ? [...(images || []), newImage] : images || [];

    const data = {
      codigo: formData.get('codigo') as string,
      descripcion: formData.get('descripcion') as string,
      precio: parseFloat(formData.get('precio') as string),
      iva: parseFloat(formData.get('iva') as string),
      stock: parseFloat(formData.get('stock') as string),
      imagen: updatedImages
    };

    try {
      await updateArticulo(articulo.id, data);
      router.push('/dashboard/articulos');
    } catch (error) {
      if (error instanceof Error) {
        setState({ errors: (error as any).errors || {}, message: error.message });
      }
    }
  };

  const handleDeleteImage = async (imageId: number, index: number) => {
    try {
      await deleteArticuloImage(Number(articulo.id), imageId);
      // Actualiza el estado para reflejar la eliminación de la imagen
      const updatedImages = images ? images.filter((_, i) => i !== index) : [];
      setImages(updatedImages);
    } catch (error) {
      console.error('Error al eliminar la imagen del artículo:', error);
    }
  };

  return (
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
              defaultValue={articulo.codigo}
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
              defaultValue={articulo.descripcion}
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
              step="0.01"
              defaultValue={articulo.precio.toString()}
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
              step="0.01"
              defaultValue={articulo.iva.toString()}
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
              step="0.01"
              defaultValue={articulo.stock.toString()}
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

        {/* Articulo Imagenes */}
        {images && images.length > 0 && (
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium">Imágenes del artículo</label>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
              {images.map((img, index) => (
                <div key={index} className="relative w-full h-32 flex">
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(img.id, index)}
                    className="absolute top-1 right-1 z-10 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                  >
                    ×
                  </button>
                  <Image
                    src={img.ruta.startsWith('/') ? img.ruta : `/${img.ruta}`}
                    alt={`Imagen ${index + 1}`}
                    layout="fill"
                    objectFit="contain"
                    className="rounded-md object-center md:object-left"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Articulo Imagen */}
        <div className="mb-4">
          <label htmlFor="imagen" className="mb-2 block text-sm font-medium">
            Imagen del artículo
          </label>
          <div className="relative">
            <input
              id="imagen"
              name="imagen"
              type="file"
              placeholder="Introduce la imagen del artículo"
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
          {state.message ? (
            <p className="mt-2 text-sm text-red-500">{state.message}</p>
          ) : null}
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/articulos"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancelar
        </Link>
        <Button type="submit">Actualizar Artículo</Button>
      </div>
    </form>
  );
};

export default EditArticulosForm;