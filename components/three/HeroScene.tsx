"use client";

import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { useEffect, useState } from "react";
import { BrainCore } from "./BrainCore";
import { NeuralField } from "./NeuralField";
import { SceneCanvas } from "./SceneCanvas";

/** Full hero universe: neural field + floating brain core + bloom. */
export default function HeroScene() {
  const [quality, setQuality] = useState<"high" | "low">("high");

  useEffect(() => {
    const small = window.innerWidth < 768;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (small || coarse) setQuality("low");
  }, []);

  const nodeCount = quality === "high" ? 1800 : 700;

  return (
    <SceneCanvas
      className="absolute inset-0"
      camera={{ position: [0, 0, 9], fov: 45 }}
    >
      <color attach="background" args={["#05070a"]} />
      <fog attach="fog" args={["#05070a", 10, 26]} />
      <NeuralField count={nodeCount} />
      {/* On small screens the core recedes into the fog so it never fights the headline. */}
      <group position={quality === "high" ? [0, 0.4, 0] : [0, 0.9, -5]}>
        <BrainCore scale={quality === "high" ? 1.05 : 0.9} />
      </group>
      {quality === "high" && (
        <EffectComposer>
          <Bloom
            intensity={0.5}
            luminanceThreshold={0.3}
            luminanceSmoothing={0.6}
            mipmapBlur
          />
        </EffectComposer>
      )}
    </SceneCanvas>
  );
}
