"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { users, threadMessages } from "@/db/schema";
import { requireAdminSession } from "@/lib/auth";
import type { ThreadFormState } from "@/lib/actions/letter-actions";

export async function postAdminReply(
  userId: string,
  _prev: ThreadFormState,
  formData: FormData
): Promise<ThreadFormState> {
  await requireAdminSession();
  const body = String(formData.get("body") ?? "").trim();

  if (!body) {
    return { error: "Write something before sending." };
  }

  const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
  if (!user) {
    return { error: "That employee no longer exists." };
  }

  await db.insert(threadMessages).values({ userId, sender: "ADMIN", body });

  revalidatePath(`/admin/users/${userId}`);
  return {};
}
