"use client";

import { useEffect, useRef } from "react";

interface ConfettiBurstProps {
  fire: boolean;
}

interface Piece {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  spin: number;
  size: number;
  color: string;
  life: number;
}

const COLORS = ["#C9A227", "#E8C766", "#6C5CE7", "#2FD9C4", "#E9668B", "#FBF6EA"];

/**
 * Small self-contained confetti burst rendered on a fixed canvas.
 * No external dependency — fires once when `fire` flips true.
 */
export function ConfettiBurst({ fire }: ConfettiBurstProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const firedRef = useRef(false);

  useEffect(() => {
    if (!fire || firedRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    firedRef.current = true;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const pieces: Piece[] = Array.from({ length: 140 }, () => ({
      x: canvas.width / 2 + (Math.random() - 0.5) * 200,
      y: canvas.height * 0.35,
      vx: (Math.random() - 0.5) * 9,
      vy: -Math.random() * 10 - 4,
      rotation: Math.random() * 360,
      spin: (Math.random() - 0.5) * 12,
      size: 5 + Math.random() * 6,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      life: 1,
    }));

    let frame: number;
    const gravity = 0.28;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      for (const p of pieces) {
        if (p.life <= 0) continue;
        p.vy += gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.spin;
        p.life -= 0.006;
        if (p.y < canvas.height + 40 && p.life > 0) alive = true;

        ctx.save();
        ctx.globalAlpha = Math.max(p.life, 0);
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        ctx.restore();
      }

      if (alive) {
        frame = requestAnimationFrame(draw);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, [fire]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[70]"
      aria-hidden="true"
    />
  );
}
