"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef, type ReactNode, type MouseEvent } from "react";

type MagneticButtonProps = {
  children: ReactNode;
  variant?: "primary" | "ghost";
  href?: string;
  className?: string;
  onClick?: () => void;
};

/**
 * A button that leans toward the cursor while hovered and settles
 * back on a spring — the "magnetic" interaction used for all CTAs.
 */
export function MagneticButton({
  children,
  variant = "primary",
  href,
  className = "",
  onClick,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 16, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 180, damping: 16, mass: 0.6 });

  function handleMove(e: MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.28);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.28);
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  const base =
    "relative inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium tracking-wide transition-colors duration-300 select-none";
  const styles =
    variant === "primary"
      ? `${base} bg-accent text-white shadow-[0_0_32px_rgba(59,130,246,0.45)] hover:bg-[#4b8ef7] hover:shadow-[0_0_48px_rgba(59,130,246,0.65)]`
      : `${base} glass text-text-secondary hover:text-white hover:border-edge-strong`;

  const inner = href ? (
    <a href={href} className={styles} data-cursor="hover" onClick={onClick}>
      {children}
    </a>
  ) : (
    <button type="button" className={styles} data-cursor="hover" onClick={onClick}>
      {children}
    </button>
  );

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ x: sx, y: sy }}
      className={`inline-block ${className}`}
    >
      {inner}
    </motion.div>
  );
}
