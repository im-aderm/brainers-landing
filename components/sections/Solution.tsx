"use client";

import { SectionHeading } from "../ui/SectionHeading";
import IntelligenceCore from "../solution/IntelligenceCore";

export function Solution() {
  return (
    <section className="relative overflow-hidden py-32 sm:py-44">
      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeading
          eyebrow="The Solution"
          title="Introducing BrainersOS."
          subtitle="Instead of disconnected islands... everything connects into a single corporate intelligence layer."
          align="right"
        />

        <div className="mt-20">
          <IntelligenceCore />
        </div>
      </div>
    </section>
  );
}
