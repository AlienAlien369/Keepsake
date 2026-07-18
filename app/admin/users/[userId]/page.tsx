import Link from "next/link";
import { notFound } from "next/navigation";
import { eq, asc } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import { AmbientBackground } from "@/components/ambient-background";
import { AdminNav } from "@/components/admin/admin-nav";
import { ConversationThread } from "@/components/conversation-thread";
import { requireAdminSession } from "@/lib/auth";
import { db } from "@/db/client";
import { users, threadMessages } from "@/db/schema";
import { postAdminReply } from "@/lib/actions/admin-thread-actions";

interface PageProps {
  params: Promise<{ userId: string }>;
}

export default async function AdminUserDetailPage({ params }: PageProps) {
  const session = await requireAdminSession();
  const { userId } = await params;

  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    with: {
      company: true,
      threadMessages: { orderBy: asc(threadMessages.createdAt) },
    },
  });

  if (!user) notFound();

  const paragraphs = user.message;
  const action = postAdminReply.bind(null, user.id);

  return (
    <main className="relative min-h-screen overflow-hidden bg-paper dark:bg-night">
      <AmbientBackground variant="aurora" />
      <AdminNav adminName={session.name} />

      <div className="relative z-10 mx-auto max-w-3xl px-6 pb-24 pt-12">
        <Link
          href={`/admin/companies/${user.companyId}`}
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink dark:text-paper/60 dark:hover:text-paper"
        >
          <ArrowLeft className="h-4 w-4" /> {user.company.name}
        </Link>

        <div className="mb-8 rounded-2xl glass p-6">
          <p className="text-xs uppercase tracking-wide text-gold-soft">{user.employeeId}</p>
          <h1 className="font-display text-2xl italic text-ink dark:text-paper">{user.name}</h1>
          {user.team && <p className="mt-1 text-sm text-ink-soft dark:text-paper/60">{user.team}</p>}
          <div className="mt-4 flex gap-4 text-xs text-ink-soft dark:text-paper/50">
            <span>{user.firstOpenedAt ? "Letter opened" : "Not opened yet"}</span>
            <span>{user.finishedAt ? "Kept as a memory" : "Still reading"}</span>
          </div>
        </div>

        <details className="mb-8 rounded-2xl glass p-6">
          <summary className="cursor-pointer font-display italic text-ink dark:text-paper">
            View the letter
          </summary>
          <div className="mt-4 flex flex-col gap-4">
            {paragraphs.map((p, i) => (
              <p key={i} className="text-sm leading-relaxed text-ink-soft dark:text-paper/70">
                {p}
              </p>
            ))}
          </div>
        </details>

        <h2 className="mb-4 font-display text-xl italic text-ink dark:text-paper">Conversation</h2>
        <ConversationThread
          messages={user.threadMessages.map((m) => ({
            id: m.id,
            sender: m.sender,
            body: m.body,
            createdAt: m.createdAt.toISOString(),
          }))}
          viewerRole="admin"
          action={action}
          placeholder={`Reply to ${user.name}...`}
          emptyLabel="No messages yet — they'll show up here once the employee writes back."
        />
      </div>
    </main>
  );
}
