"use client";

import { useActionState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { AmbientBackground } from "@/components/ambient-background";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { loginAdmin, type FormState } from "@/lib/actions/auth-actions";

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState<FormState, FormData>(loginAdmin, {});

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-night px-4">
      <AmbientBackground variant="aurora" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 w-full max-w-sm rounded-3xl glass-strong p-8 shadow-2xl"
      >
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-aurora-violet/20">
            <ShieldCheck className="h-5 w-5 text-aurora-violet" />
          </div>
          <h1 className="font-display text-2xl italic text-paper">Admin sign in</h1>
          <p className="text-sm text-paper/60">Manage companies, employees, and letters.</p>
        </div>

        <form action={formAction} className="flex flex-col gap-4">
          <div>
            <Label htmlFor="email" className="text-paper/60">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoFocus
              required
              placeholder="you@company.com"
              className="border-white/10 bg-white/[0.04] text-ink placeholder:text-ink-soft/60 dark:text-paper dark:placeholder:text-paper/30"
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-paper/60">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="border-white/10 bg-white/[0.04] text-ink placeholder:text-ink-soft/60 dark:text-paper dark:placeholder:text-paper/30"
            />
          </div>

          {state.error && <p className="text-sm text-aurora-rose">{state.error}</p>}

          <Button type="submit" variant="glow" size="lg" disabled={pending} className="mt-2 w-full">
            {pending ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <Link
          href="/"
          className="mt-6 block text-center text-xs text-paper/40 underline-offset-4 hover:text-paper/70 hover:underline"
        >
          Back to the site
        </Link>
      </motion.div>
    </main>
  );
}
