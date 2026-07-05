"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import {
  FileText,
  File,
  MessageSquare,
  Mail,
  ScrollText,
  Folder,
  Table,
  Presentation,
  FileSearch,
  BookOpen,
} from "lucide-react";
import { useRef } from "react";
import { BrainMark } from "../ui/BrainMark";

/**
 * The problem, told with scroll: a chaotic cloud of disconnected files
 * drifts apart while you read — then, as you keep scrolling, every
 * fragment is pulled into one intelligent core.
 */

const FRAGMENTS = [
  { icon: FileText, label: "Policy_v4_FINAL.pdf", x: -420, y: -180, r: -14 },
  { icon: MessageSquare, label: "#ops-team thread", x: 380, y: -220, r: 10 },
  { icon: Mail, label: "RE: RE: Compliance?", x: -320, y: 150, r: 8 },
  { icon: File, label: "Handbook_old.docx", x: 430, y: 120, r: -8 },
  { icon: ScrollText, label: "Regulation 2025", x: -150, y: -260, r: 5 },
  { icon: Folder, label: "Shared Drive (9,412 files)", x: 160, y: 240, r: -6 },
  { icon: Table, label: "Q3_numbers_v7.xlsx", x: -480, y: -20, r: 12 },
  { icon: Presentation, label: "Board_deck_draft.pptx", x: 490, y: -60, r: -12 },
  { icon: FileSearch, label: "Where is the KYC doc?", x: 60, y: -300, r: 4 },
  { icon: BookOpen, label: "Onboarding wiki (stale)", x: -60, y: 290, r: -4 },
];

function Fragment({
  progress,
  icon: Icon,
  label,
  x,
  y,
  r,
  index,
}: {
  progress: MotionValue<number>;
  icon: typeof FileText;
  label: string;
  x: number;
  y: number;
  r: number;
  index: number;
}) {
  // Every fragment converges to the center as you scroll through the pin.
  const tx = useTransform(progress, [0.15, 0.75], [x, 0]);
  const ty = useTransform(progress, [0.15, 0.75], [y, 0]);
  const rot = useTransform(progress, [0.15, 0.75], [r, 0]);
  const scale = useTransform(progress, [0.15, 0.75, 0.85], [1, 0.35, 0.1]);
  const opacity = useTransform(progress, [0, 0.1, 0.72, 0.82], [0, 1, 0.9, 0]);

  return (
    <motion.div
      style={{ x: tx, y: ty, rotate: rot, scale, opacity }}
      className="glass absolute flex items-center gap-2.5 rounded-xl px-4 py-2.5"
      transition={{ delay: index * 0.02 }}
    >
      <Icon size={15} className="text-text-muted" />
      <span className="whitespace-nowrap text-xs text-text-secondary">{label}</span>
    </motion.div>
  );
}

export function Problem() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const headlineOpacity = useTransform(scrollYProgress, [0, 0.12, 0.3], [0, 1, 1]);
  const chaosLabel = useTransform(scrollYProgress, [0.35, 0.5], [1, 0]);
  const brainScale = useTransform(scrollYProgress, [0.55, 0.85], [0.3, 1]);
  const brainOpacity = useTransform(scrollYProgress, [0.55, 0.75], [0, 1]);
  const resolvedOpacity = useTransform(scrollYProgress, [0.78, 0.9], [0, 1]);
  const resolvedY = useTransform(scrollYProgress, [0.78, 0.9], [24, 0]);

  return (
    <section ref={ref} className="relative h-[300vh]">
      <div className="sticky top-0 flex h-svh flex-col items-center justify-center overflow-hidden">
        <motion.div style={{ opacity: headlineOpacity }} className="relative z-10 px-6 text-center">
          <motion.div style={{ opacity: chaosLabel }}>
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-text-muted">
              The problem
            </p>
            <h2 className="mx-auto mt-4 max-w-2xl text-balance text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              Your company already knows the answer.
              <br />
              <span className="text-text-muted">It just can&apos;t find it.</span>
            </h2>
          </motion.div>
        </motion.div>

        {/* The chaos → convergence field */}
        <div className="absolute inset-0 flex items-center justify-center">
          {FRAGMENTS.map((f, i) => (
            <Fragment key={f.label} progress={scrollYProgress} index={i} {...f} />
          ))}

          {/* The brain the fragments collapse into */}
          <motion.div
            style={{ scale: brainScale, opacity: brainOpacity }}
            className="absolute flex items-center justify-center"
          >
            <div className="absolute h-64 w-64 rounded-full bg-accent/15 blur-3xl" />
            <div className="absolute h-40 w-40 animate-pulse-soft rounded-full border border-accent/30" />
            <div className="absolute h-56 w-56 animate-pulse-soft rounded-full border border-violet/20 [animation-delay:1s]" />
            <BrainMark size={96} />
          </motion.div>
        </div>

        <motion.div
          style={{ opacity: resolvedOpacity, y: resolvedY }}
          className="absolute bottom-[16%] z-10 px-6 text-center"
        >
          <h3 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            One brain. <span className="gradient-text">Every answer.</span>
          </h3>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-text-secondary sm:text-base">
            BrainersOS connects the knowledge scattered across your tools into a
            single intelligence your whole organization can rely on.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
