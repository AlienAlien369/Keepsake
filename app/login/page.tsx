"use client";

import { useActionState } from "react";
import { motion } from "framer-motion";
import { KeyRound } from "lucide-react";
import { AmbientBackground } from "@/components/ambient-background";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { loginUser, type FormState } from "@/lib/actions/auth-actions";

export default function EmployeeLoginPage() {
  const [state, formAction, pending] = useActionState<FormState, FormData>(loginUser, {});

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
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/15">
            <KeyRound className="h-5 w-5 text-gold-bright" />
          </div>
          <h1 className="font-display text-2xl italic text-paper">Find your letter</h1>
          <p className="text-sm text-paper/60">Enter your employee ID to open it.</p>
        </div>

        <form action={formAction} className="flex flex-col gap-4">
          <div>
            <Label htmlFor="employeeId" className="text-paper/60">
              Employee ID
            </Label>
            <Input
              id="employeeId"
              name="employeeId"
              autoFocus
              required
              placeholder="e.g. ACX-1042"
              className="border-white/10 bg-white/[0.04] text-paper placeholder:text-paper/30"
            />
          </div>

          {state.error && <p className="text-sm text-aurora-rose">{state.error}</p>}

          <Button type="submit" variant="glow" size="lg" disabled={pending} className="mt-2 w-full">
            {pending ? "Opening..." : "Open my letter"}
          </Button>
        </form>
      </motion.div>
    </main>
  );
}
