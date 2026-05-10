import { sql } from "@vercel/postgres";

async function main() {
  try {
    console.log("Iniciando migración para cumplimiento VeriFactu...");
    
    // 1. Crear tabla de logs de auditoría (Trazabilidad)
    await sql`
      CREATE TABLE IF NOT EXISTS audit_log (
        id SERIAL PRIMARY KEY,
        id_empresa INTEGER NOT NULL,
        user_id UUID,
        event_type VARCHAR(50) NOT NULL,
        resource_type VARCHAR(50) NOT NULL,
        resource_id UUID,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        payload JSONB,
        details TEXT
      );
    `;
    console.log("- Tabla 'audit_log' creada/verificada.");

    // 2. Añadir columna 'deleted_at' para borrado lógico (Soft Delete)
    await sql`ALTER TABLE invoices ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;`;
    console.log("- Columna 'deleted_at' añadida a 'invoices'.");

    // 3. Añadir columna 'version' a invoices para control de concurrerncia
    await sql`ALTER TABLE invoices ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1;`;
    console.log("- Columna 'version' añadida a 'invoices'.");

    console.log("Migración completada con éxito.");
  } catch (err) {
    console.error("Error durante la migración:", err);
  }
}

main();
