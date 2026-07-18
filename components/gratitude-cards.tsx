"use client";

import { motion } from "framer-motion";

export function GratitudeCards({ notes }: { notes: string[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
      {notes.map((note, i) => (
        <motion.div
          key={note}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: i * 0.12 }}
          className="animate-float-slow rounded-2xl glass p-6 text-center shadow-md"
          style={{ animationDelay: `${i * 0.6}s` }}
        >
          <p className="font-display italic text-ink dark:text-paper">&ldquo;{note}&rdquo;</p>
        </motion.div>
      ))}
    </div>
  );
}
