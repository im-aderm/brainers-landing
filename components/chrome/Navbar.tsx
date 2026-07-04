"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";

const LINKS = [
  { label: "Product", href: "#how-it-works" },
  { label: "Intelligence", href: "#knowledge-graph" },
  { label: "Security", href: "#security" },
  { label: "Integrations", href: "#integrations" },
];

export function Navbar() {
  const { scrollY } = useScroll();
  const [floating, setFloating] = useState(false);

  useMotionValueEvent(scrollY, "change", (v) => setFloating(v > 40));

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, delay: 1.4, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-[80] px-4 pt-4 sm:px-6 sm:pt-5"
    >
      <nav
        className={`mx-auto flex w-full max-w-7xl items-center justify-between rounded-2xl px-4 py-2.5 transition-all duration-500 sm:px-5 ${
          floating
            ? "border border-white/10 bg-holo/85 shadow-[0_8px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl"
            : "border border-transparent"
        }`}
        aria-label="Main"
      >
        <a href="#" className="flex items-center gap-3" data-cursor="hover">
          <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-white font-display text-lg font-bold text-holo">
            B
          </span>
          <span className="font-display text-[17px] font-semibold tracking-tight text-white">
            BrainOS
          </span>
        </a>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-8 rounded-xl bg-white/[0.04] px-7 py-3 md:flex">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                data-cursor="hover"
                className="text-sm text-white/85 transition-colors duration-300 hover:text-lime"
              >
                {l.label}
              </a>
            ))}
          </div>

          <a
            href="#cta"
            data-cursor="hover"
            className="group flex items-center gap-3 rounded-xl bg-lime py-1.5 pl-1.5 pr-5 transition-transform duration-300 hover:scale-[1.03]"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-holo text-lime transition-transform duration-300 group-hover:rotate-90">
              <Plus size={15} />
            </span>
            <span className="text-sm font-semibold text-holo">Request Demo</span>
          </a>
        </div>
      </nav>
    </motion.header>
  );
}
