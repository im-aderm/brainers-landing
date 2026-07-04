"use client";

import { motion } from "framer-motion";
import { Fingerprint, KeyRound, Landmark, Lock, ScrollText, Server } from "lucide-react";
import { SectionHeading } from "../ui/SectionHeading";
import { Reveal, Stagger, StaggerItem } from "../ui/Reveal";

const PILLARS = [
  {
    icon: Lock,
    title: "Encrypted everywhere",
    body: "Your knowledge is encrypted in transit and at rest. Nobody reads it but you.",
  },
  {
    icon: KeyRound,
    title: "Access control",
    body: "People only ever see answers from documents they're already allowed to open.",
  },
  {
    icon: ScrollText,
    title: "Complete audit trail",
    body: "Every question, answer, and source is logged — ready for any regulator.",
  },
  {
    icon: Server,
    title: "Your own space",
    body: "Full multi-tenant isolation. Your organization's brain is yours alone.",
  },
  {
    icon: Fingerprint,
    title: "Enterprise identity",
    body: "Single sign-on with the identity provider your company already trusts.",
  },
  {
    icon: Landmark,
    title: "Built for regulated industries",
    body: "Designed with banks, insurers, and public institutions in mind from day one.",
  },
];

/** The vault: concentric shield rings breathing around a lock. */
function Vault() {
  return (
    <div className="relative mx-auto flex h-64 w-64 items-center justify-center" aria-hidden>
      {[210, 160, 112].map((size, i) => (
        <motion.div
          key={size}
          className="absolute rounded-full border"
          style={{
            width: size,
            height: size,
            borderColor: i === 2 ? "rgba(59,130,246,0.5)" : "rgba(255,255,255,0.1)",
          }}
          animate={{ scale: [1, 1.05, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 5, repeat: Infinity, delay: i * 0.7, ease: "easeInOut" }}
        />
      ))}
      {/* Rotating dashed ring — the "encryption" layer */}
      <motion.div
        className="absolute h-[240px] w-[240px] rounded-full border border-dashed border-violet/40"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />
      <div className="glass-strong relative flex h-20 w-20 items-center justify-center rounded-3xl shadow-[0_0_60px_rgba(59,130,246,0.35)]">
        <Lock size={28} className="text-accent" />
      </div>
    </div>
  );
}

export function Security() {
  return (
    <section id="security" className="relative py-32 sm:py-44">
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-full max-w-4xl -translate-x-1/2 hairline-gradient" />
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Security"
          title="Trusted with what matters most."
          subtitle="Your knowledge is your most valuable asset. BrainOS treats it that way — with bank-grade protection at every layer."
        />

        <Reveal className="mt-16">
          <Vault />
        </Reveal>

        <Stagger className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PILLARS.map((p) => (
            <StaggerItem key={p.title}>
              <div
                className="glass group h-full rounded-2xl p-6 transition-all duration-300 hover:border-edge-strong hover:bg-card-hover"
                data-cursor="hover"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-edge bg-white/[0.03] transition-colors group-hover:border-accent/40">
                  <p.icon size={18} className="text-accent" />
                </div>
                <h3 className="mt-5 text-base font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">{p.body}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
