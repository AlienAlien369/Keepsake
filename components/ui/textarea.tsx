import * as React from "react";
import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "w-full resize-y rounded-xl glass px-4 py-2.5 text-sm text-ink outline-none placeholder:text-ink-soft/50 dark:text-paper dark:placeholder:text-paper/30",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export { Textarea };
