"use client";

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useSpring,
  type MotionValue,
} from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { Brain } from "lucide-react";

// ─── Icons ─────────────────────────────────────────────────────
const SlackIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
    <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523 2.528 2.528 0 0 1-2.522-2.523 2.528 2.528 0 0 1 2.522-2.52h2.52v2.52zM6.305 15.165a2.528 2.528 0 0 1 2.52-2.52h5.043a2.528 2.528 0 0 1 2.522 2.52v5.043a2.528 2.528 0 0 1-2.522 2.52H8.825a2.528 2.528 0 0 1-2.52-2.52v-5.043z" fill="#E01E5A" />
    <path d="M8.825 5.043a2.528 2.528 0 0 1 2.52-2.52 2.528 2.528 0 0 1 2.522 2.52v2.52h-2.522a2.528 2.528 0 0 1-2.52-2.52zM8.825 6.305a2.528 2.528 0 0 1 2.52 2.52v5.043a2.528 2.528 0 0 1-2.52 2.522H3.782a2.528 2.528 0 0 1-2.52-2.522 2.528 2.528 0 0 1 2.52-2.52h5.043z" fill="#36C5F0" />
    <path d="M18.958 8.825a2.528 2.528 0 0 1 2.52-2.52 2.528 2.528 0 0 1 2.522 2.52 2.528 2.528 0 0 1-2.522 2.52h-2.52v-2.52zM17.695 8.825a2.528 2.528 0 0 1-2.52 2.52h-5.043a2.528 2.528 0 0 1-2.522-2.52V3.782a2.528 2.528 0 0 1 2.522-2.52h5.043a2.528 2.528 0 0 1 2.52 2.52v5.043z" fill="#2EB67D" />
    <path d="M15.175 18.958a2.528 2.528 0 0 1-2.52 2.52 2.528 2.528 0 0 1-2.522-2.52v-2.52h2.522a2.528 2.528 0 0 1 2.52 2.52zM15.175 17.695a2.528 2.528 0 0 1-2.52-2.52v-5.043a2.528 2.528 0 0 1 2.52-2.522h5.043a2.528 2.528 0 0 1 2.52 2.522 2.528 2.528 0 0 1-2.52 2.52h-5.043z" fill="#ECB22E" />
  </svg>
);

const NotionIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
    <path fillRule="evenodd" clipRule="evenodd" d="M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm3 4h2.5v1.2l3 3.3V7h2.5v10h-2.5v-1.2l-3-3.3V17H7V7z" fill="#ffffff" />
  </svg>
);

const GitHubIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" fill="#f0f6fc" />
  </svg>
);

const DriveIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
    <path d="M19.43 12.98L13 1.86C12.61 1.18 11.9 1.18 11.51 1.86L5.08 12.98C4.69 13.66 5.05 14.22 5.83 14.22H18.68c.78 0 1.14-.56.75-1.24z" fill="#4285F4" />
    <path d="M9.43 14.98L3 3.86C2.61 3.18 1.9 3.18 1.51 3.86L.08 14.98C-.31 15.66.05 16.22.83 16.22h12.85c.78 0 1.14-.56.75-1.24z" fill="#34A853" />
    <path d="M14.43 20.98L8 9.86C7.61 9.18 6.9 9.18 6.51 9.86L5.08 20.98C4.69 21.66 5.05 22.22 5.83 22.22h12.85c.78 0 1.14-.56.75-1.24z" fill="#FBBC05" />
  </svg>
);

const JiraIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
    <path d="M11.53 2.3a1.67 1.67 0 0 1 2.94 0l8.03 14.1a1.67 1.67 0 0 1-1.47 2.5H2.97a1.67 1.67 0 0 1-1.47-2.5z" fill="#2684FF" />
  </svg>
);

const MailIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="6" fill="#EA4335" />
    <path d="M5 7l7 5 7-5v10H5V7z" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ZoomIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="6" fill="#7C5CFC" />
    <path d="M7 10h6v4H7zm7 1l3-2.2v6.4L14 13z" fill="#FFFFFF" />
  </svg>
);

const DbIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="6" fill="#3B82F6" />
    <ellipse cx="12" cy="7" rx="5" ry="2" fill="#FFFFFF" />
    <path d="M7 7v4c0 1.1 2.2 2 5 2s5-.9 5-2V7" stroke="#FFFFFF" strokeWidth="1.5" />
    <path d="M7 12v4c0 1.1 2.2 2 5 2s5-.9 5-2v-4" stroke="#FFFFFF" strokeWidth="1.5" />
  </svg>
);

// ─── Data ──────────────────────────────────────────────────────
const TOOLS = [
  { label: "Slack", x: 18, y: 22, color: "#E01E5A", icon: <SlackIcon /> },
  { label: "Notion", x: 32, y: 15, color: "#000000", icon: <NotionIcon /> },
  { label: "GitHub", x: 78, y: 25, color: "#24292e", icon: <GitHubIcon /> },
  { label: "Drive", x: 65, y: 14, color: "#4285F4", icon: <DriveIcon /> },
  { label: "Jira", x: 15, y: 68, color: "#2684FF", icon: <JiraIcon /> },
  { label: "Email", x: 38, y: 82, color: "#EA4335", icon: <MailIcon /> },
  { label: "Meetings", x: 70, y: 78, color: "#7C5CFC", icon: <ZoomIcon /> },
  { label: "Databases", x: 85, y: 62, color: "#3B82F6", icon: <DbIcon /> },
];

const PROCESS_STEPS = [
  "Ingesting company data…",
  "Connecting knowledge silos…",
  "Building semantic graph…",
  "Understanding context…",
  "Synthesizing insights…",
  "Delivering answers…",
];

const CENTER = { x: 50, y: 50 };

// ─── Tool Orb ──────────────────────────────────────────────────
function ToolOrb({
  tool,
  index,
  mouseX,
  mouseY,
}: {
  tool: (typeof TOOLS)[number];
  index: number;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useAnimationFrame(() => {
    const mx = mouseX.get();
    const my = mouseY.get();
    const tx = (mx / window.innerWidth - 0.5) * 12;
    const ty = (my / window.innerHeight - 0.5) * 12;
    x.set(tx);
    y.set(ty);
  });

  return (
    <motion.div
      className="absolute"
      style={{ left: `${tool.x}%`, top: `${tool.y}%`, x, y }}
      initial={{ opacity: 0, scale: 0.6 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.08 * index }}
    >
      <motion.div
        animate={{ y: [0, -10, 0], rotate: [-3, 3, -3] }}
        transition={{ duration: 5.5 + index, repeat: Infinity, ease: "easeInOut" }}
        className="group flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl transition-all hover:border-white/30 hover:bg-white/10"
      >
        <div className="text-2xl transition-transform group-hover:scale-110">{tool.icon}</div>
      </motion.div>
      <div className="absolute left-1/2 top-full mt-3 -translate-x-1/2 whitespace-nowrap text-[10px] font-mono uppercase tracking-widest text-white/40">
        {tool.label}
      </div>
    </motion.div>
  );
}

// ─── Knowledge Streams ─────────────────────────────────────────
function KnowledgeStreams() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      {TOOLS.map((tool, i) => {
        const d = `M ${tool.x} ${tool.y} Q 50 ${tool.y - 8} ${CENTER.x} ${CENTER.y}`;
        return (
          <g key={i}>
            <path d={d} stroke="rgba(147,197,253,0.08)" strokeWidth="0.8" fill="none" />
            <motion.circle
              r="1.1"
              fill="#60a5fa"
              style={{ offsetPath: `path("${d}")` }}
              animate={{ offsetDistance: ["0%", "100%"] }}
              transition={{
                duration: 3.2 + i * 0.25,
                repeat: Infinity,
                ease: "linear",
                delay: i * 0.1,
              }}
            />
          </g>
        );
      })}
    </svg>
  );
}

// ─── Brainers Core ─────────────────────────────────────────────
function BrainersCore({ currentStep }: { currentStep: string }) {
  return (
    <motion.div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-400/20"
          animate={{ scale: [1, 2.8], opacity: [0.6, 0] }}
          transition={{ duration: 4 - i * 0.6, repeat: Infinity, delay: i * 0.8 }}
        />
      ))}

      <motion.div
        className="relative flex h-24 w-24 items-center justify-center rounded-full border border-blue-400/30 bg-gradient-to-b from-slate-950 to-black shadow-[0_0_80px_rgb(96,165,250,0.25)]"
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <Brain size={48} className="text-blue-400" />

        <motion.div
          className="absolute inset-3 rounded-full border border-dashed border-blue-400/30"
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>

      <motion.div
        key={currentStep}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="absolute left-1/2 top-full mt-8 -translate-x-1/2 whitespace-nowrap"
      >
        <div className="rounded-full border border-blue-500/20 bg-blue-500/5 px-6 py-2 text-sm font-medium tracking-wide text-blue-400">
          {currentStep}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Particle Field ────────────────────────────────────────────
function ParticleField({
  mouseX,
  mouseY,
}: {
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const particles = useMemo(
    () =>
      Array.from({ length: 280 }, () => ({
        x: Math.random() * 1200,
        y: Math.random() * 700,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 1.8 + 0.6,
        opacity: Math.random() * 0.25 + 0.08,
      })),
    [],
  );

  useAnimationFrame(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const mx = mouseX.get();
    const my = mouseY.get();

    particles.forEach((p) => {
      const dx = mx - p.x;
      const dy = my - p.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 180) {
        p.vx -= (dx / dist) * 0.018;
        p.vy -= (dy / dist) * 0.018;
      }

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      p.vx += (cx - p.x) * 0.00008;
      p.vy += (cy - p.y) * 0.00008;

      p.vx *= 0.975;
      p.vy *= 0.975;
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(147, 197, 253, ${p.opacity})`;
      ctx.fill();
    });
  });

  return <canvas ref={canvasRef} className="absolute inset-0" />;
}

// ─── Main Export ───────────────────────────────────────────────
export default function IntelligenceCore() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);
  const springX = useSpring(mouseX, { stiffness: 70, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 70, damping: 25 });

  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((i) => (i + 1) % PROCESS_STEPS.length);
    }, 2600);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
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
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative h-[720px] w-full overflow-hidden rounded-3xl border border-white/10 bg-[#05070a] backdrop-blur-2xl"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.08),transparent_70%)]" />
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <ParticleField mouseX={springX} mouseY={springY} />
      <KnowledgeStreams />

      {TOOLS.map((tool, i) => (
        <ToolOrb key={tool.label} tool={tool} index={i} mouseX={springX} mouseY={springY} />
      ))}

      <BrainersCore currentStep={PROCESS_STEPS[stepIndex]} />

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center">
        <div className="mb-2 text-xs uppercase tracking-[3px] text-blue-400/70">
          Unified Company Intelligence
        </div>
        <div className="text-4xl font-semibold text-white">
          Brainers<span className="text-blue-400">.</span>
        </div>
        <p className="mt-3 max-w-md text-sm text-white/60">
          One brain for all your company knowledge
        </p>
      </div>
    </div>
  );
}
