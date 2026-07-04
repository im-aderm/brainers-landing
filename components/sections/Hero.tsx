"use client";

import { motion } from "framer-motion";
import { ArrowDown, ArrowRight, ArrowUpRight, BarChart3, Zap } from "lucide-react";
import dynamic from "next/dynamic";

const GlassBlob = dynamic(() => import("../three/GlassBlob"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-[radial-gradient(50%_50%_at_60%_50%,rgba(181,248,76,0.08),transparent_70%)]" />
  ),
});

const InlineKnot = dynamic(() => import("../three/InlineKnot"), { ssr: false });

const EASE = [0.22, 1, 0.36, 1] as const;

const AVATARS = [
  ["#e8c39a", "#8a5a33"],
  ["#b7c9e0", "#3d5573"],
  ["#c9e0b7", "#4d6b35"],
];

function StatCard({
  icon,
  value,
  label,
  className,
  delay,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  className: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1, delay, ease: EASE }}
      className={`absolute z-20 ${className}`}
    >
      <motion.div
        animate={{ y: [0, -9, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay }}
        className="w-[13.5rem] rounded-2xl border border-white/[0.08] bg-holo-card/85 p-4 backdrop-blur-xl sm:w-60 sm:p-5"
      >
        <div className="flex items-start justify-between">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-white/90">
            {icon}
          </span>
          <ArrowUpRight size={16} className="text-white/40" />
        </div>
        <p className="mt-5 font-display text-3xl font-medium tracking-tight text-white sm:text-4xl">
          {value}
        </p>
        <p className="mt-1.5 text-xs leading-relaxed text-white/45">{label}</p>
      </motion.div>
    </motion.div>
  );
}

export function Hero() {
  return (
    <section
      className="relative p-2 sm:p-2.5"
      style={{ background: "linear-gradient(160deg, #c3d9a8, #c4ddca)" }}
    >
      <div className="relative flex min-h-[calc(100svh-1.25rem)] flex-col overflow-hidden rounded-[24px] bg-holo px-5 pb-8 pt-24 sm:rounded-[28px] sm:px-10 sm:pt-28 lg:px-14">
        {/* 3D glass orb — right side */}
        <div className="pointer-events-none absolute inset-y-0 right-[-14%] w-[80%] opacity-60 sm:opacity-100 lg:right-[1%] lg:w-[52%]">
          <div className="absolute inset-[6%] rounded-full bg-[radial-gradient(circle,rgba(140,220,150,0.12),transparent_62%)]" />
          <GlassBlob />
        </div>

        {/* Floating stat cards over the orb */}
        <StatCard
          icon={<BarChart3 size={16} />}
          value="-75%"
          label="Avg. Time Searching for Answers"
          className="right-4 top-[18%] hidden sm:right-10 md:block lg:right-16"
          delay={2.7}
        />
        <StatCard
          icon={<Zap size={16} />}
          value="+2.3h"
          label="Saved Per Employee, Every Week"
          className="bottom-[16%] right-[34%] hidden md:block lg:right-[36%]"
          delay={2.9}
        />

        {/* Left column */}
        <div className="relative z-10 max-w-2xl">
          <motion.a
            href="#how-it-works"
            initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.9, delay: 1.7, ease: EASE }}
            data-cursor="hover"
            className="inline-flex items-center gap-3 rounded-full border border-lime/15 bg-lime/[0.06] py-1.5 pl-1.5 pr-4 transition-colors duration-300 hover:bg-lime/[0.1]"
          >
            <span className="rounded-full bg-lime px-2.5 py-1 text-[11px] font-semibold leading-none text-holo">
              New
            </span>
            <span className="text-[13px] font-medium text-lime/80">
              The Enterprise AI Operating System
            </span>
            <ArrowRight size={14} className="text-lime" />
          </motion.a>

          <motion.h1
            initial={{ opacity: 0, y: 34, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.2, delay: 1.85, ease: EASE }}
            className="mt-7 font-display text-[clamp(2.4rem,4.9vw,4.4rem)] font-medium leading-[1.06] tracking-[-0.02em] text-[#efefec]"
          >
            <span className="whitespace-nowrap">
              Your{" "}
              <span className="inline-block h-[0.62em] w-[1.6em] translate-y-[0.04em] align-baseline">
                <InlineKnot />
              </span>{" "}
              Company&apos;s
            </span>
            <br />
            Intelligence.
            <br />
            <span className="whitespace-nowrap">Finally Connected.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 26, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.1, delay: 2.1, ease: EASE }}
            className="mt-8 max-w-sm text-[15px] leading-relaxed text-white/50"
          >
            BrainOS turns every document, policy, and conversation in your
            company into one intelligent brain — answers anyone can trust.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2.3, ease: EASE }}
            className="mt-9 flex flex-wrap items-center gap-7"
          >
            <a
              href="#cta"
              data-cursor="hover"
              className="group inline-flex items-center gap-4 rounded-2xl bg-lime py-1.5 pl-6 pr-1.5 transition-transform duration-300 hover:scale-[1.03]"
            >
              <span className="text-[15px] font-semibold text-holo">
                Request Demo
              </span>
              <span className="flex h-10 w-10 items-center justify-center rounded-[0.8rem] bg-holo text-lime transition-transform duration-300 group-hover:rotate-45">
                <ArrowUpRight size={17} />
              </span>
            </a>
            <a
              href="#how-it-works"
              data-cursor="hover"
              className="text-[15px] font-medium text-white transition-colors duration-300 hover:text-lime"
            >
              Watch 2-Minute Overview
            </a>
          </motion.div>
        </div>

        {/* Bottom row: social proof + scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 2.6 }}
          className="relative z-10 mt-auto flex items-end justify-between pt-16"
        >
          <div>
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2.5">
                {AVATARS.map(([a, b], i) => (
                  <span
                    key={i}
                    className="h-9 w-9 rounded-full border-2 border-holo"
                    style={{
                      background: `radial-gradient(circle at 35% 30%, ${a}, ${b})`,
                    }}
                  />
                ))}
              </div>
              <span className="font-display text-3xl font-medium tracking-tight text-white sm:text-4xl">
                220K+
              </span>
            </div>
            <p className="mt-3 max-w-[13rem] text-[13px] leading-relaxed text-white/40">
              documents connected into one company brain
            </p>
          </div>

          <a
            href="#problem"
            data-cursor="hover"
            className="hidden items-center gap-2 text-[13px] text-white/40 transition-colors duration-300 hover:text-white sm:inline-flex"
          >
            Scroll to explore
            <motion.span
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowDown size={14} />
            </motion.span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
