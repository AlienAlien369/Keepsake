import Link from "next/link";
import { LogOut, Settings, ShieldCheck } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { logout } from "@/lib/actions/auth-actions";

export function AdminNav({ adminName }: { adminName: string }) {
  return (
    <header className="sticky top-0 z-40 flex justify-center px-4 pt-4">
      <nav className="flex w-full max-w-5xl items-center justify-between rounded-full glass px-4 py-2.5 shadow-lg shadow-black/5">
        <Link href="/admin" className="flex items-center gap-2 text-sm text-ink dark:text-paper">
          <ShieldCheck className="h-4 w-4 text-aurora-violet" />
          <span className="font-display italic">Keepsake Admin</span>
        </Link>

        <div className="flex items-center gap-3">
          <span className="hidden text-xs text-ink-soft dark:text-paper/50 sm:inline">{adminName}</span>
          <Link
            href="/admin/settings"
            aria-label="Admin settings"
            className="flex h-9 w-9 items-center justify-center rounded-full glass transition-transform hover:scale-105 active:scale-95"
          >
            <Settings className="h-4 w-4 text-ink-soft dark:text-paper/70" />
          </Link>
          <ThemeToggle />
          <form action={logout}>
            <button
              type="submit"
              aria-label="Sign out"
              className="flex h-9 w-9 items-center justify-center rounded-full glass transition-transform hover:scale-105 active:scale-95"
            >
              <LogOut className="h-4 w-4 text-ink-soft dark:text-paper/70" />
            </button>
          </form>
        </div>
      </nav>
    </header>
  );
}
