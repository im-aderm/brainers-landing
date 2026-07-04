"use client";

import {
  Environment,
  Float,
  Lightformer,
  MeshTransmissionMaterial,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import { Color, type Group } from "three";
import { SceneCanvas } from "./SceneCanvas";

/**
 * The hero's glassy iridescent green orb: a dark core wrapped in twisted
 * refractive glass bands, slowly turning — matched to hero-sample.webm.
 */
function Blob({ quality }: { quality: "high" | "low" }) {
  const group = useRef<Group>(null);
  // What the glass refracts when nothing sits behind it — keeps the
  // interior a luminous green instead of black.
  const glassBackground = useMemo(() => new Color("#3f7a55"), []);

  useFrame((_, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.16;
    group.current.rotation.x += delta * 0.045;
  });

  return (
    <Float speed={1.1} rotationIntensity={0.1} floatIntensity={0.45}>
      <group ref={group} rotation={[0.35, 0.6, 0.1]}>
        {/* Dark inner core visible through the glass */}
        <mesh>
          <sphereGeometry args={[0.95, 64, 64]} />
          <meshStandardMaterial color="#2a3550" roughness={0.18} metalness={0.8} />
        </mesh>

        {/* Twisted glass wrap */}
        <mesh>
          <torusKnotGeometry args={[1.0, 0.56, quality === "high" ? 400 : 200, quality === "high" ? 48 : 28, 3, 4]} />
          <MeshTransmissionMaterial
            transmission={1}
            thickness={1.3}
            backside
            backsideThickness={0.3}
            roughness={0.05}
            ior={1.4}
            chromaticAberration={0.08}
            anisotropicBlur={0.3}
            distortion={0.35}
            distortionScale={0.6}
            temporalDistortion={0.08}
            iridescence={0.9}
            iridescenceIOR={1.35}
            iridescenceThicknessRange={[120, 600]}
            color="#eafcec"
            attenuationColor="#a5efb2"
            attenuationDistance={4}
            envMapIntensity={2}
            background={glassBackground}
            samples={quality === "high" ? 6 : 4}
            resolution={quality === "high" ? 768 : 448}
          />
        </mesh>
      </group>
    </Float>
  );
}

export default function GlassBlob() {
  const [quality, setQuality] = useState<"high" | "low">("high");

  useEffect(() => {
    const small = window.innerWidth < 768;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (small || coarse) setQuality("low");
  }, []);

  return (
    <SceneCanvas
      className="absolute inset-0"
      camera={{ position: [0, 0, 8], fov: 42 }}
    >
      <ambientLight intensity={0.35} />
      <Blob quality={quality} />
      {/* Studio-style light strips give the banded green/teal reflections */}
      <Environment resolution={256}>
        <Lightformer intensity={7} position={[0, 5, 2]} scale={[10, 1.5, 1]} color="#ffffff" />
        <Lightformer intensity={8} position={[-5, 1, 3]} rotation={[0, Math.PI / 3, 0]} scale={[3, 6, 1]} color="#b5f84c" />
        <Lightformer intensity={7} position={[5, -0.5, 2]} rotation={[0, -Math.PI / 3, 0]} scale={[3, 6, 1]} color="#2dd4bf" />
        <Lightformer intensity={3.5} position={[0, -4, -3]} scale={[8, 3, 1]} color="#14b8a6" />
      </Environment>
    </SceneCanvas>
  );
}
