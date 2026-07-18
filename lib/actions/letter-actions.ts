"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { users, threadMessages } from "@/db/schema";
import { requireUserSession } from "@/lib/auth";
import { notifyNewReply } from "@/lib/email";

export async function markLetterOpened(): Promise<void> {
  const session = await requireUserSession();
  const user = await db.query.users.findFirst({ where: eq(users.id, session.id) });
  // Only set firstOpenedAt the first time — re-opening later shouldn't reset it.
  if (user && !user.firstOpenedAt) {
    await db.update(users).set({ firstOpenedAt: new Date() }).where(eq(users.id, session.id));
  }
  revalidatePath("/letter");
}

export async function markLetterFinished(): Promise<void> {
  const session = await requireUserSession();
  await db.update(users).set({ finishedAt: new Date() }).where(eq(users.id, session.id));
  revalidatePath("/letter");
}

export interface ThreadFormState {
  error?: string;
}

export async function postUserReply(_prev: ThreadFormState, formData: FormData): Promise<ThreadFormState> {
  const session = await requireUserSession();
  const body = String(formData.get("body") ?? "").trim();

  if (!body) {
    return { error: "Write something before sending." };
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.id),
    with: { company: true },
  });
  if (!user) {
    return { error: "We couldn't find your letter." };
  }

  await db.insert(threadMessages).values({ userId: user.id, sender: "USER", body });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  await notifyNewReply({
    employeeName: user.name,
    employeeId: user.employeeId,
    companyName: user.company.name,
    message: body,
    adminUrl: `${siteUrl}/admin/users/${user.id}`,
  });

  revalidatePath("/letter");
  return {};
}
