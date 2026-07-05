"use client";

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { Activity, Database, FileCheck, Workflow } from "lucide-react";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { SectionHeading } from "../ui/SectionHeading";
import { Reveal } from "../ui/Reveal";

function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration: 2,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, to]);

  return (
    <span ref={ref}>
      {value.toLocaleString()}
      {suffix}
    </span>
  );
}

const STATS = [
  { icon: Database, label: "Documents understood", value: 128460, suffix: "" },
  { icon: Workflow, label: "Relationships mapped", value: 2400000, suffix: "" },
  { icon: FileCheck, label: "Policies tracked", value: 1240, suffix: "" },
  { icon: Activity, label: "Answer accuracy", value: 98, suffix: "%" },
];

/** Knowledge-growth curve, drawn on scroll. */
function GrowthChart() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const d = "M0,150 C60,140 90,120 140,105 C200,86 240,88 300,62 C350,40 400,30 460,12";

  return (
    <svg ref={ref} viewBox="0 0 460 160" fill="none" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="growth-stroke" x1="0" y1="0" x2="460" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3B82F6" />
          <stop offset="1" stopColor="#7C5CFC" />
        </linearGradient>
        <linearGradient id="growth-fill" x1="0" y1="0" x2="0" y2="160" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3B82F6" stopOpacity="0.22" />
          <stop offset="1" stopColor="#3B82F6" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 1, 2, 3].map((i) => (
        <line key={i} x1="0" x2="460" y1={20 + i * 40} y2={20 + i * 40} stroke="rgba(255,255,255,0.05)" />
      ))}
      <motion.path
        d={`${d} L460,160 L0,160 Z`}
        fill="url(#growth-fill)"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 1.4, duration: 1 }}
      />
      <motion.path
        d={d}
        stroke="url(#growth-stroke)"
        strokeWidth="2.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={inView ? { pathLength: 1 } : {}}
        transition={{ duration: 2.2, ease: [0.65, 0, 0.35, 1] }}
      />
      <motion.circle
        cx="460"
        cy="12"
        r="4"
        fill="#7C5CFC"
        initial={{ opacity: 0, scale: 0 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ delay: 2, duration: 0.4 }}
        style={{ filter: "drop-shadow(0 0 8px rgba(124,92,252,0.9))" }}
      />
    </svg>
  );
}

const JOBS = [
  { name: "Google Drive sync", status: "Running", tone: "text-accent" },
  { name: "Policy re-index", status: "Complete", tone: "text-success" },
  { name: "Slack ingestion", status: "Running", tone: "text-accent" },
];

/**
 * The command deck: a glass dashboard that tilts gently toward the cursor,
 * with live counters, a knowledge-growth curve and running jobs.
 */
export function Dashboard() {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useSpring(useTransform(rx, [-0.5, 0.5], [5, -5]), { stiffness: 120, damping: 18 });
  const rotateY = useSpring(useTransform(ry, [-0.5, 0.5], [-6, 6]), { stiffness: 120, damping: 18 });

  function onMove(e: MouseEvent) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    rx.set((e.clientY - rect.top) / rect.height - 0.5);
    ry.set((e.clientX - rect.left) / rect.width - 0.5);
  }
  function onLeave() {
    rx.set(0);
    ry.set(0);
  }

  return (
    <section className="relative mx-auto max-w-6xl px-6 py-32 sm:py-44">
      <SectionHeading
        eyebrow="Enterprise intelligence"
        title="Watch your organization get smarter."
        subtitle="A single view of everything BrainersOS has learned — what's connected, what's growing, and what needs attention."
      />

      <Reveal className="mt-16 [perspective:1600px]" y={48}>
        <motion.div
          ref={ref}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="glass-strong relative overflow-hidden rounded-3xl p-6 shadow-[0_60px_160px_rgba(0,0,0,0.55)] sm:p-8"
        >
          <div className="hairline-gradient absolute inset-x-0 top-0" />
          <div className="pointer-events-none absolute -right-32 -top-32 h-72 w-72 rounded-full bg-violet/12 blur-[100px]" />

          {/* Stat row */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" style={{ transform: "translateZ(30px)" }}>
            {STATS.map((s) => (
              <div key={s.label} className="glass rounded-2xl p-5" data-cursor="hover">
                <s.icon size={17} className="text-accent" />
                <p className="mt-4 text-2xl font-semibold tracking-tight">
                  <CountUp to={s.value} suffix={s.suffix} />
                </p>
                <p className="mt-1 text-xs text-text-muted">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[1.6fr_1fr]" style={{ transform: "translateZ(20px)" }}>
            {/* Growth chart */}
            <div className="glass rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-text-secondary">Knowledge growth</p>
                <span className="text-[11px] uppercase tracking-[0.18em] text-text-muted">
                  Last 12 months
                </span>
              </div>
              <div className="mt-4 h-40">
                <GrowthChart />
              </div>
            </div>

            {/* Jobs */}
            <div className="glass rounded-2xl p-5">
              <p className="text-sm font-medium text-text-secondary">Ingestion jobs</p>
              <ul className="mt-4 space-y-3">
                {JOBS.map((job) => (
                  <li
                    key={job.name}
                    className="flex items-center justify-between rounded-xl border border-edge bg-white/[0.02] px-4 py-3"
                  >
                    <span className="text-xs text-text-secondary">{job.name}</span>
                    <span className={`flex items-center gap-1.5 text-[11px] font-medium ${job.tone}`}>
                      {job.status === "Running" && (
                        <motion.span
                          className="h-1.5 w-1.5 rounded-full bg-current"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1.6, repeat: Infinity }}
                        />
                      )}
                      {job.status}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 rounded-xl border border-edge bg-gradient-to-br from-accent/10 to-violet/10 px-4 py-3">
                <p className="text-[11px] leading-relaxed text-text-secondary">
                  <span className="font-semibold text-white">2,141 new connections</span> discovered
                  in your knowledge graph this week.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </Reveal>
    </section>
  );
}
