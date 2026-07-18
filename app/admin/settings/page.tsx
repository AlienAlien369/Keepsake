import { asc } from "drizzle-orm";
import { AmbientBackground } from "@/components/ambient-background";
import { AdminNav } from "@/components/admin/admin-nav";
import { AddAdminForm } from "@/components/admin/add-admin-form";
import { requireAdminSession } from "@/lib/auth";
import { db } from "@/db/client";
import { admins } from "@/db/schema";

export default async function AdminSettingsPage() {
  const session = await requireAdminSession();
  const adminRows = await db.query.admins.findMany({ orderBy: asc(admins.createdAt) });

  return (
    <main className="relative min-h-screen overflow-hidden bg-paper dark:bg-night">
      <AmbientBackground variant="aurora" />
      <AdminNav adminName={session.name} />

      <div className="relative z-10 mx-auto max-w-3xl px-6 pb-24 pt-12">
        <h1 className="font-display text-3xl italic text-ink dark:text-paper">Admin accounts</h1>
        <p className="mt-2 mb-8 text-sm text-ink-soft dark:text-paper/60">
          Anyone with an admin account can manage companies, employees, and letters.
        </p>

        <div className="mb-10 flex flex-col gap-2">
          {adminRows.map((admin) => (
            <div key={admin.id} className="flex items-center justify-between rounded-2xl glass px-5 py-3">
              <div>
                <p className="text-sm text-ink dark:text-paper">{admin.name}</p>
                <p className="text-xs text-ink-soft dark:text-paper/50">{admin.email}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-3xl glass-strong p-6 sm:p-8">
          <h2 className="mb-6 font-display text-xl italic text-ink dark:text-paper">Add an admin</h2>
          <AddAdminForm />
        </div>
      </div>
    </main>
  );
}
