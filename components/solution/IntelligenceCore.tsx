"use client";

import {
  motion,
  AnimatePresence,
  useAnimationFrame,
  useMotionValue,
  useSpring,
  type MotionValue,
} from "framer-motion";
import { useRef, useState } from "react";
import { Layers, HelpCircle, ArrowRight, PenTool, Bug, Columns3, ChevronRight } from "lucide-react";
import { BrainMark } from "../ui/BrainMark";

const EASE = [0.22, 1, 0.36, 1] as const;
type SpringValue = MotionValue<number>;

const TOOL_COLORS: Record<string, string> = {
  "Slack Threads": "#E01E5A",
  "Notion Docs": "#a0a0a0",
  "Google Drive": "#4285F4",
  "Figma Files": "#a855f7",
  "Linear Tickets": "#34d399",
  "GitHub PRs": "#c0c0c0",
  "Jira Tickets": "#2684FF",
  "Sentry Errors": "#f87171",
  "Intercom History": "#f97316",
};

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
  { label: "Slack Threads", x: 50, y: 14, icon: <SlackIcon />, streamPayload: "Unstructured chat context" },
  { label: "Notion Docs", x: 71, y: 22, icon: <NotionIcon />, streamPayload: "Stale onboarding wiki" },
  { label: "Google Drive", x: 82, y: 41, icon: <DriveIcon />, streamPayload: "Fragmented design brief" },
  { label: "Figma Files", x: 79, y: 64, icon: <PenTool size={16} className="text-purple-400" />, streamPayload: "Disconnected design system" },
  { label: "Linear Tickets", x: 61, y: 78, icon: <Columns3 size={16} className="text-emerald-400" />, streamPayload: "Scattered sprint planning" },
  { label: "GitHub PRs", x: 39, y: 78, icon: <GitHubIcon />, streamPayload: "Isolated technical specs" },
  { label: "Jira Tickets", x: 21, y: 64, icon: <Layers size={16} className="text-blue-500" />, streamPayload: "Detached feature backlog" },
  { label: "Sentry Errors", x: 18, y: 41, icon: <Bug size={16} className="text-red-400" />, streamPayload: "Unresolved production issues" },
  { label: "Intercom History", x: 29, y: 22, icon: <HelpCircle size={16} className="text-orange-500" />, streamPayload: "Siloed customer friction" },
];

const CENTER = { x: 50, y: 50 };

// ─── Background Grid ───────────────────────────────────────────
function AmbientGrid() {
  return (
    <>
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.3)_100%)]" />
    </>
  );
}

// ─── Tool Orb ─────────────────────────────────────────────────
function ToolOrb({
  tool,
  index,
  mouseX,
  mouseY,
  active,
  onHover,
}: {
  tool: ToolData;
  index: number;
  mouseX: SpringValue;
  mouseY: SpringValue;
  active: boolean;
  onHover: (label: string | null) => void;
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
      onMouseEnter={() => onHover(tool.label)}
      onMouseLeave={() => onHover(null)}
    >
      <div className="group relative overflow-hidden rounded-xl p-[1px]">
        <div
          className="absolute inset-[-150%] animate-[gradient-spin_5s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_30%,#3d7bff_50%,transparent_70%,#60a5fa_90%,transparent_100%)] opacity-40"
          style={active ? { opacity: 0.8, filter: "brightness(1.3)" } : undefined}
        />
        <div
          className="relative z-10 flex items-center gap-3 rounded-[11px] bg-white/10 p-2.5 pr-4 backdrop-blur-md transition-all duration-300 hover:bg-white/[0.14]"
          style={active ? { background: `${TOOL_COLORS[tool.label]}18` } : undefined}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.06] font-medium text-white/80 ring-1 ring-white/[0.06]">
            {tool.icon}
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-medium text-white">{tool.label}</span>
            <span className="max-w-[110px] truncate font-mono text-[9px] tracking-tight text-white/50">
              {tool.streamPayload}
            </span>
          </div>
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
          <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.1} />
          <stop offset="100%" stopColor="#a78bfa" stopOpacity={0.4} />
        </linearGradient>
      </defs>
      {TOOLS.map((tool, i) => {
        const d = `M ${tool.x + 4} ${tool.y + 2} Q ${tool.x > 50 ? tool.x - 15 : tool.x + 15} ${tool.y} ${CENTER.x} ${CENTER.y}`;
        return (
          <g key={tool.label}>
            <path d={d} stroke="rgba(255,255,255,0.05)" strokeWidth={0.7} fill="none" />
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
  mouseX,
  mouseY,
}: {
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
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{ x, y }}
    >
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute left-1/2 top-1/2 h-[88px] w-[88px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-500/10"
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

      <div className="group relative h-[88px] w-[88px] overflow-hidden rounded-2xl p-[1px]">
        <div className="absolute inset-[-150%] animate-[gradient-spin_4s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_20%,#3d7bff_50%,transparent_70%,#60a5fa_90%,transparent_100%)] opacity-90" />

        <motion.div
          className="relative z-10 flex h-full w-full items-center justify-center rounded-[15px] bg-[#090b10]/95"
          animate={{
            scale: [1, 1.05, 1],
            boxShadow: [
              "0 4px 20px rgba(37,99,235,0.02)",
              "0 12px 40px rgba(37,99,235,0.08)",
              "0 4px 20px rgba(37,99,235,0.02)",
            ],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <BrainMark size={28} />
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Accordion Item ──────────────────────────────────────────
function AccordionItem({
  tool,
  active,
  onHover,
}: {
  tool: ToolData;
  active: boolean;
  onHover: (label: string | null) => void;
}) {
  const color = TOOL_COLORS[tool.label] || "#fff";

  return (
    <motion.div
      layout
      className="cursor-pointer border-b border-white/[0.04] transition-colors hover:bg-white/[0.03]"
      onMouseEnter={() => onHover(tool.label)}
      onMouseLeave={() => onHover(null)}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <div
          className="h-3 w-[3px] flex-shrink-0 rounded-sm"
          style={{ background: color, boxShadow: `0 0 8px ${color}60` }}
        />
        <span
          className="flex-1 text-xs font-medium transition-colors duration-300"
          style={{ color: active ? color : "rgba(255,255,255,0.9)" }}
        >
          {tool.label}
        </span>
        <motion.div
          animate={{ rotate: active ? 90 : 0 }}
          transition={{ duration: 0.3, ease: EASE }}
        >
          <ChevronRight size={12} className="text-white/30" />
        </motion.div>
      </div>
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-3 pl-[25px]">
              <p className="text-[10px] leading-relaxed text-white/60">{tool.streamPayload}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Accordion Panel ─────────────────────────────────────────
function AccordionPanel({
  tools,
  activeTool,
  onHover,
}: {
  tools: ToolData[];
  activeTool: string | null;
  onHover: (label: string | null) => void;
}) {
  return (
    <div className="absolute left-0 top-1/2 z-30 hidden w-[220px] -translate-y-1/2 overflow-y-auto border-r border-white/[0.06] bg-[#090b10]/90 backdrop-blur-xl lg:block">
      <div className="border-b border-white/[0.06] px-4 py-4">
        <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/60">
          Connected Sources
        </span>
      </div>
      {tools.map((tool) => (
        <AccordionItem
          key={tool.label}
          tool={tool}
          active={activeTool === tool.label}
          onHover={onHover}
        />
      ))}
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────
export default function IntelligenceCore() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);
  const springX = useSpring(mouseX, { stiffness: 80, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 80, damping: 20 });

  const [activeTool, setActiveTool] = useState<string | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    mouseX.set(-1000);
    mouseY.set(-1000);
    setActiveTool(null);
  };

  return (
    <div className="flex w-full flex-col gap-6">
      {/* Desktop Interactive Graph */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative hidden lg:block h-[560px] w-full overflow-hidden rounded-2xl border border-white/[0.06]"
      >
        <AmbientGrid />
        <InformationStreams />
        <AccordionPanel tools={TOOLS} activeTool={activeTool} onHover={setActiveTool} />
        {TOOLS.map((tool, i) => (
          <ToolOrb key={tool.label} tool={tool} index={i} mouseX={springX} mouseY={springY} active={activeTool === tool.label} onHover={setActiveTool} />
        ))}
        <NeuralCore mouseX={springX} mouseY={springY} />
      </div>

      {/* Mobile Stacked Sources Grid with Spacing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full lg:hidden">
        {TOOLS.map((tool) => (
          <div
            key={tool.label}
            className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#090b10]/40 p-4.5 flex items-center gap-4 transition-all duration-300 hover:border-white/10"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] font-medium text-white/85 ring-1 ring-white/[0.06]">
              {tool.icon}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-white">{tool.label}</span>
              <span className="text-xs font-mono text-white/50 mt-1">
                {tool.streamPayload}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 items-center gap-4 rounded-xl border border-white/[0.06] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.01)] md:grid-cols-2">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-blue-400">The Resolution</h4>
          <p className="mt-1 text-sm font-medium leading-relaxed text-white/70">
            SynaX targets structural information fragmentation at its core. It operates across tools, converting siloed records into an unified organizational intelligence model.
          </p>
        </div>
        <div className="flex justify-start md:justify-end">
          <a
            href="/product"
            className="group relative inline-flex min-h-[2.625rem] items-center rounded-xl p-[1.25px] overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_36px_rgba(61,123,255,0.25)]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#3d7bff] to-[#35d6ff] transition-opacity duration-300 opacity-80 group-hover:opacity-100" />
            <div className="relative z-10 flex min-h-[calc(2.625rem-2.5px)] items-center gap-2.5 rounded-[10.5px] bg-[#050505] px-4 text-[13px] font-medium text-white transition-colors duration-300 group-hover:bg-[#0d0d0d]/80">
              Explore Architecture Audits <ArrowRight size={14} className="text-white/60 transition-colors duration-300 group-hover:text-neon" />
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
