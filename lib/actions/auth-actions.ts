"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { admins, users } from "@/db/schema";
import { verifyPassword } from "@/lib/password";
import { createSessionToken, SESSION_COOKIE, SESSION_MAX_AGE_SECONDS } from "@/lib/session";

export interface FormState {
  error?: string;
}

export async function loginAdmin(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  const admin = await db.query.admins.findFirst({ where: eq(admins.email, email) });
  if (!admin || !verifyPassword(password, admin.passwordSalt, admin.passwordHash)) {
    return { error: "That email or password isn't right." };
  }

  const token = await createSessionToken({
    role: "admin",
    id: admin.id,
    name: admin.name,
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS,
  });

  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });

  redirect("/admin");
}

export async function loginUser(_prev: FormState, formData: FormData): Promise<FormState> {
  const employeeId = String(formData.get("employeeId") ?? "").trim();

  if (!employeeId) {
    return { error: "Enter your employee ID." };
  }

  const user = await db.query.users.findFirst({ where: eq(users.employeeId, employeeId) });
  if (!user) {
    return { error: "We couldn't find a letter for that employee ID." };
  }

  const token = await createSessionToken({
    role: "user",
    id: user.id,
    name: user.name,
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS,
  });

  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });

  redirect("/letter");
}

export async function logout(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  redirect("/");
}
