import Link from "next/link";
import { notFound } from "next/navigation";
import { eq, desc } from "drizzle-orm";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { AmbientBackground } from "@/components/ambient-background";
import { AdminNav } from "@/components/admin/admin-nav";
import { AddEmployeeForm } from "@/components/admin/add-employee-form";
import { requireAdminSession } from "@/lib/auth";
import { db } from "@/db/client";
import { companies, users } from "@/db/schema";

interface PageProps {
  params: Promise<{ companyId: string }>;
}

export default async function CompanyDetailPage({ params }: PageProps) {
  const session = await requireAdminSession();
  const { companyId } = await params;

  const company = await db.query.companies.findFirst({
    where: eq(companies.id, companyId),
    with: {
      users: {
        orderBy: desc(users.createdAt),
        with: { threadMessages: true },
      },
    },
  });

  if (!company) notFound();

  return (
    <main className="relative min-h-screen overflow-hidden bg-paper dark:bg-night">
      <AmbientBackground variant="aurora" />
      <AdminNav adminName={session.name} />

      <div className="relative z-10 mx-auto max-w-5xl px-6 pb-24 pt-12">
        <Link href="/admin" className="mb-6 inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink dark:text-paper/60 dark:hover:text-paper">
          <ArrowLeft className="h-4 w-4" /> All companies
        </Link>

        <h1 className="font-display text-3xl italic text-ink dark:text-paper">{company.name}</h1>
        <p className="mt-2 text-sm text-ink-soft dark:text-paper/60">
          {company.users.length} {company.users.length === 1 ? "employee" : "employees"}
        </p>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {company.users.map((user) => (
            <Link
              key={user.id}
              href={`/admin/users/${user.id}`}
              className="flex items-center justify-between rounded-2xl glass p-5 shadow-sm transition-shadow hover:shadow-lg"
            >
              <div>
                <p className="font-display text-lg text-ink dark:text-paper">{user.name}</p>
                <p className="text-xs uppercase tracking-wide text-gold-soft">{user.employeeId}</p>
                {user.team && <p className="mt-1 text-sm text-ink-soft dark:text-paper/60">{user.team}</p>}
              </div>
              <div className="flex items-center gap-1.5 rounded-full glass px-3 py-1.5 text-xs text-ink-soft dark:text-paper/60">
                <MessageCircle className="h-3.5 w-3.5" />
                {user.threadMessages.length}
              </div>
            </Link>
          ))}

          {company.users.length === 0 && (
            <p className="text-sm text-ink-soft dark:text-paper/50">
              No employees in this company yet — add the first one below.
            </p>
          )}
        </div>

        <div className="mt-12 rounded-3xl glass-strong p-6 sm:p-8">
          <h2 className="mb-6 font-display text-xl italic text-ink dark:text-paper">Add an employee</h2>
          <AddEmployeeForm companyId={company.id} />
        </div>
      </div>
    </main>
  );
}
