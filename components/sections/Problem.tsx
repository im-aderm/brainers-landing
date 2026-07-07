"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  animate as motionAnimate,
} from "framer-motion";
import {
  FileX,
  Telescope,
  GitBranch,
  UserX,
  Scale,
  Search,
} from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

type ToolNode = {
  label: string;
  color: string;
  x: number;
  y: number;
  drift: number;
  duration: number;
  svg: React.ReactNode;
};

// Custom high-fidelity brand SVGs for the drifting islands
const SlackIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
    <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523 2.528 2.528 0 0 1-2.522-2.523 2.528 2.528 0 0 1 2.522-2.52h2.52v2.52zM6.305 15.165a2.528 2.528 0 0 1 2.52-2.52h5.043a2.528 2.528 0 0 1 2.522 2.52v5.043a2.528 2.528 0 0 1-2.522 2.52H8.825a2.528 2.528 0 0 1-2.52-2.52v-5.043z" fill="#E01E5A" />
    <path d="M8.825 5.043a2.528 2.528 0 0 1 2.52-2.52 2.528 2.528 0 0 1 2.522 2.52v2.52h-2.522a2.528 2.528 0 0 1-2.52-2.52zM8.825 6.305a2.528 2.528 0 0 1 2.52 2.52v5.043a2.528 2.528 0 0 1-2.52 2.522H3.782a2.528 2.528 0 0 1-2.52-2.522 2.528 2.528 0 0 1 2.52-2.52h5.043z" fill="#36C5F0" />
    <path d="M18.958 8.825a2.528 2.528 0 0 1 2.52-2.52 2.528 2.528 0 0 1 2.522 2.52 2.528 2.528 0 0 1-2.522 2.52h-2.52v-2.52zM17.695 8.825a2.528 2.528 0 0 1-2.52 2.52h-5.043a2.528 2.528 0 0 1-2.522-2.52V3.782a2.528 2.528 0 0 1 2.522-2.52h5.043a2.528 2.528 0 0 1 2.52 2.52v5.043z" fill="#2EB67D" />
    <path d="M15.175 18.958a2.528 2.528 0 0 1-2.52 2.52 2.528 2.528 0 0 1-2.522-2.52v-2.52h2.522a2.528 2.528 0 0 1 2.52 2.52zM15.175 17.695a2.528 2.528 0 0 1-2.52-2.52v-5.043a2.528 2.528 0 0 1 2.52-2.522h5.043a2.528 2.528 0 0 1 2.52 2.522 2.528 2.528 0 0 1-2.52 2.52h-5.043z" fill="#ECB22E" />
  </svg>
);

const NotionIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
    <path fillRule="evenodd" clipRule="evenodd" d="M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm3 4h2.5v1.2l3 3.3V7h2.5v10h-2.5v-1.2l-3-3.3V17H7V7z" fill="#FFFFFF" />
  </svg>
);

const DriveIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
    <path d="M19.43 12.98L13 1.86C12.61 1.18 11.9 1.18 11.51 1.86L5.08 12.98C4.69 13.66 5.05 14.22 5.83 14.22H18.68c.78 0 1.14-.56.75-1.24z" fill="#4285F4" />
    <path d="M9.43 14.98L3 3.86C2.61 3.18 1.9 3.18 1.51 3.86L.08 14.98C-.31 15.66.05 16.22.83 16.22h12.85c.78 0 1.14-.56.75-1.24z" fill="#34A853" />
    <path d="M14.43 20.98L8 9.86C7.61 9.18 6.9 9.18 6.51 9.86L5.08 20.98C4.69 21.66 5.05 22.22 5.83 22.22h12.85c.78 0 1.14-.56.75-1.24z" fill="#FBBC05" />
  </svg>
);

const GitHubIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" fill="#B8C2D1" />
  </svg>
);

const JiraIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
    <path d="M11.53 2.3a1.67 1.67 0 0 1 2.94 0l8.03 14.1a1.67 1.67 0 0 1-1.47 2.5H2.97a1.67 1.67 0 0 1-1.47-2.5z" fill="#2684FF" />
  </svg>
);

const MailIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="6" fill="#EA4335" />
    <path d="M5 7l7 5 7-5v10H5V7z" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ZoomIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="6" fill="#7C5CFC" />
    <path d="M7 10h6v4H7zm7 1l3-2.2v6.4L14 13z" fill="#FFFFFF" />
  </svg>
);

const DbIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="6" fill="#3B82F6" />
    <ellipse cx="12" cy="7" rx="5" ry="2" fill="#FFFFFF" />
    <path d="M7 7v4c0 1.1 2.2 2 5 2s5-.9 5-2V7" stroke="#FFFFFF" strokeWidth="1.5" />
    <path d="M7 12v4c0 1.1 2.2 2 5 2s5-.9 5-2v-4" stroke="#FFFFFF" strokeWidth="1.5" />
  </svg>
);

const TOOLS: ToolNode[] = [
  { label: "Slack", color: "#E01E5A", x: 10, y: 24, drift: -7, duration: 7.5, svg: <SlackIcon /> },
  { label: "Notion", color: "#FFFFFF", x: 31, y: 8, drift: 6, duration: 9, svg: <NotionIcon /> },
  { label: "Google Drive", color: "#4285F4", x: 60, y: 11, drift: -5, duration: 8, svg: <DriveIcon /> },
  { label: "GitHub", color: "#B8C2D1", x: 86, y: 22, drift: 8, duration: 10, svg: <GitHubIcon /> },
  { label: "Jira", color: "#2684FF", x: 8, y: 70, drift: 6, duration: 8.5, svg: <JiraIcon /> },
  { label: "Emails", color: "#EA4335", x: 33, y: 86, drift: -6, duration: 9.5, svg: <MailIcon /> },
  { label: "Meetings", color: "#7C5CFC", x: 63, y: 82, drift: 7, duration: 7, svg: <ZoomIcon /> },
  { label: "Databases", color: "#3B82F6", x: 88, y: 66, drift: -8, duration: 10.5, svg: <DbIcon /> },
];

const CENTER = { x: 50, y: 47 };

const CONSEQUENCES = [
  { icon: FileX, label: "Duplicated work", detail: "Same problem, solved twice" },
  { icon: Telescope, label: "Knowledge loss", detail: "Expertise leaves with people" },
  { icon: GitBranch, label: "Inconsistent decisions", detail: "Teams act on different facts" },
  { icon: UserX, label: "Slow onboarding", detail: "Months to find the context" },
  { icon: Scale, label: "Compliance risks", detail: "No single source of truth" },
];

function StatCounter({ target, suffix }: { target: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const reduce = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setValue(target);
      return;
    }
    const controls = motionAnimate(0, target, {
      duration: 1.8,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, target, reduce]);

  return (
    <span ref={ref} className="tabular-nums">
      {value}
      {suffix}
    </span>
  );
}

function SeveredLine({
  from,
  to,
  index,
  reduce,
  isHovered,
  color,
}: {
  from: { x: number; y: number };
  to: { x: number; y: number };
  index: number;
  reduce: boolean | null;
  isHovered: boolean;
  color: string;
}) {
  const breakT = 0.62;
  const bx = from.x + (to.x - from.x) * breakT;
  const by = from.y + (to.y - from.y) * breakT;

  const gradId = `sever-${index}`;

  return (
    <g>
      <defs>
        <linearGradient
          id={gradId}
          gradientUnits="userSpaceOnUse"
          x1={from.x}
          y1={from.y}
          x2={to.x}
          y2={to.y}
        >
          {isHovered ? (
            <>
              <stop offset="0%" stopColor={color} stopOpacity={1} />
              <stop offset="100%" stopColor={color} stopOpacity={0.8} />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="rgba(255,255,255,0.18)" />
              <stop offset="35%" stopColor="rgba(255,255,255,0.06)" />
              <stop offset="60%" stopColor="rgba(255,255,255,0)" />
            </>
          )}
        </linearGradient>
      </defs>

      {/* Connection Line (Extends to hub, but fades out to transparent when not hovered) */}
      <motion.line
        x1={from.x}
        y1={from.y}
        x2={to.x}
        y2={to.y}
        stroke={`url(#${gradId})`}
        strokeWidth={isHovered ? 1.5 : 1}
        strokeDasharray={isHovered ? "4 3" : "3 4"}
        vectorEffect="non-scaling-stroke"
        animate={reduce ? {} : {
          strokeDashoffset: [0, isHovered ? -20 : -14],
        }}
        // @ts-ignore
        transition={{
          strokeDashoffset: {
            duration: isHovered ? 1.6 : 2.8,
            repeat: Infinity,
            ease: "linear",
          },
        }}
      />

      {/* Outward Request Pulse & Red Bounce Back Signal (Looping visual story of query failure) */}
      {!reduce && (
        <>
          {isHovered ? (
            // Solid healthy connection flow towards the center hub
            <motion.circle
              r={1.5}
              fill={color}
              initial={{ cx: from.x, cy: from.y }}
              animate={{
                cx: [from.x, to.x],
                cy: [from.y, to.y],
              }}
              transition={{
                duration: 1.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ) : (
            // Interrupted connection loop: white outward query turns to red warning upon hitting the red X, then returns
            <motion.circle
              r={1}
              initial={{ cx: to.x, cy: to.y }}
              animate={{
                cx: [to.x, bx, to.x],
                cy: [to.y, by, to.y],
                fill: ["rgba(255,255,255,0.7)", "rgba(239,68,68,0.95)", "rgba(239,68,68,0.95)"],
              }}
              transition={{
                duration: 2.8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.22,
              }}
            />
          )}
        </>
      )}

      {/* Pulsing Red Star/Cross (Only when not hovered, flashes in sync with return bounce) */}
      {!isHovered && (
        <motion.g
          animate={{
            scale: [1, 1.28, 1],
            opacity: [0.35, 0.95, 0.35],
          }}
          transition={{
            duration: 2.8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.22,
          }}
          style={{ transformOrigin: `${bx}px ${by}px` }}
        >
          <line
            x1={bx - 1.1}
            y1={by - 1.1}
            x2={bx + 1.1}
            y2={by + 1.1}
            stroke="rgba(239,68,68,0.9)"
            strokeWidth={1.2}
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
          />
          <line
            x1={bx + 1.1}
            y1={by - 1.1}
            x2={bx - 1.1}
            y2={by + 1.1}
            stroke="rgba(239,68,68,0.9)"
            strokeWidth={1.2}
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
          />
        </motion.g>
      )}
    </g>
  );
}

function ScatterMap() {
  const reduce = useReducedMotion();
  const [hoveredTool, setHoveredTool] = useState<number | null>(null);

  return (
    <div className="relative mx-auto mt-16 h-[420px] w-full max-w-4xl sm:h-[480px]">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/5 blur-[110px]" />

      {/* Connection Lines */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {TOOLS.map((t, i) => (
          <SeveredLine
            key={t.label}
            from={{ x: t.x, y: t.y }}
            to={CENTER}
            index={i}
            reduce={reduce}
            isHovered={hoveredTool === i}
            color={t.color}
          />
        ))}
      </svg>

      {/* Central query node */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2"
        style={{ left: `${CENTER.x}%`, top: `${CENTER.y}%` }}
      >
        {!reduce &&
          [0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-red-500/25"
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: 2.6, opacity: [0, 0.4, 0] }}
              transition={{
                duration: 3.2,
                delay: i * 1.05,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
          ))}

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4, ease: EASE }}
          className="glass relative flex items-center gap-2.5 rounded-2xl border border-red-500/20 bg-red-500/[0.02] px-4 py-3 shadow-[0_0_40px_rgba(239,68,68,0.12)]"
        >
          <Search size={16} className="shrink-0 text-red-500 animate-pulse" />
          <span className="whitespace-nowrap text-sm font-medium text-white/95">
            Where is the answer?
          </span>
        </motion.div>
      </div>

      {/* Drifting tool islands (Upgraded to true custom SVG brand icons) */}
      {TOOLS.map((tool, i) => (
        <div
          key={tool.label}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${tool.x}%`, top: `${tool.y}%` }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 + i * 0.09, ease: EASE }}
          >
            <motion.div
              {...(!reduce && {
                animate: { y: [0, tool.drift, 0], x: [0, tool.drift * -0.4, 0] },
                transition: {
                  duration: tool.duration,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              })}
              whileHover={{ scale: 1.08 }}
              onMouseEnter={() => setHoveredTool(i)}
              onMouseLeave={() => setHoveredTool(null)}
              className="glass group relative flex h-11 w-11 items-center justify-center rounded-xl border border-edge transition-all duration-500 hover:border-white/20 hover:bg-white/[0.04] hover:shadow-[0_0_24px_rgba(255,255,255,0.06)]"
              data-cursor="hover"
            >
              {/* Brand SVG container */}
              <div className="relative z-10 flex h-full w-full items-center justify-center">
                {tool.svg}
              </div>

              {/* Dynamic Aura background on hover */}
              <div
                className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-10 pointer-events-none"
                style={{ background: tool.color }}
              />

              {/* Tool Name tooltip */}
              <span className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-md border border-edge bg-ink/90 px-2 py-1 text-[10px] text-text-secondary opacity-0 backdrop-blur transition-opacity duration-300 group-hover:opacity-100">
                {tool.label}
              </span>
            </motion.div>
          </motion.div>
        </div>
      ))}
    </div>
  );
}

function ConsequenceCard({
  icon: Icon,
  label,
  detail,
  index,
  reduce,
}: {
  icon: typeof FileX;
  label: string;
  detail: string;
  index: number;
  reduce: boolean | null;
}) {
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
    <motion.div
      initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.15 + index * 0.1, ease: EASE }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="glass group relative flex flex-col gap-2.5 overflow-hidden rounded-xl border border-edge bg-white/[0.02] p-4 transition-all duration-500 hover:border-[#f5a524]/30 hover:shadow-[0_0_24px_rgba(245,165,36,0.08)]"
      data-cursor="hover"
    >
      {hovered && (
        <div
          className="pointer-events-none absolute inset-0 z-0 rounded-xl opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle 100px at ${coords.x}px ${coords.y}px, rgba(245, 165, 36, 0.08), transparent 70%)`,
          }}
        />
      )}

      <div className="relative z-10 flex flex-col gap-2.5 h-full">
        <Icon size={16} className="shrink-0 text-warning transition-transform duration-300 group-hover:scale-110" />
        <div>
          <p className="text-sm font-medium text-white/85 transition-colors duration-300 group-hover:text-white">{label}</p>
          <p className="mt-1 text-xs leading-relaxed text-text-muted">
            {detail}
          </p>
        </div>

        {/* Compounding-cost bar */}
        <div className="mt-auto h-px w-full overflow-hidden rounded-full bg-white/[0.06]">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: 1.2,
              delay: 0.5 + index * 0.12,
              ease: EASE,
            }}
            style={{ originX: 0, width: `${45 + index * 13}%` }}
            className="h-full bg-gradient-to-r from-warning/60 to-warning/20"
          />
        </div>
      </div>
    </motion.div>
  );
}

export function Problem() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden py-32 sm:py-44">
      {/* Aligns exactly to Hero max-w-7xl width */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-full max-w-7xl -translate-x-1/2 hairline-gradient" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        {/* Eyebrow & heading */}
        <motion.div
          initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.9, ease: EASE }}
          className="flex flex-col items-center text-center"
        >
          <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-text-secondary">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.9)]" />
            The problem
          </span>
          <h2 className="mt-5 max-w-3xl text-balance text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            Your company&apos;s intelligence is
            <br />
            <span className="gradient-text">scattered across islands</span>
          </h2>
          <p className="mt-6 max-w-xl text-balance text-base leading-relaxed text-text-secondary">
            Every tool holds a fragment of the truth. None of them talk to each
            other — and every question becomes an expedition.
          </p>
        </motion.div>

        {/* Signature infographic: the scatter map */}
        <ScatterMap />

        {/* The cost — big animated stat with glowing warning accent */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8% 0px" }}
          transition={{ duration: 0.9, ease: EASE }}
          className="mt-20 flex flex-col items-center text-center"
        >
          <div className="flex items-baseline gap-1 text-6xl font-semibold tracking-tight sm:text-7xl">
            <span className="gradient-text text-glow shadow-[0_0_40px_rgba(245,165,36,0.2)]">
              <StatCounter target={19} suffix="%" />
            </span>
          </div>
          <p className="mt-3 max-w-md text-balance text-sm leading-relaxed text-text-secondary">
            of the average workweek is spent just searching for and gathering
            information — nearly a full day, every week, per employee.
          </p>
          <p className="mt-2 text-xs uppercase tracking-[0.18em] text-text-muted">
            Source: McKinsey Global Institute
          </p>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: EASE }}
          className="mx-auto mt-16 h-px w-32 origin-center bg-gradient-to-r from-transparent via-red-500/25 to-transparent"
        />

        {/* Consequences — cascading cost cards */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8% 0px" }}
          transition={{ duration: 0.9, ease: EASE }}
          className="mt-12"
        >
          <p className="text-center text-sm font-medium uppercase tracking-[0.22em] text-text-muted">
            And the cost compounds
          </p>

          <div className="mx-auto mt-8 grid max-w-4xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {CONSEQUENCES.map((c, i) => (
              <ConsequenceCard
                key={c.label}
                icon={c.icon}
                label={c.label}
                detail={c.detail}
                index={i}
                reduce={reduce}
              />
            ))}
          </div>
        </motion.div>

        {/* Caption */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.8, ease: EASE }}
          className="mt-12 text-center text-sm italic text-text-muted"
        >
          Eight tools. Zero shared memory.
        </motion.p>
      </div>
    </section>
  );
}