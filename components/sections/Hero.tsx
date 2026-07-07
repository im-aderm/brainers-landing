"use client";

import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight, ArrowUpRight, BarChart3, Zap } from "lucide-react";
import { useState, useRef } from "react";
import dynamic from "next/dynamic";

const KnowledgeSphere = dynamic(() => import("../three/KnowledgeSphere"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-[radial-gradient(50%_50%_at_60%_50%,rgba(74,108,247,0.08),transparent_70%)]" />
  ),
});

const EASE = [0.22, 1, 0.36, 1] as const;

function StatCard({
  icon,
  tag,
  value,
  label,
  className,
  delay,
  scrollTransform,
}: {
  icon: React.ReactNode;
  tag: string;
  value: string;
  label: string;
  className: string;
  delay: number;
  scrollTransform?: any;
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
      initial={{ opacity: 0, y: 28, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1, delay, ease: EASE }}
      style={{ y: scrollTransform }}
      className={`absolute z-20 ${className}`}
    >
      <motion.div
        animate={{ y: [0, -9, 0] }}
        whileHover={{ y: -6, scale: 1.03 }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        data-cursor="hover"
        className="group relative w-[13.5rem] sm:w-60 p-[1px] overflow-hidden rounded-2xl transition-[box-shadow] duration-500 hover:shadow-[0_0_36px_rgba(61,123,255,0.25)]"
      >
        {/* Spinning Gradient Border Layer */}
        <div className="absolute inset-[-150%] animate-[gradient-spin_6s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_30%,#3d7bff_50%,transparent_70%,#35d6ff_90%,transparent_100%)] opacity-60 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Inner Card Frame */}
        <div className="relative z-10 w-full h-full rounded-[15px] bg-[#090b10]/95 p-4 sm:p-5 backdrop-blur-xl">
          {/* Dynamic Glass Glare Overlay */}
          {hovered && (
            <div
              className="pointer-events-none absolute inset-0 z-0 rounded-[15px] opacity-100 transition-opacity duration-300"
              style={{
                background: `radial-gradient(circle 140px at ${coords.x}px ${coords.y}px, rgba(61, 123, 255, 0.12), transparent 70%)`,
              }}
            />
          )}

          <div className="relative z-10">
            <div className="flex items-start justify-between">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-white/90 transition-colors duration-500 group-hover:border-[#3d7bff]/40 group-hover:text-[#8fd0ff]">
                {icon}
              </span>
              <ArrowUpRight
                size={16}
                className="text-white/40 transition-all duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#35d6ff]"
              />
            </div>
            <p className="mt-4 text-[10px] font-semibold uppercase tracking-wider text-electric/80">
              {tag}
            </p>
            <p className="mt-1 font-display text-3xl font-medium tracking-tight text-white sm:text-4xl">
              {value}
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-white/60">{label}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Magnetic Wrapper Component for Hero CTAs
function MagneticWrapper({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 16, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 180, damping: 16, mass: 0.6 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.28);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.28);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: sx, y: sy }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  // Scroll transforms for parallax depth
  const orbY = useTransform(scrollY, [0, 800], [0, 160]);
  const card1Y = useTransform(scrollY, [0, 800], [0, -60]);
  const card2Y = useTransform(scrollY, [0, 800], [0, -100]);
  const textY = useTransform(scrollY, [0, 800], [0, 45]);

  const lineVariants = {
    hidden: { y: "100%" },
    visible: { y: 0 },
  };

  return (
    <section ref={containerRef} className="relative overflow-hidden bg-holo">
      <div className="relative mx-auto flex min-h-svh max-w-7xl flex-col justify-center px-6 pb-8 pt-8 lg:px-10">
        {/* 3D glass orb — right side with parallax */}
        <motion.div
          style={{ y: orbY }}
          className="pointer-events-none absolute inset-y-0 right-[-14%] w-[80%] opacity-60 sm:opacity-100 lg:right-[-4%] lg:w-[54%]"
        >
          <div className="absolute inset-[6%] rounded-full bg-[radial-gradient(circle,rgba(61,123,255,0.16),rgba(21,30,71,0.14)_45%,transparent_65%)]" />
          <KnowledgeSphere />
        </motion.div>

        {/* Floating stat cards over the orb with individual parallax offsets */}
        <StatCard
          icon={<BarChart3 size={16} />}
          tag="Modeled impact"
          value="-75%"
          label="Avg. Time Searching for Answers"
          className="right-4 top-[18%] hidden sm:right-10 md:block lg:right-16"
          delay={2.7}
          scrollTransform={card1Y}
        />
        <StatCard
          icon={<Zap size={16} />}
          tag="Modeled impact"
          value="+2.3h"
          label="Saved Per Employee, Every Week"
          className="bottom-[16%] right-[34%] hidden md:block lg:right-[36%]"
          delay={2.9}
          scrollTransform={card2Y}
        />

        {/* Left column (Narrative) */}
        <motion.div style={{ y: textY }} className="relative z-10 max-w-2xl lg:pr-16">
          <motion.a
            href="/product"
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

          {/* Masked Heading with staggered entry */}
          <h1 className="mt-7 font-display text-[clamp(1.65rem,4.5vw,3.2rem)] font-medium leading-[1.2] tracking-[-0.02em] text-[#efefec]">
            <span className="relative block overflow-hidden">
              <motion.span
                className="block whitespace-nowrap"
                initial="hidden"
                animate="visible"
                variants={lineVariants}
                transition={{ duration: 1.1, delay: 1.85, ease: EASE }}
              >
                Your Company&apos;s Intelligence.
              </motion.span>
            </span>
            <span className="relative block overflow-hidden mt-1 sm:mt-2">
              <motion.span
                className="block bg-gradient-to-r from-[#3d7bff] to-[#35d6ff] bg-clip-text text-transparent whitespace-nowrap"
                initial="hidden"
                animate="visible"
                variants={lineVariants}
                transition={{ duration: 1.1, delay: 2.05, ease: EASE }}
              >
                Finally Connected.
              </motion.span>
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 26, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.1, delay: 2.25, ease: EASE }}
            className="mt-8 max-w-sm text-[15px] leading-relaxed text-white/50"
          >
            BrainersOS transforms documents, conversations, workflows,
            policies and institutional knowledge into an AI-native operating
            system that understands, reasons, remembers and acts.
          </motion.p>

          {/* Magnetic CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2.45, ease: EASE }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <MagneticWrapper>
              <a
                href="/pricing"
                data-cursor="hover"
                className="electric-gradient group inline-flex min-h-[3.25rem] items-center gap-4 rounded-2xl py-1.5 pl-6 pr-1.5 shadow-[0_0_36px_rgba(61,123,255,0.35)] transition-all duration-300 hover:shadow-[0_0_52px_rgba(61,123,255,0.5)]"
              >
                <span className="text-[15px] font-semibold text-white">
                  Book Demo
                </span>
                <span className="flex h-10 w-10 items-center justify-center rounded-[0.8rem] bg-holo text-neon transition-transform duration-300 group-hover:rotate-45">
                  <ArrowUpRight size={17} />
                </span>
              </a>
            </MagneticWrapper>

            <MagneticWrapper>
              <a
                href="/product"
                data-cursor="hover"
                className="group relative inline-flex min-h-[3.25rem] items-center rounded-2xl p-[1.25px] overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_36px_rgba(61,123,255,0.25)]"
              >
                {/* Border Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#3d7bff] to-[#35d6ff] transition-opacity duration-300 opacity-80 group-hover:opacity-100" />
                {/* Inner Button Content Mask */}
                <div className="relative z-10 flex min-h-[calc(3.25rem-2.5px)] items-center gap-3 rounded-[15px] bg-[#050505] py-[0.6rem] px-[1.725rem] text-[15px] font-medium text-white transition-colors duration-300 group-hover:bg-[#0d0d0d]/80">
                  <ArrowRight size={17} className="text-white/60 transition-colors duration-300 group-hover:text-neon" />
                  <span>Get Started Now</span>
                </div>
              </a>
            </MagneticWrapper>
          </motion.div>
        </motion.div>
      </div>
      {/* Drifting Background Glow Spheres */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{
            x: [-40, 40, -40],
            y: [-30, 30, -30],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-[-10%] top-[10%] h-[38rem] w-[38rem] rounded-full bg-accent/8 blur-[130px]"
        />
        <motion.div
          animate={{
            x: [30, -30, 30],
            y: [40, -40, 40],
            scale: [1.1, 0.9, 1.1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute right-[-10%] bottom-[10%] h-[42rem] w-[42rem] rounded-full bg-violet/6 blur-[150px]"
        />
      </div>
    </section>
  );
}
