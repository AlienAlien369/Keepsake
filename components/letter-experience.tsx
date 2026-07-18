"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AmbientBackground } from "@/components/ambient-background";
import { LetterNav } from "@/components/letter-nav";
import { ReadingProgress } from "@/components/reading-progress";
import { Envelope } from "@/components/envelope";
import { WordReveal } from "@/components/word-reveal";
import { Timeline } from "@/components/timeline";
import { MemoryGallery } from "@/components/memory-gallery";
import { GratitudeCards } from "@/components/gratitude-cards";
import { SurpriseEnding } from "@/components/surprise-ending";
import { ConfettiBurst } from "@/components/confetti-burst";
import { KeepsakeButton } from "@/components/keepsake-button";
import {
  ConversationThread,
  type ThreadMessageView,
} from "@/components/conversation-thread";
import {
  markLetterOpened,
  markLetterFinished,
  postUserReply,
} from "@/lib/actions/letter-actions";
import type { TimelineEntry, Memory } from "@/lib/letter-types";
import { Heart } from "lucide-react";

interface LetterExperienceProps {
  name: string;
  message: string[];
  timeline: TimelineEntry[];
  memories: Memory[];
  gratitude: string[];
  hasOpenedBefore: boolean;
  hasFinishedBefore: boolean;
  threadMessages: ThreadMessageView[];
}

export function LetterExperience({
  name,
  message,
  timeline,
  memories,
  gratitude,
  hasOpenedBefore,
  hasFinishedBefore,
  threadMessages,
}: LetterExperienceProps) {
  const [opened, setOpened] = useState(hasOpenedBefore);
  const [endingSeen, setEndingSeen] = useState(hasFinishedBefore);
  const [kept, setKept] = useState(hasFinishedBefore);
  const [confettiFire, setConfettiFire] = useState(false);
  const [, startTransition] = useTransition();

  const stage: "reading" | "ready" | "kept" = kept
    ? "kept"
    : endingSeen
      ? "ready"
      : "reading";

  const handleOpen = () => {
    setOpened(true);
    startTransition(() => {
      markLetterOpened();
    });
  };

  const handleKeep = () => {
    setKept(true);
    setConfettiFire(true);
    startTransition(() => {
      markLetterFinished();
    });
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-paper dark:bg-night">
      <ReadingProgress />
      <LetterNav />
      <ConfettiBurst fire={confettiFire} />

      {/* Envelope opening moment */}
      {!opened && (
        <section className="relative flex min-h-screen items-center justify-center px-4">
          <AmbientBackground variant="paper" className="text-gold" />
          <AmbientBackground variant="aurora" />

          <AnimatePresence>
            <motion.div
              exit={{ opacity: 0, scale: 0.92, filter: "blur(8px)" }}
              transition={{ duration: 0.7 }}
            >
              <Envelope
                name={name}
                isFirstVisit={!hasOpenedBefore}
                opened={opened}
                onOpen={handleOpen}
              />
            </motion.div>
          </AnimatePresence>
        </section>
      )}

      {opened && (
        <>
          {/* The letter itself */}
          <section className="relative z-10 mx-auto max-w-2xl px-6 py-24">
            <div className="rounded-[2rem] glass-strong p-8 shadow-2xl sm:p-14">
              <p className="mb-8 text-center text-xs uppercase tracking-[0.3em] text-gold-soft">
                For {name}
              </p>
              <div className="flex flex-col gap-7">
                {message.map((paragraph, i) => (
                  <WordReveal
                    key={i}
                    text={paragraph}
                    delay={i === 0 ? 0.1 : 0}
                    className="font-display text-lg leading-relaxed text-ink dark:text-paper/90 sm:text-xl"
                  />
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="mt-12 flex items-center justify-end gap-2"
              >
                <span className="font-hand text-4xl text-gold">— Lakshya</span>
                <Heart className="h-5 w-5 fill-aurora-rose text-aurora-rose animate-heartbeat" />
              </motion.div>
            </div>
          </section>

          {timeline.length > 0 ||
          memories.length > 0 ||
          gratitude.length > 0 ? (
            <>
              {memories.length > 0 && (
                <section className="relative z-10 mx-auto max-w-4xl px-6 py-20">
                  <SectionHeading
                    eyebrow="Our Memories"
                    title="A few moments worth keeping"
                  />
                  <MemoryGallery memories={memories} />
                </section>
              )}

              {timeline.length > 0 && (
                <section className="relative z-10 mx-auto max-w-4xl px-6 py-20">
                  <SectionHeading
                    eyebrow="The Story So Far"
                    title="How we got here"
                  />
                  <Timeline entries={timeline} />
                </section>
              )}

              {gratitude.length > 0 && (
                <section className="relative z-10 mx-auto max-w-4xl px-6 py-20">
                  <SectionHeading
                    eyebrow="Gratitude"
                    title="A few things I never said enough"
                  />
                  <GratitudeCards notes={gratitude} />
                </section>
              )}
            </>
          ) : null}

          {/* Surprise ending */}
          <SurpriseEnding onSeen={() => setEndingSeen(true)} />

          {/* Write back */}
          <section className="relative z-10 mx-auto max-w-2xl px-6 pb-40 pt-4">
            <SectionHeading
              eyebrow="Write back"
              title="Say whatever you'd like"
            />
            <ConversationThread
              messages={threadMessages}
              viewerRole="user"
              action={postUserReply}
              placeholder="Write something back..."
              emptyLabel="This is your space to reply, whenever you're ready."
            />
          </section>

          <KeepsakeButton stage={stage} onKeep={handleKeep} />
        </>
      )}
    </main>
  );
}

function SectionHeading({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
      className="mb-10 text-center"
    >
      <p className="text-xs uppercase tracking-[0.3em] text-gold-soft">
        {eyebrow}
      </p>
      <h2 className="mt-2 font-display text-2xl italic text-ink dark:text-paper sm:text-3xl">
        {title}
      </h2>
    </motion.div>
  );
}
