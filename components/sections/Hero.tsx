"use client";

import { motion } from "framer-motion";
import { ArrowDown, ArrowRight, ArrowUpRight, BarChart3, PlayCircle, Zap } from "lucide-react";
import dynamic from "next/dynamic";

const KnowledgeSphere = dynamic(() => import("../three/KnowledgeSphere"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-[radial-gradient(50%_50%_at_60%_50%,rgba(74,108,247,0.08),transparent_70%)]" />
  ),
});

const EASE = [0.22, 1, 0.36, 1] as const;

const AVATARS = [
  ["#e8c39a", "#8a5a33"],
  ["#b7c9e0", "#3d5573"],
  ["#cbb7e0", "#5b3d73"],
];

function StatCard({
  icon,
  tag,
  value,
  label,
  className,
  delay,
}: {
  icon: React.ReactNode;
  tag: string;
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
        whileHover={{ y: -6, scale: 1.03 }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay }}
        data-cursor="hover"
        className="group w-[13.5rem] rounded-2xl border border-white/[0.08] bg-holo-card/85 p-4 backdrop-blur-xl transition-[border-color,box-shadow] duration-500 hover:border-[#3d7bff]/45 hover:shadow-[0_0_36px_rgba(61,123,255,0.22)] sm:w-60 sm:p-5"
      >
        <div className="flex items-start justify-between">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-white/90 transition-colors duration-500 group-hover:border-[#3d7bff]/40 group-hover:text-[#8fd0ff]">
            {icon}
          </span>
          <ArrowUpRight size={16} className="text-white/40 transition-all duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#35d6ff]" />
        </div>
        <p className="mt-4 text-[10px] font-semibold uppercase tracking-wider text-electric/80">
          {tag}
        </p>
        <p className="mt-1 font-display text-3xl font-medium tracking-tight text-white sm:text-4xl">
          {value}
        </p>
        <p className="mt-1.5 text-xs leading-relaxed text-white/60">{label}</p>
      </motion.div>
    </motion.div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-holo">
      <div className="relative mx-auto flex min-h-svh max-w-7xl flex-col px-6 pb-8 pt-24 sm:pt-28 lg:px-10">
        {/* 3D glass orb — right side */}
        <div className="pointer-events-none absolute inset-y-0 right-[-14%] w-[80%] opacity-60 sm:opacity-100 lg:right-[-4%] lg:w-[54%]">
          <div className="absolute inset-[6%] rounded-full bg-[radial-gradient(circle,rgba(61,123,255,0.16),rgba(21,30,71,0.14)_45%,transparent_65%)]" />
          <KnowledgeSphere />
        </div>

        {/* Floating stat cards over the orb */}
        <StatCard
          icon={<BarChart3 size={16} />}
          tag="Modeled impact"
          value="-75%"
          label="Avg. Time Searching for Answers"
          className="right-4 top-[18%] hidden sm:right-10 md:block lg:right-16"
          delay={2.7}
        />
        <StatCard
          icon={<Zap size={16} />}
          tag="Modeled impact"
          value="+2.3h"
          label="Saved Per Employee, Every Week"
          className="bottom-[16%] right-[34%] hidden md:block lg:right-[36%]"
          delay={2.9}
        />

        {/* Left column */}
        <div className="relative z-10 max-w-3xl">
          <motion.a
            href="#how-it-works"
            initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.9, delay: 1.7, ease: EASE }}
            data-cursor="hover"
            className="inline-flex items-center gap-3 rounded-full border border-electric/20 bg-electric/[0.07] py-2 pl-1.5 pr-5 transition-colors duration-300 hover:bg-electric/[0.12]"
          >
            <span className="electric-gradient rounded-full px-2.5 py-1 text-[11px] font-semibold leading-none text-white">
              New
            </span>
            <span className="text-sm font-medium text-[#a9c2ff]">
              The Enterprise AI Operating System
            </span>
            <ArrowRight size={14} className="text-neon" />
          </motion.a>

          <motion.h1
            initial={{ opacity: 0, y: 34, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.2, delay: 1.85, ease: EASE }}
            className="mt-7 font-display text-[clamp(2.2rem,4.3vw,3.8rem)] font-medium leading-[1.1] tracking-[-0.02em] text-[#efefec]"
          >
            <span className="sm:whitespace-nowrap">Your Company&apos;s Intelligence.</span>
            <br />
            <span className="whitespace-nowrap">Finally Connected.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 26, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.1, delay: 2.1, ease: EASE }}
            className="mt-8 max-w-sm text-[15px] leading-relaxed text-white/50"
          >
            BrainersOS is the intelligence operating system that turns every
            document, message, and decision in your company into one
            connected brain — so any team, and any AI, can reason from the
            same truth.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2.3, ease: EASE }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <a
              href="#cta"
              data-cursor="hover"
              className="electric-gradient group inline-flex items-center gap-4 rounded-2xl py-1.5 pl-6 pr-1.5 shadow-[0_0_36px_rgba(61,123,255,0.35)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_52px_rgba(61,123,255,0.5)]"
            >
              <span className="text-[15px] font-semibold text-white">
                Request Demo
              </span>
              <span className="flex h-10 w-10 items-center justify-center rounded-[0.8rem] bg-holo text-neon transition-transform duration-300 group-hover:rotate-45">
                <ArrowUpRight size={17} />
              </span>
            </a>
            <a
              href="#how-it-works"
              data-cursor="hover"
              className="group inline-flex items-center gap-3 rounded-2xl border border-white/15 py-[0.6rem] pl-6 pr-6 text-[15px] font-medium text-white transition-all duration-300 hover:border-white/30 hover:bg-white/[0.04]"
            >
              <PlayCircle size={17} className="text-white/60 transition-colors duration-300 group-hover:text-neon" />
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
              <span className="font-display text-2xl font-medium tracking-tight text-white sm:text-3xl">
                Every document.
              </span>
            </div>
            <p className="mt-3 max-w-[14rem] text-[13px] leading-relaxed text-white/55">
              Built to connect everything your organization has ever written
              — no exceptions.
            </p>
          </div>

          <a
            href="#problem"
            data-cursor="hover"
            className="hidden items-center gap-2 text-[13px] text-white/50 transition-colors duration-300 hover:text-white sm:inline-flex"
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
