"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** Thin gradient bar along the top edge that tracks page progress. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[90] h-[2px] origin-left bg-gradient-to-r from-accent via-violet to-accent"
      style={{ scaleX }}
    />
  );
}
