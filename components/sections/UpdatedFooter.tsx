"use client";

import { useState } from "react";
import { GitFork, Globe, Hash, MessageCircle, ArrowRight, Check } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

const COLUMNS = [
  {
    title: "Platform",
    links: [
      { label: "Product Overview", href: "/product" },
      { label: "Integrations", href: "/integrations" },
    ],
  },
  {
    title: "Developers",
    links: [
      { label: "Documentation", href: "/docs" },
      { label: "API Spec", href: "/docs" },
    ],
  },
  {
    title: "Trust & Legal",
    links: [
      { label: "Security Center", href: "/security" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
];

const SOCIALS = [
  { icon: GitFork, href: "https://github.com", label: "GitHub" },
  { icon: Globe, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: Hash, href: "https://x.com", label: "X" },
  { icon: MessageCircle, href: "https://discord.com", label: "Discord" },
];

export function UpdatedFooter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
      setEmail("");
    }, 1200);
  };

  return (
    <footer className="relative border-t border-edge bg-space/50">
      <div className="hairline-gradient absolute inset-x-0 top-0" />
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:px-10 py-16 sm:grid-cols-2 lg:grid-cols-5">
        {/* Company Intro & Newsletter */}
        <div className="lg:col-span-2 flex flex-col justify-between gap-8">
          <div>
            <div className="flex items-center">
              <span className="font-mono text-2xl font-bold tracking-[0.06em] text-white/95">
                Syna
                <motion.span
                  animate={{
                    scale: [1, 1.25, 1],
                    rotate: [0, 360, 360],
                    filter: ["drop-shadow(0 0 2px rgba(59,130,246,0.25))", "drop-shadow(0 0 8px rgba(59,130,246,0.65))", "drop-shadow(0 0 2px rgba(59,130,246,0.25))"]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="relative inline-block font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-[#35d6ff] to-[#7c5cfc] ml-1 italic"
                >
                  X
                </motion.span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-text-muted">
              The AI operating system that turns everything your company knows
              into answers your teams can trust.
            </p>
          </div>

          {/* Newsletter Input Form */}
          <div className="max-w-xs">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Subscribe to updates
            </h4>
            <form onSubmit={handleSubscribe} className="relative mt-3 flex items-center">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                disabled={status === "success"}
                className="w-full rounded-xl border border-edge bg-white/[0.03] py-2.5 pl-4 pr-11 text-xs text-white placeholder-white/30 outline-none transition-all focus:border-[#3d7bff]/50 focus:bg-white/[0.06] focus:ring-1 focus:ring-[#3d7bff]/50"
              />
              <button
                type="submit"
                disabled={status === "loading" || status === "success"}
                className="absolute right-1.5 flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white transition-all hover:bg-white/20 active:scale-95 disabled:pointer-events-none"
              >
                {status === "success" ? (
                  <Check size={14} className="text-success" />
                ) : (
                  <ArrowRight size={14} className={status === "loading" ? "animate-pulse" : ""} />
                )}
              </button>
            </form>
            {status === "success" && (
              <p className="mt-2 text-[11px] text-success font-medium">
                Subscribed successfully!
              </p>
            )}
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="hover"
                className="group flex h-9 w-9 items-center justify-center rounded-xl border border-edge bg-white/[0.02] text-text-muted transition-all duration-300 hover:border-[#3b82f6]/40 hover:text-white"
                aria-label={s.label}
              >
                <span className="absolute inset-0 -z-10 rounded-xl opacity-0 transition-opacity duration-300 group-hover:electric-gradient group-hover:opacity-10" />
                <s.icon size={16} className="transition-transform duration-300 group-hover:scale-110" />
              </a>
            ))}
          </div>
        </div>

        {/* Link Columns */}
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
              {col.title}
            </h3>
            <ul className="mt-4 space-y-3">
              {col.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    data-cursor="hover"
                    className="text-xs text-text-secondary transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Footer copyright & System status */}
      <div className="border-t border-edge">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 lg:px-10 py-6 text-xs text-text-muted sm:flex-row">
          <p>© {new Date().getFullYear()} Brainers Labs. All rights reserved.</p>
          <div className="flex items-center gap-2 rounded-full border border-success/20 bg-success/[0.04] px-3 py-1 text-[11px] font-medium text-success/90">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-success"></span>
            </span>
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}
