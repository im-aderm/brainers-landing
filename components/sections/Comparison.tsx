"use client";

import { Check, X } from "lucide-react";
import { SectionHeading } from "../ui/SectionHeading";
import { Reveal, Stagger, StaggerItem } from "../ui/Reveal";

const ROWS: Array<{ dimension: string; old: string; brainos: string }> = [
  {
    dimension: "Finding information",
    old: "Keyword search across one tool at a time",
    brainos: "One question across everything you know",
  },
  {
    dimension: "Trusting the result",
    old: "A list of links — you verify manually",
    brainos: "Direct answers with cited sources and confidence",
  },
  {
    dimension: "Understanding context",
    old: "Files sit in folders, unrelated",
    brainos: "A knowledge graph links policies, people, and decisions",
  },
  {
    dimension: "Staying current",
    old: "Stale copies and outdated wikis",
    brainos: "Continuously synced from live systems",
  },
  {
    dimension: "Protecting access",
    old: "Search often ignores permissions",
    brainos: "Answers respect who's allowed to see what",
  },
];

export function Comparison() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-32 sm:py-44">
      <SectionHeading
        eyebrow="Why BrainOS"
        title="Search finds documents. BrainOS finds answers."
      />

      <Stagger className="mt-16 space-y-3">
        {/* Column headers */}
        <StaggerItem>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-[1fr_1.2fr_1.2fr] sm:gap-4">
            <p className="hidden text-xs font-medium uppercase tracking-[0.2em] text-text-muted sm:block" />
            <p className="text-center text-xs font-medium uppercase tracking-[0.2em] text-text-muted">
              Traditional enterprise search
            </p>
            <p className="gradient-text text-center text-xs font-semibold uppercase tracking-[0.2em]">
              BrainOS
            </p>
          </div>
        </StaggerItem>

        {ROWS.map((row) => (
          <StaggerItem key={row.dimension}>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-[1fr_1.2fr_1.2fr] sm:gap-4">
              <p className="col-span-2 pt-2 text-sm font-medium text-white sm:col-span-1 sm:pt-5">
                {row.dimension}
              </p>
              <div className="flex items-start gap-3 rounded-2xl border border-edge bg-white/[0.02] p-4 sm:p-5">
                <X size={15} className="mt-0.5 shrink-0 text-text-muted" />
                <p className="text-sm leading-relaxed text-text-muted">{row.old}</p>
              </div>
              <div
                className="flex items-start gap-3 rounded-2xl border border-accent/25 bg-gradient-to-br from-accent/10 to-violet/8 p-4 shadow-[0_0_40px_rgba(59,130,246,0.08)] transition-shadow duration-300 hover:shadow-[0_0_50px_rgba(59,130,246,0.18)] sm:p-5"
                data-cursor="hover"
              >
                <Check size={15} className="mt-0.5 shrink-0 text-success" />
                <p className="text-sm leading-relaxed text-text-secondary">{row.brainos}</p>
              </div>
            </div>
          </StaggerItem>
        ))}
      </Stagger>

      <Reveal delay={0.15} className="mt-12 text-center">
        <p className="text-sm text-text-muted">
          The difference isn&apos;t better search. It&apos;s an organization that finally
          knows what it knows.
        </p>
      </Reveal>
    </section>
  );
}
