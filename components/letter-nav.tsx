"use client";

import { motion } from "framer-motion";
import { LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { MusicToggle } from "@/components/music-toggle";
import { logout } from "@/lib/actions/auth-actions";

export function LetterNav() {
  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed inset-x-0 top-0 z-40 flex justify-center px-4 pt-4"
    >
      <nav className="flex w-full max-w-3xl items-center justify-between rounded-full glass px-3 py-2 shadow-lg shadow-black/5">
        <span className="px-3 text-sm font-display italic text-ink-soft dark:text-paper/70">Keepsake</span>

        <div className="flex items-center gap-2">
          <MusicToggle />
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
    </motion.header>
  );
}
