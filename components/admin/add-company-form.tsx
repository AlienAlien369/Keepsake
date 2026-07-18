"use client";

import { useActionState, useEffect, useRef } from "react";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createCompany } from "@/lib/actions/admin-actions";
import type { FormState } from "@/lib/actions/auth-actions";

export function AddCompanyForm() {
  const [state, formAction, pending] = useActionState<FormState, FormData>(createCompany, {});
  const formRef = useRef<HTMLFormElement>(null);
  const prevPending = useRef(pending);

  useEffect(() => {
    if (prevPending.current && !pending && !state.error) {
      formRef.current?.reset();
    }
    prevPending.current = pending;
  }, [pending, state.error]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-wrap items-end gap-3">
      <div className="flex-1 min-w-[180px]">
        <Input name="name" required placeholder="e.g. ACX" aria-label="Company name" />
      </div>
      <Button type="submit" variant="default" disabled={pending} className="gap-1.5">
        <Plus className="h-4 w-4" />
        {pending ? "Adding..." : "Add company"}
      </Button>
      {state.error && <p className="w-full text-sm text-aurora-rose">{state.error}</p>}
    </form>
  );
}
