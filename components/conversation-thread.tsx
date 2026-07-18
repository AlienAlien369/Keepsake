"use client";

import { useActionState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ThreadFormState } from "@/lib/actions/letter-actions";

export interface ThreadMessageView {
  id: string;
  sender: "ADMIN" | "USER";
  body: string;
  createdAt: string;
}

interface ConversationThreadProps {
  messages: ThreadMessageView[];
  viewerRole: "admin" | "user";
  action: (prevState: ThreadFormState, formData: FormData) => Promise<ThreadFormState>;
  placeholder?: string;
  emptyLabel?: string;
}

export function ConversationThread({
  messages,
  viewerRole,
  action,
  placeholder = "Write a reply...",
  emptyLabel = "No messages yet.",
}: ConversationThreadProps) {
  const [state, formAction, pending] = useActionState<ThreadFormState, FormData>(action, {});
  const formRef = useRef<HTMLFormElement>(null);
  const listEndRef = useRef<HTMLDivElement>(null);
  const prevPending = useRef(pending);

  useEffect(() => {
    if (prevPending.current && !pending && !state.error) {
      formRef.current?.reset();
    }
    prevPending.current = pending;
  }, [pending, state.error]);

  useEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex max-h-[420px] flex-col gap-3 overflow-y-auto rounded-2xl glass p-4 sm:p-5">
        {messages.length === 0 && (
          <p className="py-6 text-center text-sm text-ink-soft dark:text-paper/50">{emptyLabel}</p>
        )}

        {messages.map((message) => {
          const isOwn = message.sender.toLowerCase() === viewerRole;
          return (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                  isOwn
                    ? "bg-gradient-to-br from-gold-soft/40 to-gold/30 text-ink dark:text-paper"
                    : "glass-strong text-ink dark:text-paper"
                }`}
              >
                <p className="whitespace-pre-wrap leading-relaxed">{message.body}</p>
                <p className="mt-1 text-[10px] uppercase tracking-wide text-ink-soft/60 dark:text-paper/40">
                  {message.sender === "ADMIN" ? "Sent from Keepsake" : "You"} ·{" "}
                  {new Date(message.createdAt).toLocaleString(undefined, {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </motion.div>
          );
        })}
        <div ref={listEndRef} />
      </div>

      <form ref={formRef} action={formAction} className="flex items-end gap-2">
        <textarea
          name="body"
          required
          rows={2}
          placeholder={placeholder}
          className="w-full resize-none rounded-2xl glass px-4 py-3 text-sm text-ink outline-none placeholder:text-ink-soft/50 dark:text-paper dark:placeholder:text-paper/30"
        />
        <Button type="submit" variant="glow" size="icon" disabled={pending} aria-label="Send message">
          <Send className="h-4 w-4" />
        </Button>
      </form>
      {state.error && <p className="text-sm text-aurora-rose">{state.error}</p>}
    </div>
  );
}
