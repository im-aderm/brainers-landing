"use client";

import { Environment, Lightformer } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";
import { SceneCanvas } from "./SceneCanvas";

/** The small green twisted knot that sits inline inside the headline. */
function Knot() {
  const group = useRef<Group>(null);

  useFrame((_, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.55;
  });

  return (
    <group ref={group} rotation={[0.5, 0, Math.PI / 2]} scale={[1, 1.9, 1]}>
      <mesh>
        <torusKnotGeometry args={[1, 0.34, 220, 32, 3, 2]} />
        <meshPhysicalMaterial
          color="#a8d9b8"
          metalness={0.35}
          roughness={0.12}
          transmission={0.55}
          thickness={0.6}
          ior={1.4}
          clearcoat={1}
          clearcoatRoughness={0.12}
          iridescence={0.9}
          iridescenceIOR={1.4}
        />
      </mesh>
    </group>
  );
}

export default function InlineKnot() {
  return (
    <SceneCanvas
      className="h-full w-full"
      camera={{ position: [0, 0, 4.6], fov: 40 }}
    >
      <ambientLight intensity={0.35} />
      <Knot />
      <Environment resolution={128}>
        <Lightformer intensity={4} position={[0, 4, 2]} scale={[8, 1.5, 1]} color="#ffffff" />
        <Lightformer intensity={5} position={[-4, 0, 3]} scale={[2, 5, 1]} color="#b5f84c" />
        <Lightformer intensity={4} position={[4, -1, 2]} scale={[2, 5, 1]} color="#2dd4bf" />
      </Environment>
    </SceneCanvas>
  );
}
