"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * The BrainOS core: a digital intelligence core — not a human brain.
 * Layers, inside out:
 *  1. an energy heart whose surface breathes with flowing light,
 *  2. a chrome-blue neural lattice (wireframe icosahedron) counter-rotating,
 *  3. a glass fresnel shell,
 *  4. tilted orbit rings with knowledge motes and cards circling the core.
 * The whole assembly floats, slowly rotates and leans toward the pointer.
 */

const CORE_VERT = /* glsl */ `
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vPos;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec3 p = position;
    float swell = sin(uTime * 0.9 + position.y * 3.0 + position.x * 2.0) * 0.02;
    p += normal * swell;
    vPos = p;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const CORE_FRAG = /* glsl */ `
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vPos;

  void main() {
    // Light flowing across the surface in moving bands.
    float bands = sin(vPos.y * 9.0 - uTime * 1.6) * sin(vPos.x * 7.0 + uTime * 1.1);
    float energy = smoothstep(0.15, 0.95, bands * 0.5 + 0.5);

    float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.2);

    vec3 deep = vec3(0.02, 0.05, 0.14);
    vec3 blue = vec3(0.23, 0.51, 0.96);
    vec3 purple = vec3(0.49, 0.36, 0.99);

    vec3 color = mix(deep, blue, energy * 0.8);
    color = mix(color, purple, fresnel * 0.9);
    color += blue * fresnel * 0.7;

    float pulse = 0.9 + 0.1 * sin(uTime * 1.4);
    gl_FragColor = vec4(color * pulse, 1.0);
  }
`;

const SHELL_VERT = /* glsl */ `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const SHELL_FRAG = /* glsl */ `
  uniform float uTime;
  varying vec3 vNormal;
  void main() {
    float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 3.0);
    vec3 rim = mix(vec3(0.23, 0.51, 0.96), vec3(0.49, 0.36, 0.99), 0.5 + 0.5 * sin(uTime * 0.5));
    gl_FragColor = vec4(rim, fresnel * 0.55);
  }
`;

type BrainCoreProps = {
  scale?: number;
  orbiters?: boolean;
  pointerFollow?: boolean;
};

export function BrainCore({ scale = 1, orbiters = true, pointerFollow = true }: BrainCoreProps) {
  const group = useRef<THREE.Group>(null);
  const lattice = useRef<THREE.LineSegments>(null);
  const orbitA = useRef<THREE.Group>(null);
  const orbitB = useRef<THREE.Group>(null);
  const ringA = useRef<THREE.Mesh>(null);
  const ringB = useRef<THREE.Mesh>(null);

  const coreUniforms = useMemo(() => ({ uTime: { value: 0 } }), []);
  const shellUniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  const latticeGeo = useMemo(
    () => new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(1.55, 1)),
    [],
  );

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    coreUniforms.uTime.value = t;
    shellUniforms.uTime.value = t;

    if (group.current) {
      group.current.rotation.y += delta * 0.12;
      group.current.position.y = Math.sin(t * 0.6) * 0.12;
      if (pointerFollow) {
        const targetX = state.pointer.y * 0.18;
        const targetZ = -state.pointer.x * 0.12;
        group.current.rotation.x += (targetX - group.current.rotation.x) * 0.04;
        group.current.rotation.z += (targetZ - group.current.rotation.z) * 0.04;
      }
    }
    if (lattice.current) {
      lattice.current.rotation.y -= delta * 0.2;
      lattice.current.rotation.x += delta * 0.05;
    }
    if (orbitA.current) orbitA.current.rotation.y += delta * 0.35;
    if (orbitB.current) orbitB.current.rotation.y -= delta * 0.22;
    if (ringA.current) ringA.current.rotation.z += delta * 0.18;
    if (ringB.current) ringB.current.rotation.z -= delta * 0.12;
  });

  return (
    <group ref={group} scale={scale}>
      {/* Energy heart */}
      <mesh>
        <icosahedronGeometry args={[1.15, 5]} />
        <shaderMaterial vertexShader={CORE_VERT} fragmentShader={CORE_FRAG} uniforms={coreUniforms} />
      </mesh>

      {/* Neural lattice */}
      <lineSegments ref={lattice} geometry={latticeGeo}>
        <lineBasicMaterial
          color="#5b8ef7"
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>

      {/* Glass shell */}
      <mesh>
        <sphereGeometry args={[1.75, 48, 48]} />
        <shaderMaterial
          vertexShader={SHELL_VERT}
          fragmentShader={SHELL_FRAG}
          uniforms={shellUniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Orbit rings */}
      <mesh ref={ringA} rotation={[Math.PI / 2.4, 0.3, 0]}>
        <torusGeometry args={[2.4, 0.012, 8, 128]} />
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.45} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh ref={ringB} rotation={[Math.PI / 1.9, -0.5, 0.4]}>
        <torusGeometry args={[2.85, 0.01, 8, 128]} />
        <meshBasicMaterial color="#7c5cfc" transparent opacity={0.35} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>

      {orbiters && (
        <>
          {/* Knowledge motes */}
          <group ref={orbitA} rotation={[0.4, 0, 0.2]}>
            {[0, 1, 2, 3, 4].map((i) => {
              const angle = (i / 5) * Math.PI * 2;
              return (
                <mesh key={i} position={[Math.cos(angle) * 2.4, 0, Math.sin(angle) * 2.4]}>
                  <sphereGeometry args={[0.045, 12, 12]} />
                  <meshBasicMaterial color={i % 2 ? "#7c5cfc" : "#60a5fa"} />
                </mesh>
              );
            })}
          </group>

          {/* Orbiting knowledge cards — documents, policies, entities */}
          <group ref={orbitB} rotation={[-0.3, 0.5, -0.15]}>
            {[0, 1, 2].map((i) => {
              const angle = (i / 3) * Math.PI * 2;
              return (
                <group
                  key={i}
                  position={[Math.cos(angle) * 2.9, Math.sin(angle * 2) * 0.3, Math.sin(angle) * 2.9]}
                  rotation={[0, -angle, 0]}
                >
                  <mesh>
                    <planeGeometry args={[0.5, 0.34]} />
                    <meshBasicMaterial
                      color="#0b1020"
                      transparent
                      opacity={0.75}
                      side={THREE.DoubleSide}
                    />
                  </mesh>
                  <lineSegments>
                    <edgesGeometry args={[new THREE.PlaneGeometry(0.5, 0.34)]} />
                    <lineBasicMaterial color="#5b8ef7" transparent opacity={0.8} />
                  </lineSegments>
                  {/* text lines on the card */}
                  {[0.08, 0.02, -0.04].map((y, j) => (
                    <mesh key={j} position={[-0.04 + j * 0.02, y, 0.001]}>
                      <planeGeometry args={[0.3 - j * 0.07, 0.018]} />
                      <meshBasicMaterial color="#4a6ea8" transparent opacity={0.5} side={THREE.DoubleSide} />
                    </mesh>
                  ))}
                </group>
              );
            })}
          </group>
        </>
      )}
    </group>
  );
}
