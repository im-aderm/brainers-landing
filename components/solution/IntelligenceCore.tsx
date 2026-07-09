"use client";

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useSpring,
  type MotionValue,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Layers, HelpCircle, Network, ArrowRight } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;
type SpringValue = MotionValue<number>;

// ─── Icons ─────────────────────────────────────────────────────
const SlackIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
    <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52-2.52h2.52v2.52zM6.305 15.165a2.528 2.528 0 0 1 2.52-2.52h5.043v5.043a2.528 2.528 0 0 1-2.522 2.52H8.825v-5.043z" fill="#E01E5A" />
    <path d="M8.825 5.043a2.528 2.528 0 0 1 2.52-2.52v2.52h-2.522v-2.52zM8.825 6.305a2.528 2.528 0 0 1 2.52 2.52v5.043H3.782a2.528 2.528 0 0 1-2.52-2.522h5.043z" fill="#36C5F0" />
    <path d="M18.958 8.825a2.528 2.528 0 0 1 2.52 2.52h-2.52v-2.52zM17.695 8.825a2.528 2.528 0 0 1-2.52-2.52h-5.043v5.043H15.175v-5.043z" fill="#2EB67D" />
    <path d="M15.175 18.958a2.528 2.528 0 0 1 2.52 2.52v-2.52h2.522v2.52zM15.175 17.695a2.528 2.528 0 0 1-2.52 2.52v-5.043h5.043a2.528 2.528 0 0 1-2.52 2.522h-5.043z" fill="#ECB22E" />
  </svg>
);

const NotionIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm3 4h2.5v1.2l3 3.3V7h2.5v10h-2.5v-1.2l-3-3.3V17H7V7z" fill="currentColor" />
  </svg>
);

const GitHubIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

const DriveIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
    <path d="M19.43 12.98L13 1.86C12.61 1.18 11.9 1.18 11.51 1.86L5.08 12.98C4.69 13.66 5.05 14.22 5.83 14.22H18.68c.78 0 1.14-.56.75-1.24z" fill="#4285F4" />
    <path d="M9.43 14.98L3 3.86C2.61 3.18 1.9 3.18 1.51 3.86L.08 14.98C-.31 15.66.05 16.22.83 16.22h12.85c.78 0 1.14-.56.75-1.24z" fill="#34A853" />
  </svg>
);

// ─── Data ──────────────────────────────────────────────────────
type ToolData = {
  label: string;
  x: number;
  y: number;
  icon: React.ReactNode;
  streamPayload: string;
};

const TOOLS: ToolData[] = [
  { label: "Slack Threads", x: 14, y: 18, icon: <SlackIcon />, streamPayload: "Unstructured chat context" },
  { label: "Notion Docs", x: 34, y: 12, icon: <NotionIcon />, streamPayload: "Stale onboarding wiki" },
  { label: "GitHub PRs", x: 86, y: 22, icon: <GitHubIcon />, streamPayload: "Isolated technical specs" },
  { label: "Google Drive", x: 66, y: 14, icon: <DriveIcon />, streamPayload: "Fragmented design brief" },
  { label: "Jira Tickets", x: 10, y: 72, icon: <Layers size={16} className="text-blue-500" />, streamPayload: "Detached feature backlog" },
  { label: "Intercom History", x: 38, y: 88, icon: <HelpCircle size={16} className="text-orange-500" />, streamPayload: "Siloed customer friction" },
];

const SYNTHESIS_STEPS = [
  { context: "Resolving context collision...", detail: "Merging conflicting Slack decisions with stale wiki data." },
  { context: "Extracting structural relationships...", detail: "Parsing engineering specs into explicit knowledge arcs." },
  { context: "Unifying corporate memory space...", detail: "Assembling an indexable semantic layer across 6 tooling barriers." },
];

const CENTER = { x: 50, y: 50 };

// ─── Background Grid ───────────────────────────────────────────
function AmbientGrid() {
  return (
    <>
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(255,255,255,0.8)_100%)]" />
    </>
  );
}

// ─── Tool Orb ─────────────────────────────────────────────────
function ToolOrb({
  tool,
  index,
  mouseX,
  mouseY,
}: {
  tool: ToolData;
  index: number;
  mouseX: SpringValue;
  mouseY: SpringValue;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useAnimationFrame(() => {
    const mx = mouseX.get();
    const my = mouseY.get();
    const tx = (mx / window.innerWidth - 0.5) * 14;
    const ty = (my / window.innerHeight - 0.5) * 14;
    x.set(tx);
    y.set(ty);
  });

  return (
    <motion.div
      className="absolute"
      style={{ left: `${tool.x}%`, top: `${tool.y}%`, x, y }}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: 0.04 * index, ease: EASE }}
    >
      <div className="group relative flex items-center gap-3 rounded-xl border border-black/[0.06] bg-white/80 p-2.5 pr-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)] backdrop-blur-md transition-all duration-300 hover:border-black/15 hover:shadow-[0_8px_24px_rgba(0,0,0,0.04)]">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black/[0.02] font-medium text-black/70 ring-1 ring-black/[0.03]">
          {tool.icon}
        </div>
        <div className="flex flex-col">
          <span className="text-[11px] font-medium text-black/80">{tool.label}</span>
          <span className="max-w-[110px] truncate font-mono text-[9px] tracking-tight text-black/40">
            {tool.streamPayload}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Information Streams ──────────────────────────────────────
function InformationStreams() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="streamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#94a3b8" stopOpacity={0.15} />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.6} />
        </linearGradient>
      </defs>
      {TOOLS.map((tool, i) => {
        const d = `M ${tool.x + 4} ${tool.y + 2} Q ${tool.x > 50 ? tool.x - 15 : tool.x + 15} ${tool.y} ${CENTER.x} ${CENTER.y}`;
        return (
          <g key={tool.label}>
            <path d={d} stroke="rgba(0,0,0,0.03)" strokeWidth={0.7} fill="none" />
            <motion.path
              d={d}
              stroke="url(#streamGrad)"
              strokeWidth={1.2}
              fill="none"
              strokeDasharray="4 16"
              animate={{ strokeDashoffset: [0, -40] }}
              transition={{
                duration: 3 + i * 0.4,
                repeat: Infinity,
                ease: "linear",
              }}
            />
            <motion.circle
              r="0.6"
              fill="#2563eb"
              style={{ offsetPath: `path("${d}")` }}
              animate={{ offsetDistance: ["0%", "100%"] }}
              transition={{
                duration: 2.2 + i * 0.2,
                repeat: Infinity,
                ease: "linear",
                delay: i * 0.2,
              }}
            />
          </g>
        );
      })}
    </svg>
  );
}

// ─── Neural Core ──────────────────────────────────────────────
function NeuralCore({
  activeStep,
  mouseX,
  mouseY,
}: {
  activeStep: (typeof SYNTHESIS_STEPS)[0];
  mouseX: SpringValue;
  mouseY: SpringValue;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useAnimationFrame(() => {
    const mx = mouseX.get();
    const my = mouseY.get();
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    x.set(((mx - cx) / cx) * 5);
    y.set(((my - cy) / cy) * 5);
  });

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
      style={{ x, y }}
    >
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute left-1/2 top-[44px] h-[88px] w-[88px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-500/10"
          animate={{
            scale: [1, 2.8 - i * 0.4],
            opacity: [0.4 - i * 0.1, 0],
          }}
          transition={{
            duration: 4 - i * 0.5,
            delay: i * 0.8,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}

      <motion.div
        className="relative flex h-[88px] w-[88px] items-center justify-center rounded-2xl border border-black/[0.08] bg-white shadow-[0_12px_30px_rgba(0,0,0,0.06)]"
        animate={{
          boxShadow: [
            "0 4px 20px rgba(37,99,235,0.02)",
            "0 12px 40px rgba(37,99,235,0.08)",
            "0 4px 20px rgba(37,99,235,0.02)",
          ],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="absolute inset-1.5 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50/30 opacity-60" />
        <Network size={24} className="relative text-blue-600" />
      </motion.div>

      <div className="mt-8 flex max-w-[260px] flex-col items-center text-center md:max-w-[320px]">
        <div className="flex items-center gap-2 rounded-full border border-black/[0.05] bg-white/60 px-3 py-1 shadow-[0_2px_6px_rgba(0,0,0,0.01)] backdrop-blur-sm">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-500 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-blue-600" />
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-black/50">
            BrainersOS Engine
          </span>
        </div>

        <div className="mt-4 h-16">
          <motion.h3
            key={activeStep.context}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm font-semibold text-black/80"
          >
            {activeStep.context}
          </motion.h3>
          <motion.p
            key={activeStep.detail}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="mt-1 text-xs leading-relaxed text-black/45"
          >
            {activeStep.detail}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Export ──────────────────────────────────────────────
export default function IntelligenceCore() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);
  const springX = useSpring(mouseX, { stiffness: 80, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 80, damping: 20 });

  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((v) => (v + 1) % SYNTHESIS_STEPS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    mouseX.set(-1000);
    mouseY.set(-1000);
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative h-[560px] w-full overflow-hidden rounded-2xl border border-black/[0.05] bg-[#fafafa]"
      >
        <AmbientGrid />
        <InformationStreams />
        {TOOLS.map((tool, i) => (
          <ToolOrb key={tool.label} tool={tool} index={i} mouseX={springX} mouseY={springY} />
        ))}
        <NeuralCore activeStep={SYNTHESIS_STEPS[stepIndex]} mouseX={springX} mouseY={springY} />
      </div>

      <div className="grid grid-cols-1 items-center gap-4 rounded-xl border border-black/[0.04] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.01)] md:grid-cols-2">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-blue-600">The Resolution</h4>
          <p className="mt-1 text-sm font-medium leading-relaxed text-black/70">
            BrainersOS targets structural information fragmentation at its core. It operates across tools, converting siloed records into an unified organizational intelligence model.
          </p>
        </div>
        <div className="flex justify-start md:justify-end">
          <div className="inline-flex items-center gap-2 rounded-lg border border-black/[0.06] bg-black/[0.02] px-4 py-2.5 text-xs font-semibold text-black/80 transition-all hover:bg-black/[0.04]">
            Explore Architecture Audits <ArrowRight size={14} />
          </div>
        </div>
      </div>
    </div>
  );
}
