"use client";

import { Canvas } from "@react-three/fiber";
import { useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

type SceneCanvasProps = {
  children: ReactNode;
  className?: string;
  camera?: { position: [number, number, number]; fov?: number };
  eventSource?: "self";
};

/**
 * Shared Canvas wrapper: caps device pixel ratio and completely stops the
 * render loop while the scene is off screen, the tab is hidden, or the user
 * has requested reduced motion — so scroll performance, battery, and
 * accessibility preferences are respected everywhere this is used.
 */
export function SceneCanvas({
  children,
  className = "",
  camera = { position: [0, 0, 10], fov: 42 },
}: SceneCanvasProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "20% 0px 20% 0px" });
  const reducedMotion = useReducedMotion();
  const [tabVisible, setTabVisible] = useState(true);

  useEffect(() => {
    const onVisibility = () => setTabVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const active = inView && tabVisible && !reducedMotion;

  return (
    <div ref={ref} className={className} aria-hidden>
      <Canvas
        camera={camera}
        dpr={[1, 1.75]}
        frameloop={active ? "always" : "demand"}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        {children}
      </Canvas>
    </div>
  );
}
