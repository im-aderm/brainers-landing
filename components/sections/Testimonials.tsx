"use client";

import { Quote } from "lucide-react";
import { SectionHeading } from "../ui/SectionHeading";
import { Stagger, StaggerItem } from "../ui/Reveal";

const TESTIMONIALS = [
  {
    quote:
      "For the first time, our institutional knowledge is an asset we can actually use. Questions that took days of email now take seconds — with the source attached.",
    name: "Adaeze Okonkwo",
    role: "Chief Executive Officer",
    org: "Aurum Bank",
    initials: "AO",
    gradient: "from-accent to-violet",
  },
  {
    quote:
      "Our regulators expect evidence, not opinions. BrainersOS gives every answer a paper trail. That changed how our compliance team works overnight.",
    name: "Daniel Mensah",
    role: "Chief Risk Officer",
    org: "Helix Capital",
    initials: "DM",
    gradient: "from-violet to-accent",
  },
  {
    quote:
      "We evaluated every enterprise search product on the market. BrainersOS was the only one that understood our documents instead of just indexing them.",
    name: "Sarah Lindqvist",
    role: "Chief Information Officer",
    org: "Meridian Group",
    initials: "SL",
    gradient: "from-accent to-success",
  },
];

export function Testimonials() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-32 sm:py-44">
      <SectionHeading
        eyebrow="Leaders on BrainersOS"
        title="Built for the people accountable for answers."
      />

      <Stagger className="mt-16 grid gap-5 lg:grid-cols-3" gap={0.14}>
        {TESTIMONIALS.map((t) => (
          <StaggerItem key={t.name} className="h-full">
            <figure
              className="glass-strong group relative flex h-full flex-col rounded-3xl p-7 transition-all duration-500 hover:-translate-y-1.5 hover:border-edge-strong hover:shadow-[0_30px_80px_rgba(0,0,0,0.5)]"
              data-cursor="hover"
            >
              <div className="hairline-gradient absolute inset-x-6 top-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <Quote size={20} className="text-accent/60" />
              <blockquote className="mt-5 flex-1 text-[15px] leading-relaxed text-text-secondary">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-7 flex items-center gap-3.5 border-t border-edge pt-6">
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br ${t.gradient} text-sm font-semibold text-white`}
                >
                  {t.initials}
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-text-muted">
                    {t.role}, {t.org}
                  </p>
                </div>
              </figcaption>
            </figure>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
