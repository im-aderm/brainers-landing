"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import {
  Plug,
  FileOutput,
  Sparkles,
  Network,
  Search,
  BadgeCheck,
} from "lucide-react";
import { SectionHeading } from "../ui/SectionHeading";
import { Reveal } from "../ui/Reveal";

const EASE = [0.22, 1, 0.36, 1] as const;

const STAGES = [
  {
    icon: Plug,
    title: "Connect",
    body: "BrainersOS plugs into the tools you already use — drives, email, chat, wikis — with nothing to migrate.",
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
    body: "Anyone asks in plain language. BrainersOS finds the answer across everything your company knows.",
  },
  {
    icon: BadgeCheck,
    title: "Trust",
    body: "Every answer arrives with its evidence — the exact source, page, and confidence behind it.",
  },
];

// Inner Timeline Item to track active viewport scroll highlights and render cursor glare card
function TimelineItem({
  stage,
  index,
  left,
}: {
  stage: typeof STAGES[0];
  index: number;
  left: boolean;
}) {
  const itemRef = useRef<HTMLDivElement>(null);
  // Highlight node when it passes through the center of the viewport
  const isActive = useInView(itemRef, { margin: "-45% 0px -45% 0px" });

  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div ref={itemRef} className="relative">
      <Reveal delay={0.05}>
        <div
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className={`glass group relative flex flex-col gap-2 rounded-2xl border p-6 transition-all duration-500 pl-16 sm:w-[46%] sm:pl-6 ${
            left
              ? "sm:mr-auto sm:text-right hover:border-violet/30 hover:shadow-[0_0_30px_rgba(124,92,252,0.06)]"
              : "sm:ml-auto sm:text-left hover:border-accent/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.06)]"
          } ${isActive ? "border-white/15 bg-white/[0.04]" : "border-edge bg-white/[0.01]"}`}
          data-cursor="hover"
        >
          {/* Cursor-Tracking Glass Glare */}
          {hovered && (
            <div
              className="pointer-events-none absolute inset-0 z-0 rounded-2xl opacity-100 transition-opacity duration-300"
              style={{
                background: `radial-gradient(circle 120px at ${coords.x}px ${coords.y}px, ${
                  left ? "rgba(124, 92, 252, 0.08)" : "rgba(59, 130, 246, 0.08)"
                }, transparent 70%)`,
              }}
            />
          )}

          {/* Node on the Spine (Glows dynamically as the viewport scrolls past it) */}
          <div
            className={`absolute left-4 top-6 z-10 flex h-10 w-10 items-center justify-center sm:top-6 ${
              left ? "sm:left-auto sm:-right-[13.5%] md:-right-[11.8%]" : "sm:-left-[13.5%] md:-left-[11.8%]"
            }`}
          >
            <motion.div
              animate={{
                scale: isActive ? 1.15 : 1,
                borderColor: isActive ? (left ? "#7c5cfc" : "#3b82f6") : "rgba(255,255,255,0.08)",
                boxShadow: isActive
                  ? `0 0 24px ${left ? "rgba(124,92,252,0.4)" : "rgba(59,130,246,0.4)"}`
                  : "none",
              }}
              transition={{ duration: 0.35 }}
              className={`flex h-10 w-10 items-center justify-center rounded-xl border bg-[#05070a] transition-all duration-300`}
            >
              <stage.icon
                size={16}
                className={`transition-colors duration-300 ${
                  isActive ? (left ? "text-violet" : "text-accent") : "text-white/30"
                }`}
              />
            </motion.div>
          </div>

          {/* Text block */}
          <div className="relative z-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-text-muted/70">
              Step {String(index + 1).padStart(2, "0")}
            </p>
            <h3 className="mt-2 text-xl font-semibold tracking-tight text-white">{stage.title}</h3>
            <p className="mt-2 text-xs leading-relaxed text-text-secondary">
              {stage.body}
            </p>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 70%", "end 65%"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="how-it-works" className="relative mx-auto max-w-7xl px-6 lg:px-10 py-32 sm:py-44">
      {/* Visual Alignment Lines */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-full max-w-7xl -translate-x-1/2 hairline-gradient opacity-40" />

      <SectionHeading
        eyebrow="How BrainersOS works"
        title="From scattered files to trusted answers."
        subtitle="Six quiet steps happen behind the scenes. Your teams only see the last one: answers they can verify."
      />

      <div ref={ref} className="relative mx-auto mt-24 max-w-4xl">
        {/* Central spine track line */}
        <div className="absolute left-[24px] top-0 h-full w-px bg-white/5 sm:left-1/2" />
        {/* Scrolling charged neon line */}
        <motion.div
          style={{ scaleY: lineScale }}
          className="absolute left-[24px] top-0 h-full w-px origin-top bg-gradient-to-b from-accent via-violet to-[#35d6ff] shadow-[0_0_16px_rgba(59,130,246,0.6)] sm:left-1/2"
        />

        <div className="space-y-12">
          {STAGES.map((stage, i) => {
            const left = i % 2 === 0;
            return (
              <TimelineItem
                key={stage.title}
                stage={stage}
                index={i}
                left={left}
              />
            );
          })}
        </div>
      </div>
      {/* HowItWorks center-left background glow */}
      <div className="pointer-events-none absolute left-[-5%] top-1/2 z-0 h-[480px] w-[480px] -translate-y-1/2 rounded-full bg-accent/6 blur-[130px]" />
    </section>
  );
}
