"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * A two-part cursor: a precise dot that follows the pointer exactly and a
 * soft ring that trails it on a spring. Elements marked with
 * `data-cursor="hover"` expand the ring. Only active on precise pointers.
 */
export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 260, damping: 24, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 260, damping: 24, mass: 0.5 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    setEnabled(true);
    document.body.dataset.customCursor = "true";

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = e.target as HTMLElement | null;
      setHovering(
        Boolean(target?.closest('[data-cursor="hover"], a, button, [role="button"]')),
      );
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => {
      window.removeEventListener("mousemove", move);
      delete document.body.dataset.customCursor;
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
        style={{ x, y }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[99] -translate-x-1/2 -translate-y-1/2 rounded-full border transition-[width,height,border-color,background-color] duration-300"
        style={{
          x: ringX,
          y: ringY,
          width: hovering ? 52 : 30,
          height: hovering ? 52 : 30,
          borderColor: hovering ? "rgba(59,130,246,0.9)" : "rgba(255,255,255,0.35)",
          backgroundColor: hovering ? "rgba(59,130,246,0.08)" : "transparent",
        }}
      />
    </>
  );
}
