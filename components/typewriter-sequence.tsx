"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TypewriterSequenceProps {
  lines: string[];
  typeSpeed?: number;
  pauseAfter?: number;
  onDone?: () => void;
  className?: string;
}

/**
 * Types out each line character by character, pauses, fades it out,
 * then moves to the next line. Calls onDone once the sequence finishes.
 */
export function TypewriterSequence({
  lines,
  typeSpeed = 60,
  pauseAfter = 1000,
  onDone,
  className = "",
}: TypewriterSequenceProps) {
  const [lineIndex, setLineIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [phase, setPhase] = useState<"typing" | "holding" | "leaving">(
    "typing",
  );

  useEffect(() => {
    if (lineIndex >= lines.length) return;
    const target = lines[lineIndex];

    if (phase === "typing") {
      if (displayed.length < target.length) {
        const t = setTimeout(() => {
          setDisplayed(target.slice(0, displayed.length + 1));
        }, typeSpeed);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setPhase("holding"), pauseAfter);
      return () => clearTimeout(t);
    }

    if (phase === "holding") {
      const t = setTimeout(() => setPhase("leaving"), 600);
      return () => clearTimeout(t);
    }

    if (phase === "leaving") {
      const t = setTimeout(() => {
        if (lineIndex + 1 >= lines.length) {
          onDone?.();
        } else {
          setLineIndex((i) => i + 1);
          setDisplayed("");
          setPhase("typing");
        }
      }, 500);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayed, phase, lineIndex]);

  return (
    <div
      className={`relative flex min-h-[8rem] items-center justify-center px-6 text-center ${className}`}
    >
      <AnimatePresence mode="wait">
        <motion.p
          key={lineIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: phase === "leaving" ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="font-display text-2xl italic leading-relaxed text-ink dark:text-paper sm:text-3xl md:text-4xl"
        >
          {displayed}
          <span
            className="ml-0.5 inline-block w-[2px] animate-pulse bg-gold align-middle"
            style={{ height: "1em" }}
          />
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
