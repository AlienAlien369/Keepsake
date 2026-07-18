"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";

interface EnvelopeProps {
  name: string;
  isFirstVisit: boolean;
  opened: boolean;
  onOpen: () => void;
}

export function Envelope({ name, isFirstVisit, opened, onOpen }: EnvelopeProps) {
  return (
    <div className="relative flex flex-col items-center gap-8">
      {isFirstVisit && !opened && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="font-hand text-2xl text-gold-soft dark:text-gold-bright"
        >
          this one has your name on it
        </motion.p>
      )}

      <motion.button
        type="button"
        onClick={onOpen}
        disabled={opened}
        aria-label={`Open the letter for ${name}`}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        whileHover={opened ? undefined : { scale: 1.03, y: -4 }}
        whileTap={opened ? undefined : { scale: 0.98 }}
        className="group relative h-56 w-80 max-w-[85vw] cursor-pointer disabled:cursor-default"
        style={{ perspective: 1200 }}
      >
        {/* glow */}
        <motion.div
          className="absolute -inset-6 rounded-[2rem] blur-2xl"
          style={{ background: "radial-gradient(circle, rgba(201,162,39,0.35), transparent 70%)" }}
          animate={{ opacity: opened ? 0 : [0.5, 0.8, 0.5] }}
          transition={{ duration: 3, repeat: opened ? 0 : Infinity }}
        />

        {/* envelope body */}
        <div className="relative h-full w-full overflow-hidden rounded-2xl border border-gold/30 bg-gradient-to-b from-paper-dim to-paper shadow-2xl dark:from-night-card dark:to-night">
          {/* handwritten name across the front */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-hand text-4xl text-ink/70 dark:text-paper/80">{name}</span>
          </div>

          {/* envelope flap */}
          <motion.div
            className="absolute inset-x-0 top-0 h-1/2 origin-top bg-gradient-to-b from-gold-soft/40 to-transparent dark:from-gold/20"
            style={{
              clipPath: "polygon(0 0, 100% 0, 50% 85%)",
              transformStyle: "preserve-3d",
            }}
            animate={{ rotateX: opened ? -165 : 0 }}
            transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
          />

          {/* wax seal */}
          <motion.div
            className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gold shadow-lg"
            animate={{ scale: opened ? 0 : 1, opacity: opened ? 0 : 1 }}
            transition={{ duration: 0.4 }}
          >
            <Heart className="h-5 w-5 fill-paper text-paper animate-heartbeat" />
          </motion.div>
        </div>
      </motion.button>

      {!opened && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="text-xs uppercase tracking-[0.3em] text-ink-soft/60 dark:text-paper/40"
        >
          tap to open
        </motion.p>
      )}
    </div>
  );
}
