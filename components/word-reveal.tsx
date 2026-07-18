"use client";

import { motion } from "framer-motion";

interface WordRevealProps {
  text: string;
  delay?: number;
  className?: string;
}

export function WordReveal({ text, delay = 0, className = "" }: WordRevealProps) {
  const words = text.split(" ");

  return (
    <motion.p
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ staggerChildren: 0.028, delayChildren: delay }}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block"
          variants={{
            hidden: { opacity: 0, y: 10, filter: "blur(4px)" },
            visible: { opacity: 1, y: 0, filter: "blur(0px)" },
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {word}
          {i < words.length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
    </motion.p>
  );
}
