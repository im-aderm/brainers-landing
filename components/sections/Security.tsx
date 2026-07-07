"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Fingerprint, KeyRound, Landmark, Lock, Unlock, ScrollText, Server, CheckCircle2 } from "lucide-react";
import { SectionHeading } from "../ui/SectionHeading";
import { Reveal, Stagger, StaggerItem } from "../ui/Reveal";

const EASE = [0.22, 1, 0.36, 1] as const;

const PILLARS = [
  {
    icon: Lock,
    title: "Encrypted everywhere",
    body: "Your knowledge is encrypted in transit and at rest. Nobody reads it but you.",
    color: "#3b82f6",
  },
  {
    icon: KeyRound,
    title: "Access control",
    body: "People only ever see answers from documents they're already allowed to open.",
    color: "#7c5cfc",
  },
  {
    icon: ScrollText,
    title: "Complete audit trail",
    body: "Every question, answer, and source is logged — ready for any regulator.",
    color: "#35d6ff",
  },
  {
    icon: Server,
    title: "Your own space",
    body: "Full multi-tenant isolation. Your organization's brain is yours alone.",
    color: "#18c964",
  },
  {
    icon: Fingerprint,
    title: "Enterprise identity",
    body: "Single sign-on with the identity provider your company already trusts.",
    color: "#f5a524",
  },
  {
    icon: Landmark,
    title: "Regulated industry spec",
    body: "Designed with banks, insurers, and public institutions in mind from day one.",
    color: "#ec4899",
  },
];

function VaultConsole() {
  const [isLocked, setIsLocked] = useState(true);
  const reduce = useReducedMotion();

  return (
    <div className="glass-strong relative flex flex-col items-center justify-center rounded-3xl border border-edge bg-[#05070a]/80 p-8 shadow-[0_40px_100px_rgba(0,0,0,0.6)]">
      <div className="hairline-gradient absolute inset-x-0 top-0" />
      
      {/* Console Header */}
      <div className="mb-6 flex w-full items-center justify-between border-b border-edge pb-4">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">Security System Active</span>
        </div>
        <span className="text-[10px] font-mono text-text-muted">AES-256 GCM</span>
      </div>

      {/* Vault Core Visual */}
      <div className="relative flex h-60 w-60 items-center justify-center select-none" aria-hidden>
        {[200, 150, 105].map((size, i) => (
          <motion.div
            key={size}
            className="absolute rounded-full border"
            style={{
              width: size,
              height: size,
              borderColor: i === 2 ? "rgba(59,130,246,0.3)" : "rgba(255,255,255,0.06)",
            }}
            animate={{ scale: [1, 1.04, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 5, repeat: Infinity, delay: i * 0.7, ease: "easeInOut" }}
          />
        ))}

        {/* Rotating dashed ring */}
        <motion.div
          className="absolute h-[220px] w-[220px] rounded-full border border-dashed border-violet/30"
          animate={{ rotate: 360 }}
          transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
        />

        {/* Interactive Lock Core Button */}
        <motion.button
          onClick={() => setIsLocked(!isLocked)}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          className="glass-strong relative z-10 flex h-20 w-20 items-center justify-center rounded-3xl shadow-[0_0_40px_rgba(59,130,246,0.25)] border border-white/10 cursor-pointer"
        >
          <motion.div
            animate={reduce ? {} : {
              scale: isLocked ? [1, 1.08, 1] : [1, 1.15, 0.95, 1],
              rotate: isLocked ? 0 : [0, -20, 20, 0],
            }}
            // @ts-ignore
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            {isLocked ? (
              <Lock size={26} className="text-accent" />
            ) : (
              <Unlock size={26} className="text-success" />
            )}
          </motion.div>
        </motion.button>
      </div>

      {/* Status metrics panel */}
      <div className="mt-6 grid w-full grid-cols-2 gap-4 border-t border-edge pt-5 text-center">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-text-muted">Database State</p>
          <p className="mt-1 text-sm font-semibold text-white">100% Isolated</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-text-muted">Access Protocol</p>
          <p className="mt-1 text-sm font-semibold text-white">OAuth2 / OIDC</p>
        </div>
      </div>
    </div>
  );
}

function SecurityCard({
  pillar,
}: {
  pillar: typeof PILLARS[0];
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

  const Icon = pillar.icon;

  return (
    <StaggerItem>
      <div
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="group relative h-full rounded-2xl p-[1px] overflow-hidden transition-all duration-300 hover:shadow-[0_12px_32px_rgba(0,0,0,0.45)]"
        data-cursor="hover"
      >
        {/* Animated glowing border layer (Only visible on hover) */}
        <div
          className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `linear-gradient(135deg, ${pillar.color}, transparent 60%)`,
          }}
        />

        {/* Inner Content Card */}
        <div className="relative z-10 h-full rounded-[15px] bg-[#080a0f]/95 p-6 backdrop-blur-xl transition-colors duration-300 group-hover:bg-[#0c0e14]/90">
          
          {/* Dynamic Spotlight Glow effect */}
          {hovered && (
            <div
              className="pointer-events-none absolute inset-0 z-0 rounded-[15px] opacity-100 transition-opacity duration-300"
              style={{
                background: `radial-gradient(circle 120px at ${coords.x}px ${coords.y}px, ${pillar.color}12, transparent 70%)`,
              }}
            />
          )}

          {/* Card Header Info */}
          <div className="relative z-10 flex items-center justify-between">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-edge bg-white/[0.02] transition-all duration-300"
              style={{ borderColor: hovered ? `${pillar.color}40` : "" }}
            >
              <Icon size={18} style={{ color: hovered ? pillar.color : "rgba(255,255,255,0.4)" }} className="transition-colors duration-300" />
            </div>
            <span className="opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <CheckCircle2 size={14} className="text-success" />
            </span>
          </div>

          {/* Card Content */}
          <div className="relative z-10 mt-5">
            <h3 className="text-base font-semibold text-white/90 group-hover:text-white transition-colors duration-300">
              {pillar.title}
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-text-secondary">
              {pillar.body}
            </p>
          </div>
        </div>
      </div>
    </StaggerItem>
  );
}

export function Security() {
  return (
    <section id="security" className="relative py-32 sm:py-44">
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-full max-w-7xl -translate-x-1/2 hairline-gradient" />
      
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeading
          eyebrow="Security"
          title="Trusted with what matters most."
          subtitle="Your knowledge is your most valuable asset. BrainersOS treats it that way — with bank-grade protection at every layer."
        />

        <div className="mt-20 grid items-center gap-12 lg:grid-cols-[1fr_1.8fr]">
          <Reveal className="w-full" y={32}>
            <VaultConsole />
          </Reveal>

          <Stagger className="grid gap-4 sm:grid-cols-2">
            {PILLARS.map((p, idx) => (
              <SecurityCard key={p.title} pillar={p} />
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
