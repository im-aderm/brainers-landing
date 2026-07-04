"use client";

import { AnimatePresence, motion } from "framer-motion";
import { FileText, GitBranch, ShieldCheck } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";
import type { GraphNode } from "../three/GraphScene";
import { SectionHeading } from "../ui/SectionHeading";
import { Reveal } from "../ui/Reveal";

const GraphScene = dynamic(() => import("../three/GraphScene"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center">
      <div className="h-40 w-40 animate-pulse-soft rounded-full border border-accent/25" />
    </div>
  ),
});

const TYPE_META: Record<GraphNode["type"], { label: string; color: string }> = {
  document: { label: "Document", color: "#3b82f6" },
  policy: { label: "Policy", color: "#7c5cfc" },
  person: { label: "Owner", color: "#18c964" },
  system: { label: "Connected system", color: "#f5a524" },
};

export function KnowledgeGraphSection() {
  const [active, setActive] = useState<GraphNode | null>(null);

  return (
    <section id="knowledge-graph" className="relative py-32 sm:py-44">
      {/* Ambient glow behind the sphere */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/8 blur-[140px]" />

      <div className="relative mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="The knowledge graph"
          title="See how everything your company knows connects."
          subtitle="Every document, policy, owner, and system — mapped as living relationships. Hover a node to light up what it touches."
        />

        <div className="mt-16 grid items-center gap-8 lg:grid-cols-[1.5fr_1fr]">
          <Reveal className="relative" blur={false}>
            <div className="relative h-[420px] overflow-hidden rounded-3xl border border-edge bg-ink/30 sm:h-[540px]">
              <GraphScene onHover={setActive} />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center pb-4">
                <span className="glass rounded-full px-4 py-1.5 text-[11px] uppercase tracking-[0.2em] text-text-muted">
                  Hover the nodes — the graph responds
                </span>
              </div>
            </div>
          </Reveal>

          {/* Evidence panel */}
          <Reveal delay={0.12}>
            <div className="glass-strong relative min-h-[300px] overflow-hidden rounded-3xl p-7">
              <div className="hairline-gradient absolute inset-x-0 top-0" />
              <AnimatePresence mode="wait">
                {active ? (
                  <motion.div
                    key={active.id}
                    initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <span
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em]"
                      style={{ color: TYPE_META[active.type].color }}
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ background: TYPE_META[active.type].color }}
                      />
                      {TYPE_META[active.type].label}
                    </span>
                    <h3 className="mt-4 text-2xl font-semibold tracking-tight">{active.label}</h3>
                    <ul className="mt-6 space-y-4 text-sm text-text-secondary">
                      <li className="flex items-start gap-3">
                        <GitBranch size={16} className="mt-0.5 shrink-0 text-accent" />
                        Linked to related policies, owners, and source systems in the graph.
                      </li>
                      <li className="flex items-start gap-3">
                        <FileText size={16} className="mt-0.5 shrink-0 text-violet" />
                        Every fact traced to its exact source document and page.
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
