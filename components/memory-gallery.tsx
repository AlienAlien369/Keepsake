"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import type { Memory } from "@/lib/letter-types";

const ROTATIONS = [-4, 3, -2, 5, -5, 2];

export function MemoryGallery({ memories }: { memories: Memory[] }) {
  const [active, setActive] = useState<number | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
        {memories.map((memory, i) => (
          <motion.button
            key={memory.src}
            type="button"
            onClick={() => setActive(i)}
            initial={{ opacity: 0, y: 24, rotate: 0 }}
            whileInView={{ opacity: 1, y: 0, rotate: ROTATIONS[i % ROTATIONS.length] }}
            viewport={{ once: true, margin: "-60px" }}
            whileHover={{ rotate: 0, scale: 1.05, zIndex: 10 }}
            transition={{ duration: 0.6, delay: i * 0.07 }}
            className="group relative aspect-[4/5] overflow-hidden rounded-xl border-4 border-white shadow-lg dark:border-white/10"
          >
            <Image
              src={memory.src}
              alt={memory.caption}
              fill
              sizes="(min-width: 640px) 22vw, 45vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              unoptimized
            />
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-2 py-2 text-left text-[11px] text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              {memory.caption}
            </span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {active !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/85 p-6 backdrop-blur-sm"
            onClick={() => setActive(null)}
          >
            <button
              type="button"
              onClick={() => setActive(null)}
              aria-label="Close image"
              className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full glass"
            >
              <X className="h-5 w-5 text-white" />
            </button>
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="relative aspect-[4/5] w-full max-w-lg overflow-hidden rounded-2xl shadow-2xl"
            >
              <Image
                src={memories[active].src}
                alt={memories[active].caption}
                fill
                sizes="90vw"
                className="object-cover"
                unoptimized
              />
              <p className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-sm text-white">
                {memories[active].caption}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
