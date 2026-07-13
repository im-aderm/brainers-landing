"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { Plus, Menu, X } from "lucide-react";
import { useState, useRef, Fragment } from "react";
import Image from "next/image";

const LINKS = [
  { label: "Product", href: "#how-it-works" },
  { label: "Security", href: "#security" },
  { label: "Integrations", href: "#integrations" },
];

export function Navbar() {
  const { scrollY } = useScroll();
  const [floating, setFloating] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const pathname = usePathname();

  const lastScrollY = useRef(0);

  // Handle scroll logic: floating state and smart hide/reveal on scroll direction
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = lastScrollY.current;
    lastScrollY.current = latest;

    // Trigger floating styling after passing a small threshold
    setFloating(latest > 30);

    // Smart hide navbar on scroll down, show on scroll up
    if (latest > 120 && latest > previous) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  return (
    <>
      <motion.header
        variants={{
          visible: { y: 0, opacity: 1 },
          hidden: { y: -100, opacity: 0 },
        }}
        animate={hidden && !mobileMenuOpen ? "hidden" : "visible"}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        initial={{ y: -80, opacity: 0 }}
        className="fixed inset-x-0 top-0 z-[80] px-4 pt-4 sm:px-6 sm:pt-5 lg:px-10"
      >
        <nav
          className={`mx-auto flex w-full max-w-7xl items-center justify-between rounded-2xl py-2.5 transition-all duration-500 ${
            floating || mobileMenuOpen
              ? "border border-white/10 bg-holo/85 shadow-[0_8px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl px-4 sm:px-5"
              : "border border-transparent px-6 lg:px-10"
          }`}
          aria-label="Main Navigation"
        >
          <Link href="/" className="flex items-center" data-cursor="hover">
            <span className="font-mono text-2xl font-bold tracking-[0.06em] text-white/95">
              Syna
              <motion.span
                animate={{ scale: [1, 1.15, 1], filter: ["drop-shadow(0 0 2px rgba(59,130,246,0.25))", "drop-shadow(0 0 8px rgba(59,130,246,0.65))", "drop-shadow(0 0 2px rgba(59,130,246,0.25))"] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                className="relative inline-block font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-[#35d6ff] to-[#7c5cfc] ml-1 italic"
              >
                X
              </motion.span>
            </span>
          </Link>

          {/* Desktop Nav Actions */}
          <div className="flex items-center gap-3">
            {/* Desktop Navigation Links */}
            <div 
              className="relative hidden items-center gap-1.5 md:flex"
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {LINKS.map((link, idx) => {
                const isActive = pathname === link.href;
                return (
                  <Fragment key={link.href}>
                    <a
                      href={link.href}
                      data-cursor="hover"
                      onMouseEnter={() => setHoveredIdx(idx)}
                      className={`relative rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                        isActive ? "text-[#35d6ff]" : "text-white/80 hover:text-white"
                      }`}
                    >
                      {/* Hover sliding pill */}
                      {hoveredIdx === idx && (
                        <motion.div
                          layoutId="nav-hover-pill"
                          className="absolute inset-0 z-0 rounded-lg bg-white/[0.03]"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10">{link.label}</span>
                    </a>
                    {idx < LINKS.length - 1 && (
                      <div className="h-3.5 w-px bg-gradient-to-b from-white/10 via-white/45 to-white/10 self-center" />
                    )}
                  </Fragment>
                );
              })}
            </div>

            {/* Request Demo Button (CTA) */}
            <Link
              href="#cta"
              data-cursor="hover"
              className="electric-gradient group hidden items-center gap-3 rounded-xl py-1.5 pl-1.5 pr-5 shadow-[0_0_28px_rgba(61,123,255,0.3)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_40px_rgba(61,123,255,0.45)] sm:flex"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-holo text-neon transition-transform duration-300 group-hover:rotate-90">
                <Plus size={15} />
              </span>
              <span className="text-sm font-semibold text-white">Request Demo</span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-white transition-colors hover:bg-white/[0.08] md:hidden"
              aria-label="Toggle navigation menu"
              data-cursor="hover"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="absolute left-4 right-4 top-full mt-2 overflow-hidden rounded-2xl border border-white/10 bg-holo/95 shadow-2xl backdrop-blur-2xl md:hidden"
            >
              <div className="flex flex-col gap-2 p-4">
                {LINKS.map((link, idx) => {
                  const isActive = pathname === link.href;
                  return (
                    <motion.a
                      key={link.href}
                      href={link.href}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition-colors hover:bg-white/[0.05] hover:text-white ${
                        isActive ? "text-[#35d6ff]" : "text-white/80"
                      }`}
                    >
                      <span>{link.label}</span>
                      <span className="text-white/20">→</span>
                    </motion.a>
                  );
                })}
                
                <div className="my-2 h-px bg-white/10" />

                <Link
                  href="#cta"
                  onClick={() => setMobileMenuOpen(false)}
                  className="electric-gradient flex items-center justify-center gap-3 rounded-xl py-3 shadow-[0_0_24px_rgba(61,123,255,0.25)]"
                >
                  <Plus size={16} className="text-neon" />
                  <span className="text-sm font-semibold text-white">Request Demo</span>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
