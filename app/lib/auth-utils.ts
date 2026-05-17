import { auth } from "@/auth";
import { redirect } from "next/navigation";
import type { Session } from "next-auth";

export async function requireSession(): Promise<Session> {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  return session;
}

export async function requireAdmin(): Promise<Session> {
  const session = await requireSession();
  if (session.user.type !== "admin") {
    throw new Error("No autorizado.");
  }
  return session;
}

export async function requireEmpresaId(): Promise<number> {
  const session = await requireSession();
  const idEmpresa = session.user.id_empresa;
  if (!idEmpresa) {
    redirect("/dashboard/empresas/create");
  }
  return Number(idEmpresa);
}
