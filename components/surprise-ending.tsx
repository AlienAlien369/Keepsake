"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { AmbientBackground } from "@/components/ambient-background";
import { WordReveal } from "@/components/word-reveal";

const CLOSING_LINES = [
  "Some people become memories.",
  "Some become family.",
  "Thank you for being part of my journey.",
];

export function SurpriseEnding({ onSeen }: { onSeen?: () => void }) {
  return (
    <motion.section
      onViewportEnter={() => onSeen?.()}
      viewport={{ once: true, amount: 0.6 }}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-night px-6 py-32 text-center"
    >
      <AmbientBackground variant="stars" />

      <div className="relative z-10 flex flex-col items-center gap-8">
        {CLOSING_LINES.map((line, i) => (
          <WordReveal
            key={line}
            text={line}
            delay={i * 0.15}
            className="font-display text-2xl italic text-paper sm:text-3xl"
          />
        ))}

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.6, duration: 1 }}
          className="mt-6 flex flex-col items-center gap-3"
        >
          <Heart className="h-6 w-6 fill-gold text-gold animate-heartbeat" />
          <span className="font-hand text-4xl text-gradient-gold shimmer-gold sm:text-5xl">
            — Lakshya
          </span>
        </motion.div>
      </div>
    </motion.section>
  );
}
