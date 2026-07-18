import Link from "next/link";
import { asc } from "drizzle-orm";
import { Building2, Users } from "lucide-react";
import { AmbientBackground } from "@/components/ambient-background";
import { AdminNav } from "@/components/admin/admin-nav";
import { AddCompanyForm } from "@/components/admin/add-company-form";
import { requireAdminSession } from "@/lib/auth";
import { db } from "@/db/client";
import { companies } from "@/db/schema";

export default async function AdminDashboardPage() {
  const session = await requireAdminSession();

  const companyRows = await db.query.companies.findMany({
    orderBy: asc(companies.createdAt),
    with: { users: true },
  });

  return (
    <main className="relative min-h-screen overflow-hidden bg-paper dark:bg-night">
      <AmbientBackground variant="aurora" />
      <AdminNav adminName={session.name} />

      <div className="relative z-10 mx-auto max-w-5xl px-6 pb-24 pt-12">
        <div className="mb-10">
          <h1 className="font-display text-3xl italic text-ink dark:text-paper">Companies</h1>
          <p className="mt-2 text-sm text-ink-soft dark:text-paper/60">
            Every employee belongs to one of these. Add as many companies as you need.
          </p>
        </div>

        <div className="mb-10 rounded-2xl glass p-5">
          <AddCompanyForm />
        </div>

        {companyRows.length === 0 ? (
          <p className="text-sm text-ink-soft dark:text-paper/50">No companies yet — add one above.</p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {companyRows.map((company) => (
              <Link
                key={company.id}
                href={`/admin/companies/${company.id}`}
                className="group rounded-2xl glass p-6 shadow-md transition-shadow hover:shadow-xl hover:shadow-gold/10"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/15">
                  <Building2 className="h-5 w-5 text-gold-bright" />
                </div>
                <h2 className="mt-4 font-display text-xl text-ink dark:text-paper">{company.name}</h2>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-soft dark:text-paper/60">
                  <Users className="h-3.5 w-3.5" />
                  {company.users.length} {company.users.length === 1 ? "employee" : "employees"}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
