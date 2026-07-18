import Link from "next/link";
import { AmbientBackground } from "@/components/ambient-background";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center gap-6 overflow-hidden bg-night px-6 text-center">
      <AmbientBackground variant="stars" />
      <div className="relative z-10 flex flex-col items-center gap-4">
        <p className="font-hand text-3xl text-gold-bright">there&apos;s no letter here</p>
        <h1 className="font-display text-2xl italic text-paper">
          This one hasn&apos;t been written yet.
        </h1>
        <Link
          href="/home"
          className="mt-4 rounded-full glass-strong px-6 py-3 text-sm text-paper transition-transform hover:scale-105"
        >
          Back to all letters
        </Link>
      </div>
    </main>
  );
}
