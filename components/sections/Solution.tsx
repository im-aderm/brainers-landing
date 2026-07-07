"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ExternalLink,
} from "lucide-react";
import { SectionHeading } from "../ui/SectionHeading";
import { Reveal } from "../ui/Reveal";
import { BrainMark } from "../ui/BrainMark";

const EASE = [0.22, 1, 0.36, 1] as const;

type SynapseProps = {
  d: string;
  color: string;
  isHovered: boolean;
  reduce: boolean | null;
  delay?: number;
};

function Synapse({ d, color, isHovered, reduce, delay = 0 }: SynapseProps) {
  return (
    <g>
      {/* Background connection track */}
      <motion.path
        d={d}
        stroke={isHovered ? color : "rgba(255,255,255,0.06)"}
        strokeWidth={isHovered ? 1.5 : 1}
        strokeDasharray="3 4"
        fill="none"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay, ease: "easeOut" }}
        animate={!reduce ? {
          strokeDashoffset: [0, -14],
        } : {}}
        style={{ transition: "stroke 0.3s, stroke-width 0.3s" }}
        // @ts-ignore
        transition={{
          strokeDashoffset: { duration: 2.2, repeat: Infinity, ease: "linear" },
          pathLength: { duration: 1.2, delay, ease: "easeOut" }
        }}
      />

      {/* Overlaid Data Pulse Stream */}
      {!reduce && (
        <motion.path
          d={d}
          stroke={color}
          strokeWidth={isHovered ? 2 : 1.25}
          strokeDasharray="8 80"
          fill="none"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          animate={{
            strokeDashoffset: [0, -88],
            opacity: isHovered ? 0.95 : 0.45,
          }}
          style={{ transition: "stroke-width 0.3s, opacity 0.3s" }}
          // @ts-ignore
          transition={{
            strokeDashoffset: { duration: 3.5, repeat: Infinity, ease: "linear", delay: delay },
            opacity: { duration: 0.3 },
            pathLength: { duration: 1.2, delay, ease: "easeOut" }
          }}
        />
      )}
    </g>
  );
}

// Brand SVG Components to match the Stripe reference image
const MailchimpLogo = () => (
  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="6" fill="#FFE500" />
    <path d="M12 5c-3.86 0-7 3.14-7 7s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm-1 9.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" fill="#000000" />
  </svg>
);

const XeroLogo = () => (
  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="6" fill="#13B5EA" />
    <circle cx="12" cy="12" r="4" stroke="#FFFFFF" strokeWidth="2" />
  </svg>
);

const ZoomLogo = () => (
  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="6" fill="#2D8CFF" />
    <circle cx="10" cy="12" r="3" fill="#FFFFFF" />
    <path d="M14 9.5l3.5-2.5v10l-3.5-2.5v-5z" fill="#FFFFFF" />
  </svg>
);

const HubSpotLogo = () => (
  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="6" fill="#FF5C35" />
    <circle cx="10" cy="14" r="2.5" fill="#FFFFFF" />
    <circle cx="15" cy="9" r="1.5" fill="#FFFFFF" />
    <line x1="10" y1="14" x2="15" y2="9" stroke="#FFFFFF" strokeWidth="1.5" />
  </svg>
);

const QuickBooksLogo = () => (
  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="6" fill="#2CA01C" />
    <path d="M7 7h5v5H7zM12 12h5v5h-5z" fill="#FFFFFF" />
  </svg>
);

export function Solution() {
  const [hoveredBranch, setHoveredBranch] = useState<string | null>(null);
  const reduce = useReducedMotion();

  const width = 1000;
  const height = 450;

  const nodes = {
    hub: { x: 500, y: 220 },
    
    // Top Branch: SDK & Destinations
    topBranchLeft: { x: 380, y: 110, label: "SDK", color: "#7c5cfc" },
    topBranchRight: { x: 620, y: 110, label: "Event Destinations", color: "#7c5cfc" },
    topLeaves: [
      { x: 230, y: 40, label: "", dashed: true },
      { x: 310, y: 40, label: "CRM" },
      { x: 440, y: 40, label: "", dashed: true },
      { x: 560, y: 40, label: "", dashed: true },
      { x: 690, y: 40, label: "Booking System" },
    ],

    // Left Branch: App Marketplace
    leftBranch: { x: 330, y: 220, label: "App Marketplace", color: "#3b82f6" },

    // Right Branch: Data Pipeline
    rightBranch: { x: 670, y: 220, label: "Data Pipeline", color: "#35d6ff" },
    rightLeaf: { x: 880, y: 220, label: "Data Destination" },

    // Bottom Branch: Orchestration
    bottomBranch: { x: 500, y: 330, label: "Orchestration", color: "#18c964" },
    bottomLeaves: [
      { x: 330, y: 400, label: "", dashed: true },
      { x: 440, y: 400, label: "", dashed: true },
      { x: 560, y: 400, label: "", dashed: true },
      { x: 670, y: 400, label: "", dashed: true },
    ],
  };

  return (
    <section className="relative overflow-hidden py-32 sm:py-44">
      {/* Visual Alignment Lines */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-full max-w-7xl -translate-x-1/2 hairline-gradient opacity-40" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeading
          eyebrow="The Solution"
          title="Introducing BrainersOS."
          subtitle="Instead of disconnected islands... everything connects into a single corporate intelligence layer."
        />

        <Reveal className="mt-20" y={32}>
          {/* Main Infographic Grid / Canvas */}
          <div className="relative mx-auto w-full overflow-hidden rounded-3xl border border-edge bg-[#05070a]/60 p-4 sm:p-8">
            
            {/* Dot grid background */}
            <div className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)",
                backgroundSize: "20px 20px"
              }}
            />

            {/* SVG Link Map (Dotted Synapses) - Only visible on desktop/tablet */}
            <div className="relative hidden lg:block w-full aspect-[1000/450]">
              <svg
                className="absolute inset-0 h-full w-full pointer-events-none"
                viewBox={`0 0 ${width} ${height}`}
                aria-hidden="true"
              >
                <g>
                  {/* Top Links (SDK / Destinations) */}
                  <Synapse
                    d={`M ${nodes.hub.x} ${nodes.hub.y} L ${nodes.topBranchLeft.x} ${nodes.topBranchLeft.y}`}
                    color={nodes.topBranchLeft.color}
                    isHovered={hoveredBranch === "top"}
                    reduce={reduce}
                    delay={0.2}
                  />
                  <Synapse
                    d={`M ${nodes.hub.x} ${nodes.hub.y} L ${nodes.topBranchRight.x} ${nodes.topBranchRight.y}`}
                    color={nodes.topBranchRight.color}
                    isHovered={hoveredBranch === "top"}
                    reduce={reduce}
                    delay={0.2}
                  />

                  {/* Connect top branch paths to leaves */}
                  <path
                    d={`M ${nodes.topBranchLeft.x} ${nodes.topBranchLeft.y} L ${nodes.topBranchLeft.x} ${nodes.topBranchLeft.y - 20} L ${nodes.topLeaves[1].x} ${nodes.topBranchLeft.y - 20} L ${nodes.topLeaves[1].x} ${nodes.topLeaves[1].y + 15}`}
                    stroke={hoveredBranch === "top" ? "#7c5cfc" : "rgba(255,255,255,0.06)"}
                    strokeWidth={hoveredBranch === "top" ? 1.5 : 1}
                    strokeDasharray="3 3"
                    fill="none"
                  />
                  <path
                    d={`M ${nodes.topBranchLeft.x} ${nodes.topBranchLeft.y} L ${nodes.topBranchLeft.x} ${nodes.topBranchLeft.y - 20} L ${nodes.topLeaves[0].x} ${nodes.topBranchLeft.y - 20} L ${nodes.topLeaves[0].x} ${nodes.topLeaves[0].y + 15}`}
                    stroke="rgba(255,255,255,0.04)"
                    strokeWidth={1}
                    strokeDasharray="3 3"
                    fill="none"
                  />
                  <path
                    d={`M ${nodes.topBranchRight.x} ${nodes.topBranchRight.y} L ${nodes.topBranchRight.x} ${nodes.topBranchRight.y - 20} L ${nodes.topLeaves[4].x} ${nodes.topBranchRight.y - 20} L ${nodes.topLeaves[4].x} ${nodes.topLeaves[4].y + 15}`}
                    stroke={hoveredBranch === "top" ? "#7c5cfc" : "rgba(255,255,255,0.06)"}
                    strokeWidth={hoveredBranch === "top" ? 1.5 : 1}
                    strokeDasharray="3 3"
                    fill="none"
                  />

                  {/* Left Branch Link */}
                  <Synapse
                    d={`M ${nodes.hub.x} ${nodes.hub.y} L ${nodes.leftBranch.x} ${nodes.leftBranch.y}`}
                    color={nodes.leftBranch.color}
                    isHovered={hoveredBranch === "left"}
                    reduce={reduce}
                    delay={0.25}
                  />
                  <path
                    d={`M ${nodes.leftBranch.x} ${nodes.leftBranch.y} L ${nodes.leftBranch.x - 110} ${nodes.leftBranch.y}`}
                    stroke={hoveredBranch === "left" ? "#3b82f6" : "rgba(255,255,255,0.06)"}
                    strokeWidth={hoveredBranch === "left" ? 1.5 : 1}
                    strokeDasharray="3 3"
                    fill="none"
                  />

                  {/* Right Branch Link */}
                  <Synapse
                    d={`M ${nodes.hub.x} ${nodes.hub.y} L ${nodes.rightBranch.x} ${nodes.rightBranch.y}`}
                    color={nodes.rightBranch.color}
                    isHovered={hoveredBranch === "right"}
                    reduce={reduce}
                    delay={0.25}
                  />
                  <path
                    d={`M ${nodes.rightBranch.x} ${nodes.rightBranch.y} L ${nodes.rightLeaf.x} ${nodes.rightLeaf.y}`}
                    stroke={hoveredBranch === "right" ? "#35d6ff" : "rgba(255,255,255,0.06)"}
                    strokeWidth={hoveredBranch === "right" ? 1.5 : 1}
                    strokeDasharray="3 3"
                    fill="none"
                  />

                  {/* Bottom Branch Links */}
                  <Synapse
                    d={`M ${nodes.hub.x} ${nodes.hub.y} L ${nodes.bottomBranch.x} ${nodes.bottomBranch.y}`}
                    color={nodes.bottomBranch.color}
                    isHovered={hoveredBranch === "bottom"}
                    reduce={reduce}
                    delay={0.2}
                  />
                  {nodes.bottomLeaves.map((leaf, idx) => (
                    <path
                      key={idx}
                      d={`M ${nodes.bottomBranch.x} ${nodes.bottomBranch.y} L ${nodes.bottomBranch.x} ${nodes.bottomBranch.y + 20} L ${leaf.x} ${nodes.bottomBranch.y + 20} L ${leaf.x} ${leaf.y - 15}`}
                      stroke="rgba(255,255,255,0.04)"
                      strokeWidth={1}
                      strokeDasharray="3 3"
                      fill="none"
                    />
                  ))}
                </g>
              </svg>

              {/* Central Hub: BrainersOS */}
              <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.85, delay: 0.1, ease: EASE }}
                className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center animate-[pulse-soft_6s_ease-in-out_infinite]"
                style={{ left: `${(nodes.hub.x / width) * 100}%`, top: `${(nodes.hub.y / height) * 100}%` }}
              >
                <div className="absolute h-36 w-36 rounded-full bg-accent/10 blur-2xl pointer-events-none" />
                <div className="relative flex flex-col items-center justify-center rounded-2xl border border-accent/40 bg-holo p-5 shadow-[0_0_36px_rgba(61,123,255,0.18)]">
                  <BrainMark size={36} />
                  <span className="mt-2 text-xs font-semibold tracking-tight text-white select-none">brainersos</span>
                </div>
              </motion.div>

              {/* TOP LEFT BRANCH: SDK */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.75, delay: 0.4, ease: EASE }}
                onMouseEnter={() => setHoveredBranch("top")}
                onMouseLeave={() => setHoveredBranch(null)}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
                style={{ left: `${(nodes.topBranchLeft.x / width) * 100}%`, top: `${(nodes.topBranchLeft.y / height) * 100}%` }}
              >
                <div className={`glass px-5 py-1.5 rounded-lg border text-xs font-semibold text-white/95 transition-all duration-300 hover:scale-105 ${
                  hoveredBranch === "top" ? "border-violet/40 bg-violet/10 shadow-[0_0_20px_rgba(124,92,252,0.2)]" : "border-edge bg-holo-card"
                }`}>
                  {nodes.topBranchLeft.label}
                </div>
              </motion.div>

              {/* TOP RIGHT BRANCH: Event Destinations */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.75, delay: 0.4, ease: EASE }}
                onMouseEnter={() => setHoveredBranch("top")}
                onMouseLeave={() => setHoveredBranch(null)}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
                style={{ left: `${(nodes.topBranchRight.x / width) * 100}%`, top: `${(nodes.topBranchRight.y / height) * 100}%` }}
              >
                <div className={`glass px-5 py-1.5 rounded-lg border text-xs font-semibold text-white/95 transition-all duration-300 hover:scale-105 ${
                  hoveredBranch === "top" ? "border-violet/40 bg-violet/10 shadow-[0_0_20px_rgba(124,92,252,0.2)]" : "border-edge bg-holo-card"
                }`}>
                  {nodes.topBranchRight.label}
                </div>
              </motion.div>

              {/* Top Leaves (Dashed placeholder nodes + Active system targets) */}
              {nodes.topLeaves.map((leaf, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.6 + idx * 0.08, ease: EASE }}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${(leaf.x / width) * 100}%`, top: `${(leaf.y / height) * 100}%` }}
                >
                  {leaf.dashed ? (
                    <div className="h-8 w-16 rounded-lg border border-dashed border-white/5 bg-transparent" />
                  ) : (
                    <div className={`glass rounded-lg border px-4 py-1.5 text-[10px] font-semibold text-white/80 transition-colors duration-300 ${
                      hoveredBranch === "top" ? "border-violet/20 bg-violet/[0.04] text-white" : "border-edge bg-holo-card"
                    }`}>
                      {leaf.label}
                    </div>
                  )}
                </motion.div>
              ))}

              {/* LEFT BRANCH: App Marketplace */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.75, delay: 0.45, ease: EASE }}
                onMouseEnter={() => setHoveredBranch("left")}
                onMouseLeave={() => setHoveredBranch(null)}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
                style={{ left: `${(nodes.leftBranch.x / width) * 100}%`, top: `${(nodes.leftBranch.y / height) * 100}%` }}
              >
                <div className={`glass flex items-center gap-2 px-5 py-2.5 rounded-xl border text-xs font-semibold text-white/95 transition-all duration-300 hover:scale-105 ${
                  hoveredBranch === "left" ? "border-accent/40 bg-accent/10 shadow-[0_0_20px_rgba(59,130,246,0.2)]" : "border-edge"
                }`}>
                  <span>{nodes.leftBranch.label}</span>
                  <ExternalLink size={12} className="text-white/40" />
                </div>
              </motion.div>
              
              {/* Left Ecosystem Grid Card - EXACT Match to Zoom/Xero/HubSpot/Mailchimp Layout */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.75, ease: EASE }}
                className="absolute -translate-x-1/2 -translate-y-1/2 grid grid-cols-3 gap-2.5 rounded-xl border border-edge bg-[#080a0f]/90 p-3.5 transition-colors duration-300"
                style={{ left: `${((nodes.leftBranch.x - 170) / width) * 100}%`, top: `${(nodes.leftBranch.y / height) * 100}%` }}
              >
                <div className="flex h-8 w-8 items-center justify-center"><MailchimpLogo /></div>
                <div className="flex h-8 w-8 items-center justify-center"><XeroLogo /></div>
                <div className="flex h-8 w-8 items-center justify-center"><ZoomLogo /></div>
                <div className="flex h-8 w-8 items-center justify-center"><HubSpotLogo /></div>
                <div className="flex h-8 w-8 items-center justify-center border border-white/5 rounded-lg bg-white/[0.02]">
                  <span className="text-[10px] text-white/50 font-bold">CRM</span>
                </div>
                <div className="flex h-8 w-8 items-center justify-center"><QuickBooksLogo /></div>
              </motion.div>

              {/* RIGHT BRANCH: Data Pipeline */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.75, delay: 0.45, ease: EASE }}
                onMouseEnter={() => setHoveredBranch("right")}
                onMouseLeave={() => setHoveredBranch(null)}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
                style={{ left: `${(nodes.rightBranch.x / width) * 100}%`, top: `${(nodes.rightBranch.y / height) * 100}%` }}
              >
                <div className={`glass px-5 py-2.5 rounded-xl border text-xs font-semibold text-white/95 transition-all duration-300 hover:scale-105 ${
                  hoveredBranch === "right" ? "border-neon/40 bg-neon/10 shadow-[0_0_20px_rgba(53,214,255,0.2)]" : "border-edge"
                }`}>
                  {nodes.rightBranch.label}
                </div>
              </motion.div>
              
              {/* Right database node - EXACT Match to Horizontal Red/Green/Blue cylinder DB stack */}
              <motion.div
                initial={{ opacity: 0, scale: 0.75 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.8, ease: EASE }}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${(nodes.rightLeaf.x / width) * 100}%`, top: `${(nodes.rightLeaf.y / height) * 100}%` }}
              >
                <div className={`flex h-11 w-11 flex-col justify-center items-center gap-1 rounded-xl border bg-white p-2 text-space shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all duration-300 ${
                  hoveredBranch === "right" ? "border-neon shadow-[0_0_24px_rgba(53,214,255,0.25)]" : "border-edge"
                }`}>
                  {/* Database Cylinders */}
                  <span className="h-1.5 w-7 rounded-sm bg-red-500" />
                  <span className="h-1.5 w-7 rounded-sm bg-green-500" />
                  <span className="h-1.5 w-7 rounded-sm bg-blue-500" />
                </div>
              </motion.div>

              {/* BOTTOM BRANCH: Orchestration */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.75, delay: 0.4, ease: EASE }}
                onMouseEnter={() => setHoveredBranch("bottom")}
                onMouseLeave={() => setHoveredBranch(null)}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
                style={{ left: `${(nodes.bottomBranch.x / width) * 100}%`, top: `${(nodes.bottomBranch.y / height) * 100}%` }}
              >
                <div className={`glass px-5 py-2.5 rounded-xl border text-xs font-semibold text-white/95 transition-all duration-300 hover:scale-105 ${
                  hoveredBranch === "bottom" ? "border-success/40 bg-success/10 shadow-[0_0_20px_rgba(24,201,100,0.2)]" : "border-edge"
                }`}>
                  {nodes.bottomBranch.label}
                </div>
              </motion.div>
              {/* Bottom Leaves (4 dashed slots matching Stripe template) */}
              {nodes.bottomLeaves.map((leaf, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.7 + idx * 0.1, ease: EASE }}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${(leaf.x / width) * 100}%`, top: `${(leaf.y / height) * 100}%` }}
                >
                  <div className="h-10 w-16 rounded-xl border border-dashed border-white/5 bg-transparent" />
                </motion.div>
              ))}
            </div>

            {/* Mobile Representation */}
            <div className="block lg:hidden space-y-6">
              <div className="flex flex-col items-center py-6 border-b border-edge">
                <BrainMark size={44} />
                <span className="mt-2.5 text-sm font-semibold tracking-tight text-white">BrainersOS Hub</span>
              </div>
              {[
                { title: "App Connectors (Ecosystem)", color: "border-accent text-accent", desc: "Integrates with Mailchimp, Xero, Zoom, HubSpot, and QuickBooks out of the box." },
                { title: "SDK & Destinations", color: "border-violet text-violet", desc: "Allows developers to connect custom CRM and Booking platforms easily." },
                { title: "Data Pipeline", color: "border-neon text-neon", desc: "Syncs structured and unstructured knowledge graphs into query indices." },
                { title: "Orchestration Engine", color: "border-success text-success", desc: "Drives autonomous workflow actions and API routing layers." }
              ].map((item, i) => (
                <div key={i} className="glass p-5 rounded-2xl border border-edge">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full bg-current ${item.color}`} />
                    <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-text-muted">{item.desc}</p>
                </div>
              ))}
            </div>

          </div>
        </Reveal>
      </div>
      {/* Solution Section Ambient Backdrop Glows */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/8 blur-[120px]" />
    </section>
  );
}
