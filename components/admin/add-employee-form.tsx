"use client";

import { useActionState, useState, type ReactNode } from "react";
import { Plus, Trash2, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { createEmployee } from "@/lib/actions/admin-actions";
import type { FormState } from "@/lib/actions/auth-actions";
import type { TimelineEntry, Memory } from "@/lib/letter-types";

export function AddEmployeeForm({ companyId }: { companyId: string }) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(createEmployee, {});
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [gratitude, setGratitude] = useState<string[]>([]);

  return (
    <form action={formAction} className="flex flex-col gap-8">
      <input type="hidden" name="companyId" value={companyId} />
      <input type="hidden" name="timelineJson" value={JSON.stringify(timeline.filter((t) => t.title && t.description))} />
      <input type="hidden" name="memoriesJson" value={JSON.stringify(memories.filter((m) => m.src && m.caption))} />
      <input type="hidden" name="gratitudeJson" value={JSON.stringify(gratitude.filter(Boolean))} />

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="employeeId">Employee ID</Label>
          <Input id="employeeId" name="employeeId" required placeholder="e.g. ACX-1042" />
        </div>
        <div>
          <Label htmlFor="name">Full name</Label>
          <Input id="name" name="name" required placeholder="e.g. Priya Verma" />
        </div>
        <div>
          <Label htmlFor="team">Team</Label>
          <Input id="team" name="team" placeholder="e.g. Product Design" />
        </div>
        <div>
          <Label htmlFor="photo">Photo URL (optional)</Label>
          <Input id="photo" name="photo" placeholder="https://..." />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="quote">Short quote (shown on their card)</Label>
          <Input id="quote" name="quote" placeholder="e.g. Made every rough idea feel possible." />
        </div>
      </section>

      <section>
        <Label htmlFor="message">Letter — one paragraph per block, separated by a blank line</Label>
        <Textarea id="message" name="message" required rows={8} placeholder={"First paragraph...\n\nSecond paragraph..."} />
      </section>

      <ListEditor
        title="Timeline"
        addLabel="Add step"
        items={timeline}
        onChange={setTimeline}
        makeEmpty={() => ({ title: "", description: "" })}
        renderRow={(item, update) => (
          <>
            <Input placeholder="Title, e.g. First Meeting" value={item.title} onChange={(e) => update({ ...item, title: e.target.value })} />
            <Input placeholder="Description" value={item.description} onChange={(e) => update({ ...item, description: e.target.value })} />
          </>
        )}
      />

      <ListEditor
        title="Memories"
        addLabel="Add photo"
        items={memories}
        onChange={setMemories}
        makeEmpty={() => ({ src: "", caption: "" })}
        renderRow={(item, update) => (
          <>
            <Input placeholder="Image URL" value={item.src} onChange={(e) => update({ ...item, src: e.target.value })} />
            <Input placeholder="Caption" value={item.caption} onChange={(e) => update({ ...item, caption: e.target.value })} />
          </>
        )}
      />

      <div>
        <div className="mb-2 flex items-center justify-between">
          <Label className="mb-0">Gratitude notes</Label>
          <button
            type="button"
            onClick={() => setGratitude((g) => [...g, ""])}
            className="flex items-center gap-1 text-xs text-gold-soft hover:text-gold"
          >
            <Plus className="h-3.5 w-3.5" /> Add note
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {gratitude.map((note, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input
                value={note}
                placeholder="Thank you for..."
                onChange={(e) =>
                  setGratitude((g) => g.map((n, idx) => (idx === i ? e.target.value : n)))
                }
              />
              <button
                type="button"
                onClick={() => setGratitude((g) => g.filter((_, idx) => idx !== i))}
                aria-label="Remove note"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink-soft hover:text-aurora-rose"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {state.error && <p className="text-sm text-aurora-rose">{state.error}</p>}

      <Button type="submit" variant="glow" size="lg" disabled={pending} className="gap-2 self-start">
        <UserPlus className="h-4 w-4" />
        {pending ? "Adding employee..." : "Add employee"}
      </Button>
    </form>
  );
}

interface ListEditorProps<T> {
  title: string;
  addLabel: string;
  items: T[];
  onChange: (items: T[]) => void;
  makeEmpty: () => T;
  renderRow: (item: T, update: (next: T) => void) => ReactNode;
}

function ListEditor<T>({ title, addLabel, items, onChange, makeEmpty, renderRow }: ListEditorProps<T>) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <Label className="mb-0">{title}</Label>
        <button
          type="button"
          onClick={() => onChange([...items, makeEmpty()])}
          className="flex items-center gap-1 text-xs text-gold-soft hover:text-gold"
        >
          <Plus className="h-3.5 w-3.5" /> {addLabel}
        </button>
      </div>
      <div className="flex flex-col gap-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-2">
              {renderRow(item, (next) => onChange(items.map((it, idx) => (idx === i ? next : it))))}
            </div>
            <button
              type="button"
              onClick={() => onChange(items.filter((_, idx) => idx !== i))}
              aria-label="Remove row"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink-soft hover:text-aurora-rose"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-xs text-ink-soft/60 dark:text-paper/30">Optional — add a few if you&apos;d like.</p>
        )}
      </div>
    </div>
  );
}
