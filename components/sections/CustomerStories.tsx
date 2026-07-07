"use client";

import { Quote } from "lucide-react";
import { SectionHeading } from "../ui/SectionHeading";
import { Stagger, StaggerItem } from "../ui/Reveal";

const PLACEHOLDERS = [
  {
    quote:
      "BrainersOS transformed how our compliance team works. What used to take days of searching now takes seconds — with the source attached.",
    name: "Coming Soon",
    role: "Enterprise Customer",
    initials: "??",
    gradient: "from-accent to-violet",
  },
  {
    quote:
      "The knowledge graph alone saved us months of manual documentation mapping. Every policy, process, and owner connected automatically.",
    name: "Coming Soon",
    role: "Enterprise Customer",
    initials: "??",
    gradient: "from-violet to-accent",
  },
  {
    quote:
      "We finally have a single source of truth for our institutional knowledge. Onboarding new team members went from weeks to days.",
    name: "Coming Soon",
    role: "Enterprise Customer",
    initials: "??",
    gradient: "from-accent to-success",
  },
];

export function CustomerStories() {
  return (
    <section className="relative overflow-hidden py-32 sm:py-44">
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-full max-w-4xl -translate-x-1/2 hairline-gradient" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeading
          eyebrow="Customer Stories"
          title="Trusted by industry leaders."
          subtitle="Case studies, ROI metrics, and real results — coming soon."
        />

        <Stagger className="mt-16 grid gap-5 lg:grid-cols-3" gap={0.14}>
          {PLACEHOLDERS.map((t, i) => (
            <StaggerItem key={`story-${i}`}>
              <figure
                className="glass-strong group relative flex h-full flex-col rounded-3xl border border-edge p-7 transition-all duration-500 hover:-translate-y-1.5 hover:border-edge-strong hover:shadow-[0_30px_80px_rgba(0,0,0,0.5)]"
                data-cursor="hover"
              >
                <div className="hairline-gradient absolute inset-x-6 top-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <Quote size={20} className="text-accent/60" />
                <blockquote className="mt-5 flex-1 text-[15px] leading-relaxed text-text-secondary">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-7 flex items-center gap-3.5 border-t border-edge pt-6">
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br ${t.gradient} text-sm font-semibold text-white opacity-40`}
                  >
                    {t.initials}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-text-muted">{t.role}</p>
                  </div>
                </figcaption>
              </figure>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
      {/* CustomerStories background glow */}
      <div className="pointer-events-none absolute left-[15%] top-1/2 z-0 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-accent/4 blur-[130px]" />
    </section>
  );
}
