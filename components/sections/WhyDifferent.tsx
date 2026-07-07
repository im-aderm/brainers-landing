"use client";

import { Check, X, Minus } from "lucide-react";
import { SectionHeading } from "../ui/SectionHeading";
import { Stagger, StaggerItem } from "../ui/Reveal";

const ROWS = [
  {
    capability: "Memory",
    chatbots: false,
    rag: false,
    agents: "partial",
    brainos: true,
  },
  {
    capability: "Reasoning",
    chatbots: false,
    rag: false,
    agents: true,
    brainos: true,
  },
  {
    capability: "Organizational Graph",
    chatbots: false,
    rag: false,
    agents: "partial",
    brainos: true,
  },
  {
    capability: "Digital Twin",
    chatbots: false,
    rag: false,
    agents: false,
    brainos: true,
  },
  {
    capability: "Event System",
    chatbots: false,
    rag: false,
    agents: "partial",
    brainos: true,
  },
  {
    capability: "Trust Layer",
    chatbots: false,
    rag: "partial",
    agents: "partial",
    brainos: true,
  },
  {
    capability: "Governance",
    chatbots: false,
    rag: false,
    agents: "partial",
    brainos: true,
  },
  {
    capability: "Enterprise Workflows",
    chatbots: false,
    rag: false,
    agents: "partial",
    brainos: true,
  },
];

const COLUMNS = [
  { key: "chatbots" as const, label: "Chatbots" },
  { key: "rag" as const, label: "RAG Apps" },
  { key: "agents" as const, label: "AI Agents" },
  { key: "brainos" as const, label: "BrainersOS" },
];

function Cell({ value }: { value: boolean | "partial" }) {
  if (value === true)
    return <Check size={16} className="text-success" />;
  if (value === "partial")
    return <Minus size={16} className="text-warning" />;
  return <X size={16} className="text-text-muted" />;
}

export function WhyDifferent() {
  return (
    <section className="relative overflow-hidden py-32 sm:py-44">
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-full max-w-4xl -translate-x-1/2 hairline-gradient" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeading
          eyebrow="Why BrainersOS is Different"
          title="Not just another AI tool."
          subtitle="Built from the ground up as an enterprise intelligence operating system."
        />

        <Stagger className="mt-16" gap={0.06}>
          {/* Header */}
          <StaggerItem>
            <div className="mb-2 grid grid-cols-[1fr_repeat(4,minmax(0,1fr))] gap-3 px-4">
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-text-muted">Capability</span>
              {COLUMNS.map((c) => (
                <span
                  key={c.key}
                  className={`text-center text-xs font-medium uppercase tracking-[0.2em] ${
                    c.key === "brainos" ? "gradient-text" : "text-text-muted"
                  }`}
                >
                  {c.label}
                </span>
              ))}
            </div>
          </StaggerItem>

          {ROWS.map((row) => (
            <StaggerItem key={row.capability}>
              <div
                className="grid grid-cols-[1fr_repeat(4,minmax(0,1fr))] gap-3 rounded-2xl px-4 py-4 transition-all duration-500 hover:bg-white/[0.02] sm:py-5"
                data-cursor="hover"
              >
                <span className="self-center text-sm font-medium text-white">
                  {row.capability}
                </span>
                {COLUMNS.map((c) => (
                  <div
                    key={c.key}
                    className={`flex items-center justify-center self-center rounded-xl py-2 ${
                      c.key === "brainos"
                        ? "border border-accent/25 bg-gradient-to-br from-accent/10 to-violet/8 shadow-[0_0_30px_rgba(59,130,246,0.06)]"
                        : ""
                    }`}
                  >
                    <Cell value={row[c.key] as boolean | "partial"} />
                  </div>
                ))}
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        <div className="mt-8 flex items-center justify-center gap-6 text-xs text-text-muted">
          <span className="flex items-center gap-1.5">
            <Check size={12} className="text-success" /> Yes
          </span>
          <span className="flex items-center gap-1.5">
            <Minus size={12} className="text-warning" /> Partial
          </span>
          <span className="flex items-center gap-1.5">
            <X size={12} className="text-text-muted" /> No
          </span>
        </div>
      </div>
      {/* WhyDifferent section background glows */}
      <div className="pointer-events-none absolute left-[-5%] top-1/3 z-0 h-[400px] w-[400px] rounded-full bg-accent/4 blur-[130px]" />
      <div className="pointer-events-none absolute right-[-5%] bottom-1/3 z-0 h-[400px] w-[400px] rounded-full bg-violet/4 blur-[130px]" />
    </section>
  );
}
