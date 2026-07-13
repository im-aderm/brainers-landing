"use client";

import { Check, X, Minus } from "lucide-react";
import { SectionHeading } from "../ui/SectionHeading";
import { Stagger, StaggerItem } from "../ui/Reveal";

const ROWS = [
  {
    capability: "Remembering Everything",
    chatbots: false,
    rag: false,
    agents: "partial",
    Synax: true,
  },
  {
    capability: "Logical Thinking",
    chatbots: false,
    rag: false,
    agents: true,
    Synax: true,
  },
  {
    capability: "Connecting the Dots",
    chatbots: false,
    rag: false,
    agents: "partial",
    Synax: true,
  },
  {
    capability: "Company Mirror",
    chatbots: false,
    rag: false,
    agents: false,
    Synax: true,
  },
  {
    capability: "Live Updates",
    chatbots: false,
    rag: false,
    agents: "partial",
    Synax: true,
  },
  {
    capability: "Fact Checking",
    chatbots: false,
    rag: "partial",
    agents: "partial",
    Synax: true,
  },
  {
    capability: "Safety & Permissions",
    chatbots: false,
    rag: false,
    agents: "partial",
    Synax: true,
  },
  {
    capability: "Automated Work",
    chatbots: false,
    rag: false,
    agents: "partial",
    Synax: true,
  },
];

const COLUMNS = [
  { key: "chatbots" as const, label: "Simple Chatbots" },
  { key: "rag" as const, label: "Search Apps" },
  { key: "agents" as const, label: "Smart Assistants" },
  { key: "Synax" as const, label: "Second Brain (Synax)" },
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
          eyebrow="Why we are different"
          title="Not just another chatbot."
          subtitle="Built from the ground up as a complete shared memory and intelligence layer for your whole company."
        />

        <div className="mt-16 w-full overflow-x-auto pb-4 -mx-6 px-6 md:mx-0 md:px-0 scrollbar-none">
          <div className="min-w-[720px] px-1">
            <Stagger className="w-full" gap={0.06}>
              {/* Header */}
              <StaggerItem>
                <div className="mb-2 grid grid-cols-[1.2fr_repeat(4,minmax(0,1fr))] gap-3 px-4">
                  <span className="text-xs font-medium uppercase tracking-[0.2em] text-text-muted">Capability</span>
                  {COLUMNS.map((c) => (
                    <span
                      key={c.key}
                      className={`text-center text-xs font-medium uppercase tracking-[0.2em] ${
                        c.key === "Synax" ? "gradient-text" : "text-text-muted"
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
                    className="grid grid-cols-[1.2fr_repeat(4,minmax(0,1fr))] gap-3 rounded-2xl px-4 py-4 transition-all duration-500 hover:bg-white/[0.02] sm:py-5"
                    data-cursor="hover"
                  >
                    <span className="self-center text-sm font-medium text-white">
                      {row.capability}
                    </span>
                    {COLUMNS.map((c) => (
                      <div
                        key={c.key}
                        className={`flex items-center justify-center self-center rounded-xl py-2 ${
                          c.key === "Synax"
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
          </div>
        </div>

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
