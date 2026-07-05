"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import dynamic from "next/dynamic";
import { useRef } from "react";
import { MagneticButton } from "../ui/MagneticButton";
import { Reveal } from "../ui/Reveal";

const MiniCoreScene = dynamic(() => import("../three/MiniCoreScene"), {
  ssr: false,
  loading: () => null,
});

/**
 * The close: the brain core returns and the room slowly brightens
 * as you arrive — the organization waking up.
 */
export function FinalCTA() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });
  const glow = useTransform(scrollYProgress, [0, 1], [0, 0.9]);

  return (
    <section id="cta" ref={ref} className="relative overflow-hidden">
      {/* The brightening dawn */}
      <motion.div
        style={{ opacity: glow }}
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_75%,rgba(59,130,246,0.22),rgba(124,92,252,0.1)_45%,transparent_75%)]"
      />

      <div className="relative mx-auto flex min-h-[92svh] max-w-4xl flex-col items-center justify-center px-6 py-32 text-center">
        {/* The core returns */}
        <div className="relative mb-4 h-64 w-64 sm:h-80 sm:w-80">
          <MiniCoreScene />
        </div>

        <Reveal>
          <h2 className="text-balance text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            Give your company
            <br />
            <span className="gradient-text text-glow">a brain.</span>
          </h2>
        </Reveal>

        <Reveal delay={0.12}>
          <p className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-text-secondary">
            See BrainersOS working on your own documents. A 30-minute demo is all
            it takes to understand what your organization has been missing.
          </p>
        </Reveal>

        <Reveal delay={0.22}>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <MagneticButton href="mailto:hello@brainerslabs.com?subject=BrainersOS%20Demo%20Request">
              Request Demo <ArrowRight size={16} />
            </MagneticButton>
            <MagneticButton variant="ghost" href="mailto:hello@brainerslabs.com">
              Talk to our team
            </MagneticButton>
          </div>
        </Reveal>

        <Reveal delay={0.3}>
          <p className="mt-12 text-xs uppercase tracking-[0.25em] text-text-muted">
            BrainersOS — by Brainers Labs
          </p>
        </Reveal>
      </div>
    </section>
  );
}
