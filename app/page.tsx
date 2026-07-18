"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Feather } from "lucide-react";
import { AmbientBackground } from "@/components/ambient-background";
import { TypewriterSequence } from "@/components/typewriter-sequence";
import { ThemeToggle } from "@/components/theme-toggle";

const INTRO_LINES = [
  "Every journey leaves behind memories.",
  "If you're here, there's probably something I wanted to tell you.",
];

export default function LandingPage() {
  const [showButton, setShowButton] = useState(false);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-paper dark:bg-night">
      <AmbientBackground variant="aurora" />

      <div className="absolute right-5 top-5 z-20">
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.6, ease: "easeOut" }}
        className="relative z-10 flex w-full max-w-2xl flex-col items-center gap-10 px-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="flex h-16 w-16 items-center justify-center rounded-full glass"
        >
          <Feather className="h-6 w-6 text-gold-bright" />
        </motion.div>

        <TypewriterSequence lines={INTRO_LINES} onDone={() => setShowButton(true)} />

        {showButton && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            <Link href="/login" className="group relative inline-flex items-center gap-2 rounded-full px-8 py-3.5">
              <span className="absolute inset-0 rounded-full bg-gradient-to-r from-aurora-violet via-gold to-aurora-teal opacity-70 blur-md transition-opacity duration-500 group-hover:opacity-100" />
              <span className="relative flex items-center gap-2 rounded-full glass-strong px-8 py-3.5 font-display text-base italic text-paper shadow-lg transition-transform duration-300 group-hover:scale-[1.03] group-active:scale-95">
                Open My Letters
              </span>
            </Link>
          </motion.div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 2.5, duration: 1.5 }}
        className="absolute bottom-6 z-10 flex flex-col items-center gap-2 text-xs uppercase tracking-[0.3em] text-paper/40"
      >
        <span>written with care</span>
        <Link href="/admin/login" className="tracking-normal normal-case text-paper/30 underline-offset-4 hover:text-paper/60 hover:underline">
          Admin sign in
        </Link>
      </motion.div>
    </main>
  );
}
