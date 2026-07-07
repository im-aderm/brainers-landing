"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { Search, Network, Cog, HardDrive, FileText, CheckCircle, Sparkles, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SectionHeading } from "../ui/SectionHeading";
import { Reveal } from "../ui/Reveal";

const QUESTION = "Which compliance policy affects customer onboarding?";

const STEPS = [
  { icon: Search, label: "Search", color: "#3B82F6" },
  { icon: Network, label: "Graph traversal", color: "#7C5CFC" },
  { icon: Cog, label: "Reasoning", color: "#35D6FF" },
  { icon: HardDrive, label: "Memory retrieval", color: "#18C964" },
  { icon: FileText, label: "Evidence", color: "#F5A524" },
  { icon: CheckCircle, label: "Answer", color: "#3B82F6" },
];

const EASE = [0.22, 1, 0.36, 1] as const;

const ANSWER =
  "Customer onboarding is governed by your KYC Procedure (v3.2) and the AML Regulation 2025 (Article 7). Due-diligence thresholds were lowered to ₦5m in Q2. See Policy #KYC-009, Section 4.1.";

const SOURCES = [
  { doc: "KYC Procedure v3.2", section: "Section 4.1 — Due Diligence", match: 97 },
  { doc: "AML Regulation 2025", section: "Article 7 — Customer Screening", match: 94 },
  { doc: "Risk Committee Minutes", section: "April 14 — Threshold Decision", match: 91 },
];

type Phase = "idle" | "searching" | "graph" | "reasoning" | "memory" | "evidence" | "answering" | "done";

export function LiveDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-15% 0px" });
  const [phase, setPhase] = useState<Phase>("idle");
  const [typed, setTyped] = useState("");
  const [answerText, setAnswerText] = useState("");

  useEffect(() => {
    if (!inView) {
      setPhase("idle");
      setTyped("");
      setAnswerText("");
      return;
    }
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const wait = (ms: number) => new Promise<void>((r) => timers.push(setTimeout(r, ms)));

    async function run() {
      while (!cancelled) {
        setTyped("");
        setAnswerText("");
        setPhase("searching");
        for (let i = 1; i <= QUESTION.length && !cancelled; i++) {
          setTyped(QUESTION.slice(0, i));
          await wait(30);
        }
        if (cancelled) return;
        await wait(400);
        if (cancelled) return;
        setPhase("graph");
        await wait(600);
        if (cancelled) return;
        setPhase("reasoning");
        await wait(700);
        if (cancelled) return;
        setPhase("memory");
        await wait(500);
        if (cancelled) return;
        setPhase("evidence");
        await wait(600);
        if (cancelled) return;
        setPhase("answering");
        for (let i = 1; i <= ANSWER.length && !cancelled; i += 4) {
          setAnswerText(ANSWER.slice(0, i));
          await wait(12);
        }
        setAnswerText(ANSWER);
        if (cancelled) return;
        await wait(500);
        if (cancelled) return;
        setPhase("done");
        await wait(5000);
      }
    }
    run();
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [inView]);

  const activeIdx = ["searching", "graph", "reasoning", "memory", "evidence", "answering", "done"].indexOf(phase);

  return (
    <section className="relative overflow-hidden py-32 sm:py-44">
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-full max-w-4xl -translate-x-1/2 hairline-gradient" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeading
          eyebrow="Live Demo"
          title="See it in action."
          subtitle="Type a question and watch BrainersOS search, reason, retrieve, and deliver a verified answer."
        />

        <Reveal className="mt-16 w-full" y={40}>
          <div ref={ref} className="glass-strong relative mx-auto w-full overflow-hidden rounded-3xl shadow-[0_40px_120px_rgba(0,0,0,0.5)]">
            <div className="hairline-gradient absolute inset-x-0 top-0" />

            {/* Window chrome */}
            <div className="flex items-center gap-2 border-b border-edge px-5 py-3.5">
              <span className="h-2.5 w-2.5 rounded-full bg-white/12" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/12" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/12" />
              <span className="ml-3 text-xs text-text-muted">BrainersOS — Live Query</span>
            </div>

            <div className="p-6 sm:p-8">
              {/* Search input */}
              <div className="glass flex items-center gap-3 rounded-2xl px-5 py-4">
                <Search size={18} className="shrink-0 text-accent" />
                <p className="min-h-[1.5rem] flex-1 text-sm text-white sm:text-base">
                  {typed}
                  {phase === "searching" && (
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.7, repeat: Infinity }}
                      className="ml-0.5 inline-block h-4 w-px translate-y-0.5 bg-accent align-baseline"
                    />
                  )}
                </p>
              </div>

              {/* Pipeline visualization */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                {STEPS.map((step, i) => {
                  const isActive = i <= activeIdx && phase !== "idle" && phase !== "searching" && i > 0 ? activeIdx >= i : i === 0 && (phase === "searching" || activeIdx >= 0);
                  const isCurrent = i === activeIdx;
                  return (
                    <div key={step.label} className="flex items-center gap-2 sm:gap-3">
                      <motion.div
                        animate={{
                          scale: isCurrent ? 1.08 : 1,
                          borderColor: isActive ? step.color : "rgba(255,255,255,0.08)",
                        }}
                        className="flex items-center gap-2 rounded-xl border px-3 py-2 transition-all duration-500 sm:px-4"
                        style={{
                          background: isActive ? `${step.color}15` : "rgba(255,255,255,0.03)",
                          borderColor: isActive ? `${step.color}50` : "rgba(255,255,255,0.08)",
                          boxShadow: isCurrent ? `0 0 20px ${step.color}30` : "none",
                        }}
                      >
                        <step.icon size={14} style={{ color: isActive ? step.color : "rgba(255,255,255,0.35)" }} />
                        <span className="text-[11px] font-medium sm:text-xs" style={{ color: isActive ? "#fff" : "rgba(255,255,255,0.35)" }}>
                          {step.label}
                        </span>
                      </motion.div>
                      {i < STEPS.length - 1 && (
                        <ArrowRight size={12} className="shrink-0 text-white/15" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Answer */}
              <AnimatePresence>
                {(phase === "answering" || phase === "done") && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: EASE }}
                    className="mt-8 rounded-2xl border border-accent/20 bg-accent/5 p-5 sm:p-6"
                  >
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-violet">
                        <Sparkles size={14} className="text-white" />
                      </span>
                      <p className="text-sm leading-relaxed text-text-secondary sm:text-[15px]">
                        {answerText}
                        {phase === "answering" && (
                          <motion.span
                            animate={{ opacity: [1, 0] }}
                            transition={{ duration: 0.5, repeat: Infinity }}
                            className="ml-0.5 inline-block h-4 w-px translate-y-0.5 bg-accent align-baseline"
                          />
                        )}
                      </p>
                    </div>

                    {/* Confidence */}
                    <div className="mt-4 flex items-center gap-3 pl-10">
                      <span className="text-[10px] uppercase tracking-[0.18em] text-text-muted">Confidence</span>
                      <div className="h-1 w-24 overflow-hidden rounded-full bg-white/10">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-success/70 to-success"
                          initial={{ width: 0 }}
                          animate={{ width: phase === "done" ? "96%" : "0%" }}
                          transition={{ duration: 1, ease: EASE }}
                        />
                      </div>
                      <span className="text-xs font-medium text-success">96%</span>
                    </div>

                    {/* Sources */}
                    {phase === "done" && (
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5, ease: EASE }}
                        className="mt-5 grid gap-3 border-t border-edge pt-5 sm:grid-cols-3"
                      >
                        {SOURCES.map((s) => (
                          <div key={s.doc} className="glass rounded-xl p-3" data-cursor="hover">
                            <div className="flex items-center justify-between">
                              <FileText size={13} className="text-accent" />
                              <span className="text-[10px] font-medium text-success">{s.match}%</span>
                            </div>
                            <p className="mt-2 text-xs font-semibold text-white">{s.doc}</p>
                            <p className="mt-0.5 text-[10px] text-text-muted">{s.section}</p>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </Reveal>
      </div>
      {/* LiveDemo background glow */}
      <div className="pointer-events-none absolute right-[5%] top-[25%] z-0 h-[500px] w-[500px] rounded-full bg-violet/6 blur-[140px]" />
    </section>
  );
}
