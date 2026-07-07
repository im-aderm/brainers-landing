"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  FileText,
  GitBranch,
  ShieldCheck,
  User,
  Shield,
  Terminal,
  Share2,
} from "lucide-react";
import { useState } from "react";
import { SectionHeading } from "../ui/SectionHeading";
import { Reveal } from "../ui/Reveal";

const EASE = [0.22, 1, 0.36, 1] as const;

type GraphNodeType = "document" | "policy" | "person" | "system";

type GraphNode = {
  id: string;
  label: string;
  type: GraphNodeType;
  x: number; // percentage
  y: number; // percentage
  detail: string;
};

const NODES: GraphNode[] = [
  {
    id: "compliance-policy",
    label: "Compliance Policy v4",
    type: "policy",
    x: 50,
    y: 50,
    detail: "Main governance framework updated for fiscal year 2026. Governs onboarding steps.",
  },
  {
    id: "aml-regulation",
    label: "AML Regulation 2025",
    type: "policy",
    x: 32,
    y: 28,
    detail: "Statutory requirements detailing threshold screening limits for international transfers.",
  },
  {
    id: "kyc-procedure",
    label: "KYC Procedure",
    type: "policy",
    x: 68,
    y: 28,
    detail: "Operational guide detailing customer identification verification pipelines.",
  },
  {
    id: "head-compliance",
    label: "Head of Compliance",
    type: "person",
    x: 50,
    y: 20,
    detail: "Senior owner responsible for signoff and audit trails of KYC compliance overrides.",
  },
  {
    id: "banking-api",
    label: "Core Banking API Spec",
    type: "document",
    x: 22,
    y: 50,
    detail: "Technical specifications defining transaction trigger boundaries and hooks.",
  },
  {
    id: "slack-ops",
    label: "Slack #operations",
    type: "system",
    x: 78,
    y: 50,
    detail: "Communication stream logging live alerts and compliance override signals.",
  },
  {
    id: "jira-atlas",
    label: "Jira — Project Atlas",
    type: "system",
    x: 32,
    y: 72,
    detail: "Task pipeline tracking core infrastructure modifications and engineering reviews.",
  },
  {
    id: "risk-minutes",
    label: "Risk Committee Minutes",
    type: "document",
    x: 68,
    y: 72,
    detail: "Formal record of decision parameters regarding lowered screening limits.",
  },
  {
    id: "cto-office",
    label: "CTO Office",
    type: "person",
    x: 50,
    y: 80,
    detail: "Engineering stakeholder authorizing API infrastructure deployments.",
  },
];

const EDGES: Array<[string, string]> = [
  ["compliance-policy", "head-compliance"],
  ["compliance-policy", "aml-regulation"],
  ["compliance-policy", "kyc-procedure"],
  ["compliance-policy", "banking-api"],
  ["compliance-policy", "slack-ops"],
  ["compliance-policy", "jira-atlas"],
  ["compliance-policy", "risk-minutes"],
  ["compliance-policy", "cto-office"],
  ["aml-regulation", "head-compliance"],
  ["kyc-procedure", "slack-ops"],
  ["banking-api", "jira-atlas"],
  ["risk-minutes", "cto-office"],
];

const TYPE_META: Record<GraphNodeType, { label: string; color: string; icon: any }> = {
  document: { label: "Document", color: "#3b82f6", icon: FileText },
  policy: { label: "Policy", color: "#7c5cfc", icon: Shield },
  person: { label: "Owner", color: "#18c964", icon: User },
  system: { label: "System", color: "#f5a524", icon: Terminal },
};

export function KnowledgeGraphSection() {
  const [activeId, setActiveId] = useState<string | null>(null);

  const activeNode = NODES.find((n) => n.id === activeId) || null;

  // Helper to check if an edge connects to the active node
  const isEdgeHighlighted = (fromId: string, toId: string) => {
    if (!activeId) return false;
    return fromId === activeId || toId === activeId;
  };

  return (
    <section id="knowledge-graph" className="relative py-32 sm:py-44">
      {/* Ambient glow behind the graph */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/5 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeading
          eyebrow="The knowledge graph"
          title="See how everything your company knows connects."
          subtitle="Every document, policy, owner, and system — mapped as living relationships. Hover a node to light up what it touches."
        />

        <div className="mt-16 grid items-start gap-8 lg:grid-cols-[1.5fr_1fr]">
          {/* Relationship Map (Interactive SVG/HTML Canvas) */}
          <Reveal className="relative" blur={false}>
            <div className="relative h-[460px] overflow-hidden rounded-3xl border border-edge bg-[#05070a]/60 sm:h-[520px]">
              
              {/* Dot grid backdrop */}
              <div className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)",
                  backgroundSize: "24px 24px"
                }}
              />

              {/* Edge Connection Layer */}
              <svg className="absolute inset-0 h-full w-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                {EDGES.map(([fromId, toId], idx) => {
                  const fromNode = NODES.find((n) => n.id === fromId)!;
                  const toNode = NODES.find((n) => n.id === toId)!;
                  const isHighlighted = isEdgeHighlighted(fromId, toId);
                  
                  // Color defaults to faint white/blue unless highlighted by active node's color
                  let strokeColor = "rgba(255,255,255,0.06)";
                  if (isHighlighted && activeNode) {
                    strokeColor = TYPE_META[activeNode.type].color;
                  }

                  return (
                    <g key={idx}>
                      <line
                        x1={fromNode.x}
                        y1={fromNode.y}
                        x2={toNode.x}
                        y2={toNode.y}
                        stroke={strokeColor}
                        strokeWidth={isHighlighted ? 0.6 : 0.25}
                        strokeDasharray={isHighlighted ? "none" : "1 1"}
                        className="transition-colors duration-300"
                      />
                      {isHighlighted && (
                        <motion.line
                          x1={fromNode.x}
                          y1={fromNode.y}
                          x2={toNode.x}
                          y2={toNode.y}
                          stroke={strokeColor}
                          strokeWidth={0.8}
                          strokeDasharray="2 12"
                          animate={{ strokeDashoffset: [0, -14] }}
                          // @ts-ignore
                          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        />
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* Floating Responsive Node Chips */}
              {NODES.map((node) => {
                const meta = TYPE_META[node.type];
                const Icon = meta.icon;
                const isSelected = activeId === node.id;
                const isHighlightedNeighbor = activeId
                  ? EDGES.some(([from, to]) => (from === activeId && to === node.id) || (to === activeId && from === node.id))
                  : false;

                return (
                  <motion.button
                    key={node.id}
                    onMouseEnter={() => setActiveId(node.id)}
                    onMouseLeave={() => setActiveId(null)}
                    onClick={() => setActiveId(node.id)}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
                    style={{ left: `${node.x}%`, top: `${node.y}%` }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <div
                      className={`glass flex items-center gap-2 rounded-full border px-3.5 py-1.5 transition-all duration-300 ${
                        isSelected
                          ? "bg-white/[0.06] shadow-[0_0_24px_rgba(255,255,255,0.06)]"
                          : isHighlightedNeighbor
                          ? "border-white/20 bg-white/[0.03]"
                          : "border-edge bg-holo-card/40"
                      }`}
                      style={{
                        borderColor: isSelected || isHighlightedNeighbor ? meta.color : "",
                        boxShadow: isSelected ? `0 0 20px ${meta.color}25` : "",
                      }}
                    >
                      <Icon
                        size={13}
                        style={{ color: isSelected || isHighlightedNeighbor ? meta.color : "rgba(255,255,255,0.4)" }}
                        className="transition-colors duration-300"
                      />
                      <span
                        className={`text-[10px] font-medium tracking-tight transition-colors duration-300 ${
                          isSelected ? "text-white" : "text-text-secondary group-hover:text-white"
                        }`}
                      >
                        {node.label}
                      </span>
                    </div>
                  </motion.button>
                );
              })}

              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center pb-4">
                <span className="glass rounded-full px-4 py-1.5 text-[10px] uppercase tracking-[0.2em] text-text-muted">
                  Hover the nodes — the graph responds
                </span>
              </div>
            </div>
          </Reveal>

          {/* Evidence panel (Right) */}
          <Reveal delay={0.12}>
            <div className="glass-strong relative min-h-[340px] overflow-hidden rounded-3xl p-7">
              <div className="hairline-gradient absolute inset-x-0 top-0" />
              <AnimatePresence mode="wait">
                {activeNode ? (
                  <motion.div
                    key={activeNode.id}
                    initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.35, ease: EASE }}
                  >
                    <span
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em]"
                      style={{ color: TYPE_META[activeNode.type].color }}
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ background: TYPE_META[activeNode.type].color }}
                      />
                      {TYPE_META[activeNode.type].label}
                    </span>
                    
                    <h3 className="mt-4 text-2xl font-semibold tracking-tight">{activeNode.label}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-text-muted">{activeNode.detail}</p>
                    
                    <ul className="mt-6 space-y-4 text-sm text-text-secondary">
                      <li className="flex items-start gap-3">
                        <GitBranch size={16} className="mt-0.5 shrink-0 text-accent" />
                        Linked to related policies, owners, and source systems in the graph.
                      </li>
                      <li className="flex items-start gap-3">
                        <Share2 size={16} className="mt-0.5 shrink-0 text-violet" />
                        Interactive flow mappings and live dependency checking active.
                      </li>
                      <li className="flex items-start gap-3">
                        <ShieldCheck size={16} className="mt-0.5 shrink-0 text-success" />
                        Access controlled — people only see what they&apos;re allowed to see.
                      </li>
                    </ul>
                  </motion.div>
                ) : (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex h-full flex-col justify-center"
                  >
                    <h3 className="text-xl font-semibold tracking-tight text-text-secondary">
                      A living map of your organization.
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-text-muted">
                      Not a folder tree. Not a search index. A graph that understands
                      that your KYC procedure implements a regulation, is owned by
                      compliance, and was updated last quarter.
                    </p>
                    <div className="mt-8 flex flex-wrap gap-2">
                      {Object.entries(TYPE_META).map(([key, meta]) => (
                        <span
                          key={key}
                          className="glass inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] text-text-secondary"
                        >
                          <span className="h-1.5 w-1.5 rounded-full" style={{ background: meta.color }} />
                          {meta.label}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
