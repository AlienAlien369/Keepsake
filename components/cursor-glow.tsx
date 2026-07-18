"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A soft glow that follows the pointer on desktop only.
 * Disabled automatically on touch devices and for reduced-motion users.
 */
export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isTouch || reduced) return;
    setEnabled(true);

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let targetX = x;
    let targetY = y;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const tick = () => {
      x += (targetX - x) * 0.18;
      y += (targetY - y) * 0.18;
      if (ref.current) {
        ref.current.style.transform = `translate3d(${x - 90}px, ${y - 90}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      ref={ref}
      className="custom-cursor h-[180px] w-[180px] rounded-full"
      style={{
        background:
          "radial-gradient(circle, rgba(232,199,102,0.35) 0%, rgba(108,92,231,0.18) 45%, transparent 70%)",
        willChange: "transform",
      }}
      aria-hidden="true"
    />
  );
}
