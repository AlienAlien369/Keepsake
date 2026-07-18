"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { companies, admins, users } from "@/db/schema";
import { hashPassword } from "@/lib/password";
import { requireAdminSession } from "@/lib/auth";
import type { FormState } from "@/lib/actions/auth-actions";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createCompany(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdminSession();

  const name = String(formData.get("name") ?? "").trim();
  if (!name) {
    return { error: "Give the company a name." };
  }

  const slug = slugify(name);
  const existing = await db.query.companies.findFirst({ where: eq(companies.slug, slug) });
  if (existing) {
    return { error: "A company with that name already exists." };
  }

  await db.insert(companies).values({ name, slug });
  revalidatePath("/admin");
  return {};
}

export async function createAdmin(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdminSession();

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!name || !email || password.length < 8) {
    return { error: "Name, email, and a password of at least 8 characters are required." };
  }

  const existing = await db.query.admins.findFirst({ where: eq(admins.email, email) });
  if (existing) {
    return { error: "An admin with that email already exists." };
  }

  const { salt, hash } = hashPassword(password);
  await db.insert(admins).values({ name, email, passwordSalt: salt, passwordHash: hash });

  revalidatePath("/admin/settings");
  return {};
}

export async function createEmployee(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdminSession();

  const employeeId = String(formData.get("employeeId") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const team = String(formData.get("team") ?? "").trim();
  const quote = String(formData.get("quote") ?? "").trim();
  const photo = String(formData.get("photo") ?? "").trim();
  const companyId = String(formData.get("companyId") ?? "").trim();
  const messageRaw = String(formData.get("message") ?? "").trim();

  if (!employeeId || !name || !companyId || !messageRaw) {
    return { error: "Employee ID, name, company, and a message are required." };
  }

  const company = await db.query.companies.findFirst({ where: eq(companies.id, companyId) });
  if (!company) {
    return { error: "Pick a valid company." };
  }

  const existing = await db.query.users.findFirst({ where: eq(users.employeeId, employeeId) });
  if (existing) {
    return { error: "That employee ID is already in use." };
  }

  const message = messageRaw
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  const timeline = parseJsonArray(formData.get("timelineJson")) as { title: string; description: string }[];
  const memories = parseJsonArray(formData.get("memoriesJson")) as { src: string; caption: string }[];
  const gratitude = parseJsonArray(formData.get("gratitudeJson")) as string[];

  await db.insert(users).values({
    employeeId,
    name,
    team: team || null,
    quote: quote || null,
    photo: photo || null,
    companyId,
    message,
    timeline,
    memories,
    gratitude,
  });

  revalidatePath(`/admin/companies/${companyId}`);
  redirect(`/admin/companies/${companyId}`);
}

function parseJsonArray(value: FormDataEntryValue | null): unknown[] {
  if (typeof value !== "string" || !value.trim()) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
