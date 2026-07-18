import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "w-full rounded-xl glass px-4 py-2.5 text-sm text-ink outline-none placeholder:text-ink-soft/50 dark:text-paper dark:placeholder:text-paper/30",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";

export { Input };
