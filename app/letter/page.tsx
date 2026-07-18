import { notFound } from "next/navigation";
import { eq, asc } from "drizzle-orm";
import { requireUserSession } from "@/lib/auth";
import { db } from "@/db/client";
import { users, threadMessages } from "@/db/schema";
import { LetterExperience } from "@/components/letter-experience";

export default async function LetterPage() {
  const session = await requireUserSession();

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.id),
    with: { threadMessages: { orderBy: asc(threadMessages.createdAt) } },
  });

  if (!user) notFound();

  return (
    <LetterExperience
      name={user.name}
      message={user.message}
      timeline={user.timeline}
      memories={user.memories}
      gratitude={user.gratitude}
      hasOpenedBefore={!!user.firstOpenedAt}
      hasFinishedBefore={!!user.finishedAt}
      threadMessages={user.threadMessages.map((m) => ({
        id: m.id,
        sender: m.sender,
        body: m.body,
        createdAt: m.createdAt.toISOString(),
      }))}
    />
  );
}
