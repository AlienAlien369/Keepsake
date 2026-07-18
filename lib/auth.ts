import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, verifySessionToken, type SessionPayload } from "@/lib/session";

export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}

export async function requireAdminSession(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    redirect("/admin/login");
  }
  return session;
}

export async function requireUserSession(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session || session.role !== "user") {
    redirect("/login");
  }
  return session;
}
