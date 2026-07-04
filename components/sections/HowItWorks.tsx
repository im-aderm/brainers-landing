"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import {
  Plug,
  FileOutput,
  Sparkles,
  Network,
  Search,
  BadgeCheck,
} from "lucide-react";
import { useRef } from "react";
import { SectionHeading } from "../ui/SectionHeading";
import { Reveal } from "../ui/Reveal";

const STAGES = [
  {
    icon: Plug,
    title: "Connect",
    body: "BrainOS plugs into the tools you already use — drives, email, chat, wikis — with nothing to migrate.",
  },
  {
    icon: FileOutput,
    title: "Extract",
    body: "Every document, policy, and conversation is read and understood, page by page.",
  },
  {
    icon: Sparkles,
    title: "Understand",
    body: "AI identifies the people, rules, dates, and decisions inside your knowledge — and what they mean.",
  },
  {
    icon: Network,
    title: "Map",
    body: "Everything is linked into a living knowledge graph: which policy governs which process, who owns what.",
  },
  {
    icon: Search,
    title: "Search",
    body: "Anyone asks in plain language. BrainOS finds the answer across everything your company knows.",
  },
  {
    icon: BadgeCheck,
    title: "Trust",
    body: "Every answer arrives with its evidence — the exact source, page, and confidence behind it.",
  },
];

/**
 * The pipeline, drawn as a living spine: a gradient line charges downward
 * as you scroll, lighting up each stage as the energy reaches it.
 */
export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 70%", "end 65%"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="how-it-works" className="relative mx-auto max-w-6xl px-6 py-32 sm:py-44">
      <SectionHeading
        eyebrow="How BrainOS works"
        title="From scattered files to trusted answers."
        subtitle="Six quiet steps happen behind the scenes. Your teams only see the last one: answers they can verify."
      />

      <div ref={ref} className="relative mx-auto mt-24 max-w-2xl">
        {/* Static rail + charged line */}
        <div className="absolute left-[27px] top-0 h-full w-px bg-white/8 sm:left-1/2" />
        <motion.div
          style={{ scaleY: lineScale }}
          className="absolute left-[27px] top-0 h-full w-px origin-top bg-gradient-to-b from-accent via-violet to-accent shadow-[0_0_16px_rgba(59,130,246,0.8)] sm:left-1/2"
        />

        <div className="space-y-16">
          {STAGES.map((stage, i) => {
            const left = i % 2 === 0;
            return (
              <Reveal key={stage.title} delay={0.05}>
                <div
                  className={`relative flex items-start gap-6 pl-16 sm:w-1/2 sm:gap-0 sm:pl-0 ${
                    left
                      ? "sm:mr-auto sm:pr-14 sm:text-right"
                      : "sm:ml-auto sm:pl-14"
                  }`}
                >
                  {/* Node on the spine */}
                  <div
                    className={`absolute left-0 top-1 flex h-14 w-14 items-center justify-center sm:top-0 ${
                      left ? "sm:left-auto sm:-right-7" : "sm:-left-7"
                    }`}
                  >
                    <div className="glass-strong flex h-14 w-14 items-center justify-center rounded-2xl border-edge-strong shadow-[0_0_30px_rgba(59,130,246,0.25)]">
                      <stage.icon size={20} className="text-accent" />
                    </div>
                  </div>

                  <div className={left ? "sm:pr-2" : "sm:pl-2"}>
                    <p className="text-xs font-medium uppercase tracking-[0.22em] text-text-muted">
                      Step {String(i + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold tracking-tight">{stage.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                      {stage.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
