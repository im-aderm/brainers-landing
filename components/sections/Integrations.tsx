"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "../ui/SectionHeading";
import { Reveal } from "../ui/Reveal";
import { BrainMark } from "../ui/BrainMark";

type Connector = {
  name: string;
  mono: string;
  color: string;
  angle: number; // degrees around the hub
  radius: number; // % of container half-width
};

const CONNECTORS: Connector[] = [
  { name: "Slack", mono: "Sl", color: "#E01E5A", angle: -90, radius: 62 },
  { name: "Google Drive", mono: "Dr", color: "#FBBC04", angle: -54, radius: 88 },
  { name: "GitHub", mono: "Gh", color: "#B8C2D1", angle: -18, radius: 64 },
  { name: "Notion", mono: "No", color: "#FFFFFF", angle: 18, radius: 90 },
  { name: "Teams", mono: "Tm", color: "#6264A7", angle: 54, radius: 66 },
  { name: "Jira", mono: "Ji", color: "#2684FF", angle: 90, radius: 86 },
  { name: "Confluence", mono: "Cf", color: "#2684FF", angle: 126, radius: 64 },
  { name: "Dropbox", mono: "Db", color: "#0061FF", angle: 162, radius: 90 },
  { name: "Outlook", mono: "Ou", color: "#28A8EA", angle: 198, radius: 66 },
  { name: "Gmail", mono: "Gm", color: "#EA4335", angle: 234, radius: 88 },
];

function polar(angle: number, radius: number) {
  const rad = (angle * Math.PI) / 180;
  return {
    x: 50 + (Math.cos(rad) * radius) / 2,
    y: 50 + (Math.sin(rad) * radius) / 2,
  };
}

/**
 * The connector constellation: every tool orbits the BrainersOS hub with a
 * faint synapse line. Chips float gently and expand on hover.
 */
export function Integrations() {
  return (
    <section id="integrations" className="relative mx-auto max-w-6xl px-6 py-32 sm:py-44">
      <SectionHeading
        eyebrow="Integrations"
        title="It already speaks to your tools."
        subtitle="BrainersOS connects to the systems your teams live in — no migration, no new habits, nothing to move."
      />

      <Reveal className="mt-16" y={40}>
        <div className="relative mx-auto aspect-square max-w-2xl">
          {/* Synapse lines */}
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" aria-hidden>
            {CONNECTORS.map((c) => {
              const p = polar(c.angle, c.radius);
              return (
                <line
                  key={c.name}
                  x1="50"
                  y1="50"
                  x2={p.x}
                  y2={p.y}
                  stroke="url(#int-line)"
                  strokeWidth="0.18"
                />
              );
            })}
            <defs>
              <linearGradient id="int-line" x1="0" y1="0" x2="1" y2="1">
                <stop stopColor="#3B82F6" stopOpacity="0.4" />
                <stop offset="1" stopColor="#7C5CFC" stopOpacity="0.15" />
              </linearGradient>
            </defs>
          </svg>

          {/* Pulses travelling inward */}
          {CONNECTORS.filter((_, i) => i % 3 === 0).map((c, i) => {
            const p = polar(c.angle, c.radius);
            return (
              <motion.span
                key={c.name}
                className="absolute h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_10px_rgba(59,130,246,1)]"
                style={{ left: 0, top: 0 }}
                animate={{
                  left: [`${p.x}%`, "50%"],
                  top: [`${p.y}%`, "50%"],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 1.1,
                  ease: "easeInOut",
                }}
              />
            );
          })}

          {/* Hub */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/12 blur-3xl" />
            <motion.div
              className="glass-strong relative flex h-24 w-24 items-center justify-center rounded-3xl shadow-[0_0_50px_rgba(59,130,246,0.3)]"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <BrainMark size={44} />
            </motion.div>
          </div>

          {/* Connector chips */}
          {CONNECTORS.map((c, i) => {
            const p = polar(c.angle, c.radius);
            return (
              <motion.div
                key={c.name}
                className="group absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
                animate={{ y: [0, i % 2 ? 7 : -7, 0] }}
                transition={{ duration: 4 + (i % 3), repeat: Infinity, ease: "easeInOut" }}
              >
                <motion.div
                  whileHover={{ scale: 1.18 }}
                  transition={{ type: "spring", stiffness: 300, damping: 18 }}
                  className="glass flex h-14 w-14 items-center justify-center rounded-2xl transition-colors duration-300 hover:border-edge-strong sm:h-16 sm:w-16"
                  data-cursor="hover"
                >
                  <span className="text-sm font-bold sm:text-base" style={{ color: c.color }}>
                    {c.mono}
                  </span>
                </motion.div>
                <span className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-md border border-edge bg-ink/90 px-2 py-1 text-[10px] text-text-secondary opacity-0 backdrop-blur transition-opacity duration-300 group-hover:opacity-100">
                  {c.name}
                </span>
              </motion.div>
            );
          })}
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <p className="mt-10 text-center text-sm text-text-muted">
          Plus databases, file shares, intranets, and a clean API for everything else.
        </p>
      </Reveal>
    </section>
  );
}
