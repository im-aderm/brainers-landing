"use client";

import { Canvas } from "@react-three/fiber";
import { useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";

type SceneCanvasProps = {
  children: ReactNode;
  className?: string;
  camera?: { position: [number, number, number]; fov?: number };
  eventSource?: "self";
};

/**
 * Shared Canvas wrapper: caps device pixel ratio and completely stops the
 * render loop while the scene is off screen, so scroll performance and
 * battery are unaffected by sections the user is not looking at.
 */
export function SceneCanvas({
  children,
  className = "",
  camera = { position: [0, 0, 10], fov: 42 },
}: SceneCanvasProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "20% 0px 20% 0px" });

  return (
    <div ref={ref} className={className} aria-hidden>
      <Canvas
        camera={camera}
        dpr={[1, 1.75]}
        frameloop={inView ? "always" : "never"}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        {children}
      </Canvas>
    </div>
  );
}
