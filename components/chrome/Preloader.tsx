"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";

/**
 * Premium boot screen: the logomark pulses while a hairline charges,
 * then the whole veil lifts. Content underneath is always rendered,
 * so SEO and first paint are unaffected.
 */
export function Preloader() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDone(true), 1600);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[110] flex flex-col items-center justify-center gap-8 bg-space"
          exit={{ opacity: 0, filter: "blur(8px)" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0, filter: "brightness(0.5) blur(2px)" }}
            animate={{ 
              scale: [0.85, 1.08, 0.96, 1], 
              opacity: 1,
              filter: "brightness(1) blur(0px)"
            }}
            transition={{ duration: 1.4, ease: [0.25, 1, 0.5, 1] }}
            className="rounded-2xl overflow-hidden border border-white/10 bg-[#05070a] p-1.5 shadow-[0_0_40px_rgba(61,123,255,0.25)]"
          >
            <Image
              src="/favicon.png"
              alt="Brainers Labs Emblem"
              width={64}
              height={64}
              className="h-16 w-16 object-contain rounded-xl"
            />
          </motion.div>
          <div className="relative h-px w-40 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-accent to-violet"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.35, ease: [0.65, 0, 0.35, 1] }}
            />
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-xs font-medium uppercase tracking-[0.3em] text-text-muted"
          >
            BrainersOS
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
