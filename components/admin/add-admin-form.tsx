"use client";

import { useActionState, useEffect, useRef } from "react";
import { UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { createAdmin } from "@/lib/actions/admin-actions";
import type { FormState } from "@/lib/actions/auth-actions";

export function AddAdminForm() {
  const [state, formAction, pending] = useActionState<FormState, FormData>(createAdmin, {});
  const formRef = useRef<HTMLFormElement>(null);
  const prevPending = useRef(pending);

  useEffect(() => {
    if (prevPending.current && !pending && !state.error) {
      formRef.current?.reset();
    }
    prevPending.current = pending;
  }, [pending, state.error]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="admin-name">Name</Label>
          <Input id="admin-name" name="name" required placeholder="e.g. Aditi Rao" />
        </div>
        <div>
          <Label htmlFor="admin-email">Email</Label>
          <Input id="admin-email" name="email" type="email" required placeholder="you@company.com" />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="admin-password">Password (min. 8 characters)</Label>
          <Input id="admin-password" name="password" type="password" required minLength={8} placeholder="••••••••" />
        </div>
      </div>
      {state.error && <p className="text-sm text-aurora-rose">{state.error}</p>}
      <Button type="submit" variant="default" disabled={pending} className="gap-1.5 self-start">
        <UserPlus className="h-4 w-4" />
        {pending ? "Adding..." : "Add admin"}
      </Button>
    </form>
  );
}
