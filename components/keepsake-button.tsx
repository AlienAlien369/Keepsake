"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Heart, HeartHandshake, ChevronDown } from "lucide-react";

interface KeepsakeButtonProps {
  stage: "reading" | "ready" | "kept";
  onKeep: () => void;
}

export function KeepsakeButton({ stage, onKeep }: KeepsakeButtonProps) {
  return (
    <div className="fixed inset-x-0 bottom-6 z-40 flex justify-center px-4">
      <AnimatePresence mode="wait">
        {stage === "reading" && (
          <motion.div
            key="reading"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-1.5 rounded-full glass px-4 py-2 text-xs text-ink-soft dark:text-paper/50"
          >
            keep reading
            <ChevronDown className="h-3.5 w-3.5 animate-bounce" />
          </motion.div>
        )}

        {stage === "ready" && (
          <motion.button
            key="ready"
            type="button"
            onClick={onKeep}
            initial={{ opacity: 0, y: 16, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="group relative flex items-center gap-2 rounded-full px-6 py-3"
          >
            <span className="absolute inset-0 rounded-full bg-gradient-to-r from-gold via-aurora-rose to-aurora-violet opacity-70 blur-md transition-opacity group-hover:opacity-100" />
            <span className="relative flex items-center gap-2 rounded-full glass-strong px-6 py-3 font-display text-sm italic text-ink shadow-lg dark:text-paper">
              <Heart className="h-4 w-4 text-gold-bright" />
              Keep this memory
            </span>
          </motion.button>
        )}

        {stage === "kept" && (
          <motion.div
            key="kept"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 rounded-full glass-strong px-6 py-3 font-display text-sm italic text-ink dark:text-paper"
          >
            <HeartHandshake className="h-4 w-4 text-aurora-teal" />
            Kept, always
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
