"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A soft generative ambient pad, synthesized in the browser so the project
 * never depends on a licensed audio file. Three detuned oscillators through
 * a slow low-pass filter and long reverb-like delay, kept very quiet.
 */
export function MusicToggle({ className }: { className?: string }) {
  const [playing, setPlaying] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<{ oscillators: OscillatorNode[]; master: GainNode } | null>(null);

  const stop = () => {
    const ctx = ctxRef.current;
    const nodes = nodesRef.current;
    if (!ctx || !nodes) return;
    const now = ctx.currentTime;
    nodes.master.gain.cancelScheduledValues(now);
    nodes.master.gain.setTargetAtTime(0, now, 0.4);
    setTimeout(() => {
      nodes.oscillators.forEach((o) => {
        try {
          o.stop();
        } catch {
          /* already stopped */
        }
      });
      ctx.close().catch(() => {});
      ctxRef.current = null;
      nodesRef.current = null;
    }, 900);
  };

  const start = () => {
    const AudioCtx = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const master = ctx.createGain();
    master.gain.value = 0;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 1200;
    const delay = ctx.createDelay(2);
    delay.delayTime.value = 0.6;
    const feedback = ctx.createGain();
    feedback.gain.value = 0.25;

    delay.connect(feedback);
    feedback.connect(delay);
    master.connect(filter);
    filter.connect(ctx.destination);
    filter.connect(delay);
    delay.connect(ctx.destination);

    const freqs = [130.81, 164.81, 196.0, 261.63]; // soft C major pad
    const oscillators = freqs.map((f, i) => {
      const osc = ctx.createOscillator();
      osc.type = i % 2 === 0 ? "sine" : "triangle";
      osc.frequency.value = f;
      const g = ctx.createGain();
      g.gain.value = 0.18 / freqs.length;
      osc.connect(g);
      g.connect(master);
      osc.start();
      return osc;
    });

    master.gain.setTargetAtTime(0.5, ctx.currentTime, 1.2);

    ctxRef.current = ctx;
    nodesRef.current = { oscillators, master };
  };

  useEffect(() => {
    return () => stop();
  }, []);

  const toggle = () => {
    if (playing) {
      stop();
    } else {
      start();
    }
    setPlaying(!playing);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={playing ? "Mute ambient music" : "Play ambient music"}
      aria-pressed={playing}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full glass transition-transform hover:scale-105 active:scale-95",
        className
      )}
    >
      {playing ? <Volume2 className="h-4 w-4 text-gold-bright" /> : <VolumeX className="h-4 w-4 text-ink-soft dark:text-paper/60" />}
    </button>
  );
}
