"use client";

import { motion } from "framer-motion";
import type { TimelineEntry } from "@/lib/letter-types";

export function Timeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <div className="relative mx-auto max-w-md">
      <motion.div
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.4, ease: "easeInOut" }}
        style={{ transformOrigin: "top" }}
        className="absolute bottom-2 left-[15px] top-2 w-px bg-gradient-to-b from-gold via-aurora-violet to-aurora-teal opacity-70"
      />

      <ul className="flex flex-col gap-10">
        {entries.map((entry, i) => (
          <motion.li
            key={entry.title}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: i * 0.08 }}
            className="relative pl-10"
          >
            <motion.span
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 + 0.2 }}
              className="absolute left-0 top-1 flex h-8 w-8 items-center justify-center rounded-full glass-strong text-[11px] font-semibold text-gold-bright shadow-md"
            >
              {i + 1}
            </motion.span>
            <h4 className="font-display text-lg text-ink dark:text-paper">{entry.title}</h4>
            <p className="mt-1 text-sm text-ink-soft dark:text-paper/60">{entry.description}</p>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
