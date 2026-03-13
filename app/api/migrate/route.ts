import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { readFile } from "fs/promises";
import { join } from "path";

export async function GET() {
  try {
    const res = await sql`SELECT id, imagen FROM articulos`;
    const articulos = res.rows;
    let actualizados = 0;
    const detalles = [];

    for (const art of articulos) {
      if (art.imagen && Array.isArray(art.imagen)) {
        let cambiado = false;
        const nuevasImagenes = [];

        for (const img of art.imagen) {
          // Si la imagen todavía tiene la ruta antigua (empieza por /articulos/) o es del blob privado antiguo (jehkelnc30cijhd5)
          if (img.ruta.startsWith('/articulos/') || img.ruta.includes('jehkelnc30cijhd5.private')) {
            // Extraemos solo el nombre real del archivo
            const fileName = img.ruta.includes('jehkelnc30cijhd5.private') 
              ? img.ruta.split('/').pop() 
              : img.ruta.replace('/articulos/', '');
              
            const filePath = join(process.cwd(), 'public', 'articulos', fileName as string);
            
            try {
              // Leemos la imagen del disco duro original
              const fileBuffer = await readFile(filePath);
              
              // La subimos al nuevo Vercel Blob público
              const blob = await put(fileName as string, fileBuffer, {
                access: 'public',
                addRandomSuffix: false // Conservamos el mismo nombre para no crear duplicados en la URL
              });
              
              // Actualizamos el objeto imagen con la nueva URL oficial de Blob (tqqqihkzj4uwev0c.public)
              nuevasImagenes.push({ ...img, ruta: blob.url });
              cambiado = true;
              detalles.push(`Subido al Blob Público con éxito: ${fileName} -> ${blob.url}`);
            } catch (err) {
              console.error("Error al migrar archivo al nuevo Blob", fileName, err);
              // Si no la encontramos en disco, conservamos la que tenía para no perderla
              nuevasImagenes.push(img); 
              detalles.push(`Error subiendo la foto local: ${fileName}`);
            }
          } else {
            // Si ya es una URL de internet, lo dejamos intacto
            nuevasImagenes.push(img);
          }
        }

        // Si alguna imagen de este artículo se actualizó, guardamos el cambio en PostgreSQL
        if (cambiado) {
          await sql`UPDATE articulos SET imagen = ${JSON.stringify(nuevasImagenes)} WHERE id = ${art.id}`;
          actualizados++;
        }
      }
    }
    
    return NextResponse.json({ 
      mensaje: "¡Migración de imágenes completada!", 
      articulos_actualizados: actualizados,
      log_detallado: detalles
    });

  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
