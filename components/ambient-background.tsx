"use client";

import { useMemo } from "react";

interface AmbientBackgroundProps {
  variant?: "aurora" | "stars" | "paper";
  className?: string;
}

/**
 * Shared atmosphere layer: aurora gradient blobs + slow floating particles.
 * Pure CSS/SVG so it stays lightweight on lower-end devices.
 */
export function AmbientBackground({ variant = "aurora", className = "" }: AmbientBackgroundProps) {
  const particles = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 2 + Math.random() * 4,
        duration: 6 + Math.random() * 10,
        delay: Math.random() * 6,
      })),
    []
  );

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {variant !== "paper" && (
        <>
          <div
            className="absolute -top-1/4 -left-1/4 h-[70%] w-[70%] rounded-full opacity-40 blur-[110px] animate-aurora-move dark:opacity-60"
            style={{ background: "radial-gradient(circle, #6C5CE7, transparent 70%)" }}
          />
          <div
            className="absolute top-1/3 -right-1/4 h-[65%] w-[65%] rounded-full opacity-30 blur-[120px] animate-aurora-move dark:opacity-50"
            style={{ background: "radial-gradient(circle, #2FD9C4, transparent 70%)", animationDelay: "-6s" }}
          />
          <div
            className="absolute -bottom-1/4 left-1/4 h-[55%] w-[55%] rounded-full opacity-20 blur-[100px] animate-aurora-move dark:opacity-40"
            style={{ background: "radial-gradient(circle, #C9A227, transparent 70%)", animationDelay: "-11s" }}
          />
        </>
      )}

      {variant === "paper" && (
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 27px, currentColor 28px)",
          }}
        />
      )}

      {particles.map((p) => (
        <span
          key={p.id}
          className={variant === "stars" ? "absolute rounded-full bg-white animate-twinkle" : "absolute rounded-full bg-gold/70 animate-float-slow"}
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            filter: "blur(0.5px)",
          }}
        />
      ))}
    </div>
  );
}
