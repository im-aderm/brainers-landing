"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * The hero background: a field of glowing intelligence nodes joined by
 * faint synapses. Every vertex drifts organically and the pointer pushes
 * an "intelligent wave" through the field — nodes lift, brighten and
 * their connections illuminate, then settle.
 *
 * Points and line segments share one displacement function (in GLSL),
 * so synapses stay perfectly attached to their nodes.
 */

const DISPLACE_GLSL = /* glsl */ `
  uniform float uTime;
  uniform vec3 uMouse;

  vec3 displace(vec3 p, out float glow) {
    vec3 q = p;
    q.x += sin(p.y * 0.35 + uTime * 0.55) * 0.38;
    q.y += cos(p.x * 0.28 + uTime * 0.45) * 0.32;
    q.z += sin(p.x * 0.21 + p.y * 0.26 + uTime * 0.38) * 0.34;

    float d = distance(q.xy, uMouse.xy);
    float wave = exp(-d * d * 0.055);
    q.z += wave * 1.9;
    vec2 dir = normalize(q.xy - uMouse.xy + vec2(0.0001));
    q.xy += dir * wave * 0.55;

    glow = wave;
    return q;
  }
`;

const POINT_VERT = /* glsl */ `
  ${DISPLACE_GLSL}
  attribute float aSeed;
  varying float vGlow;
  varying float vSeed;
  void main() {
    float glow;
    vec3 pos = displace(position, glow);
    vGlow = glow;
    vSeed = aSeed;
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    float twinkle = 0.75 + 0.25 * sin(uTime * (0.6 + aSeed) + aSeed * 40.0);
    gl_PointSize = (1.1 + aSeed * 1.5 + glow * 4.0) * twinkle * (95.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

const POINT_FRAG = /* glsl */ `
  varying float vGlow;
  varying float vSeed;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float r = length(uv);
    float alpha = smoothstep(0.5, 0.05, r);
    vec3 blue = vec3(0.35, 0.58, 0.98);
    vec3 purple = vec3(0.60, 0.45, 0.99);
    vec3 color = mix(blue, purple, vSeed);
    color = mix(color, vec3(0.85, 0.92, 1.0), vGlow);
    gl_FragColor = vec4(color, alpha * (0.18 + 0.62 * vGlow + vSeed * 0.16));
  }
`;

const LINE_VERT = /* glsl */ `
  ${DISPLACE_GLSL}
  varying float vGlow;
  void main() {
    float glow;
    vec3 pos = displace(position, glow);
    vGlow = glow;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const LINE_FRAG = /* glsl */ `
  varying float vGlow;
  void main() {
    vec3 base = vec3(0.30, 0.45, 0.85);
    vec3 lit = vec3(0.55, 0.65, 1.0);
    gl_FragColor = vec4(mix(base, lit, vGlow), 0.05 + vGlow * 0.45);
  }
`;

export function NeuralField({ count = 1800 }: { count?: number }) {
  const { camera, size } = useThree();
  const pointer = useRef(new THREE.Vector2(-100, -100));
  const mouseWorld = useRef(new THREE.Vector3(-100, -100, 0));

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector3(-100, -100, 0) },
    }),
    [],
  );

  const { pointGeo, lineGeo } = useMemo(() => {
    const rng = mulberry32(1337);
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // A wide, shallow slab behind the hero content.
      positions[i * 3] = (rng() - 0.5) * 30;
      positions[i * 3 + 1] = (rng() - 0.5) * 17;
      positions[i * 3 + 2] = -1.5 - rng() * 6;
      seeds[i] = rng();
    }

    const pointGeo = new THREE.BufferGeometry();
    pointGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    pointGeo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));

    // Precompute short-range synapses (each node links to its 2 nearest
    // neighbours within a radius) — computed once, displaced on the GPU.
    const pairs: number[] = [];
    const maxDistSq = 2.4 * 2.4;
    for (let i = 0; i < count; i++) {
      let best1 = -1;
      let best2 = -1;
      let d1 = Infinity;
      let d2 = Infinity;
      const ix = positions[i * 3];
      const iy = positions[i * 3 + 1];
      const iz = positions[i * 3 + 2];
      for (let j = i + 1; j < count; j++) {
        const dx = ix - positions[j * 3];
        const dy = iy - positions[j * 3 + 1];
        const dz = iz - positions[j * 3 + 2];
        const d = dx * dx + dy * dy + dz * dz;
        if (d < d1) {
          d2 = d1;
          best2 = best1;
          d1 = d;
          best1 = j;
        } else if (d < d2) {
          d2 = d;
          best2 = j;
        }
      }
      if (best1 >= 0 && d1 < maxDistSq) pairs.push(i, best1);
      if (best2 >= 0 && d2 < maxDistSq) pairs.push(i, best2);
    }

    const linePositions = new Float32Array(pairs.length * 3);
    for (let k = 0; k < pairs.length; k++) {
      const idx = pairs[k];
      linePositions[k * 3] = positions[idx * 3];
      linePositions[k * 3 + 1] = positions[idx * 3 + 1];
      linePositions[k * 3 + 2] = positions[idx * 3 + 2];
    }
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));

    return { pointGeo, lineGeo };
  }, [count]);

  useFrame((state, delta) => {
    uniforms.uTime.value += delta;

    // Project the pointer onto the field's mid-plane (z ≈ -4).
    const ndc = state.pointer;
    pointer.current.set(ndc.x, ndc.y);
    const vec = new THREE.Vector3(ndc.x, ndc.y, 0.5).unproject(camera);
    const dir = vec.sub(camera.position).normalize();
    const t = (-4 - camera.position.z) / dir.z;
    const target = camera.position.clone().add(dir.multiplyScalar(t));
    mouseWorld.current.lerp(target, 0.08);
    uniforms.uMouse.value.copy(mouseWorld.current);
  });

  void size;

  return (
    <group>
      <points geometry={pointGeo}>
        <shaderMaterial
          vertexShader={POINT_VERT}
          fragmentShader={POINT_FRAG}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      <lineSegments geometry={lineGeo}>
        <shaderMaterial
          vertexShader={LINE_VERT}
          fragmentShader={LINE_FRAG}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  );
}

/** Deterministic PRNG so the field looks identical on every visit. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
