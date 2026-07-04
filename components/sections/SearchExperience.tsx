"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { FileText, Search, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SectionHeading } from "../ui/SectionHeading";
import { Reveal } from "../ui/Reveal";

const QUESTION = "What changed in our compliance policy this quarter?";
const ANSWER =
  "Three changes took effect in Q2: customer due-diligence thresholds were lowered to ₦5m, PEP screening now runs daily instead of weekly, and record retention was extended from 5 to 7 years.";

const EVIDENCE = [
  { doc: "Compliance Policy v4", detail: "Section 3.2 — Due diligence thresholds", match: 98 },
  { doc: "AML Regulation 2025", detail: "Article 12 — Screening frequency", match: 94 },
  { doc: "Risk Committee Minutes", detail: "April 14 — Retention decision", match: 91 },
];

type Phase = "idle" | "typing" | "thinking" | "answering" | "evidence" | "hold";

/**
 * A live re-enactment of the product: the question types itself, the AI
 * thinks, the answer streams in, and the evidence lands underneath —
 * looping for as long as the section is on screen.
 */
export function SearchExperience() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-20% 0px" });
  const [phase, setPhase] = useState<Phase>("idle");
  const [typed, setTyped] = useState("");
  const [answered, setAnswered] = useState("");

  useEffect(() => {
    if (!inView) {
      setPhase("idle");
      setTyped("");
      setAnswered("");
      return;
    }

    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        timers.push(setTimeout(resolve, ms));
      });

    async function run() {
      while (!cancelled) {
        setTyped("");
        setAnswered("");
        setPhase("typing");
        for (let i = 1; i <= QUESTION.length && !cancelled; i++) {
          setTyped(QUESTION.slice(0, i));
          await wait(34);
        }
        if (cancelled) return;

        setPhase("thinking");
        await wait(1100);
        if (cancelled) return;

        setPhase("answering");
        for (let i = 1; i <= ANSWER.length && !cancelled; i += 3) {
          setAnswered(ANSWER.slice(0, i));
          await wait(14);
        }
        setAnswered(ANSWER);
        if (cancelled) return;

        setPhase("evidence");
        await wait(900);
        if (cancelled) return;

        setPhase("hold");
        await wait(5200);
      }
    }
    run();

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [inView]);

  const showAnswer = phase === "answering" || phase === "evidence" || phase === "hold";
  const showEvidence = phase === "evidence" || phase === "hold";

  return (
    <section className="relative mx-auto max-w-6xl px-6 py-32 sm:py-44">
      <SectionHeading
        eyebrow="Ask anything"
        title="Plain questions. Verified answers."
        subtitle="No keywords, no folder hunting. Ask the way you'd ask a colleague — and see exactly where every answer comes from."
      />

      <Reveal className="mt-16" y={40}>
        <div
          ref={ref}
          className="glass-strong relative mx-auto max-w-3xl overflow-hidden rounded-3xl shadow-[0_40px_120px_rgba(0,0,0,0.5)]"
        >
          <div className="hairline-gradient absolute inset-x-0 top-0" />

          {/* Window chrome */}
          <div className="flex items-center gap-2 border-b border-edge px-5 py-3.5">
            <span className="h-2.5 w-2.5 rounded-full bg-white/12" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/12" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/12" />
            <span className="ml-3 text-xs text-text-muted">BrainOS — Enterprise Search</span>
          </div>

          <div className="p-6 sm:p-8">
            {/* Search input */}
            <div className="glass flex items-center gap-3 rounded-2xl px-5 py-4">
              <Search size={18} className="shrink-0 text-accent" />
              <p className="min-h-[1.5rem] flex-1 text-sm text-white sm:text-base">
                {typed}
                {(phase === "typing" || phase === "idle") && (
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.7, repeat: Infinity }}
                    className="ml-0.5 inline-block h-4 w-px translate-y-0.5 bg-accent align-baseline"
                  />
                )}
              </p>
            </div>

            {/* Thinking */}
            <AnimatePresence>
              {phase === "thinking" && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-5 flex items-center gap-2.5 text-sm text-text-muted"
                >
                  <Sparkles size={15} className="text-violet" />
                  Reading 4 sources across 3 systems
                  <span className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="h-1 w-1 rounded-full bg-violet"
                        animate={{ opacity: [0.2, 1, 0.2] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                      />
                    ))}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Answer */}
            <AnimatePresence>
              {showAnswer && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="mt-6"
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-violet">
                      <Sparkles size={13} className="text-white" />
                    </span>
                    <p className="text-sm leading-relaxed text-text-secondary sm:text-[15px]">
                      {answered}
                    </p>
                  </div>

                  {/* Confidence */}
                  <div className="mt-5 flex items-center gap-3 pl-9">
                    <span className="text-[11px] uppercase tracking-[0.18em] text-text-muted">
                      Confidence
                    </span>
                    <div className="h-1 w-32 overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-success/70 to-success"
                        initial={{ width: 0 }}
                        animate={{ width: showEvidence ? "96%" : "0%" }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </div>
                    <span className="text-xs font-medium text-success">96%</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Evidence cards */}
            <AnimatePresence>
              {showEvidence && (
                <motion.div className="mt-6 grid gap-3 sm:grid-cols-3" exit={{ opacity: 0 }}>
                  {EVIDENCE.map((ev, i) => (
                    <motion.div
                      key={ev.doc}
                      initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{ delay: i * 0.15, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                      className="glass group rounded-2xl p-4 transition-colors hover:border-edge-strong"
                      data-cursor="hover"
                    >
                      <div className="flex items-center justify-between">
                        <FileText size={15} className="text-accent" />
                        <span className="text-[10px] font-medium text-success">{ev.match}%</span>
                      </div>
                      <p className="mt-3 text-xs font-semibold text-white">{ev.doc}</p>
                      <p className="mt-1 text-[11px] leading-relaxed text-text-muted">{ev.detail}</p>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
