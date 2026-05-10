import { sql } from '@vercel/postgres';

export async function saveAuditLog({
  id_empresa,
  user_id,
  event_type,
  resource_type,
  resource_id,
  payload,
  details
}: {
  id_empresa: number | string | undefined;
  user_id: string | undefined;
  event_type: string;
  resource_type: string;
  resource_id?: string;
  payload?: any;
  details?: string;
}) {
  try {
    await sql`
      INSERT INTO audit_log (id_empresa, user_id, event_type, resource_type, resource_id, payload, details)
      VALUES (${id_empresa}, ${user_id}, ${event_type}, ${resource_type}, ${resource_id}, ${JSON.stringify(payload)}, ${details})
    `;
  } catch (error) {
    console.error("Error al guardar el log de auditoría:", error);
  }
}
