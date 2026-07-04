"use client";

import { BrainCore } from "./BrainCore";
import { SceneCanvas } from "./SceneCanvas";

/** A lighter reprise of the brain core for the closing call to action. */
export default function MiniCoreScene() {
  return (
    <SceneCanvas
      className="absolute inset-0"
      camera={{ position: [0, 0, 8], fov: 42 }}
    >
      <BrainCore scale={0.95} orbiters pointerFollow />
    </SceneCanvas>
  );
}
