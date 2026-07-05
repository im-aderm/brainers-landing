"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const BLUE = new THREE.Color("#3d7bff");
const CYAN = new THREE.Color("#35d6ff");
const VIOLET = new THREE.Color("#8b7cff");

const SHELL_COUNT = 1600;
const NODE_COUNT = 64;
const PULSE_COUNT = 14;

/** Soft round glow sprite for neurons, signals and surface glints. */
function makeGlowTexture() {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const glow = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  glow.addColorStop(0, "rgba(255,255,255,1)");
  glow.addColorStop(0.3, "rgba(200,225,255,0.5)");
  glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

const NOISE_SEEDS = [
  { axis: new THREE.Vector3(0.6, 0.8, 0.1).normalize(), freq: 2.6, amp: 0.035, phase: 0.4 },
  { axis: new THREE.Vector3(-0.3, 0.5, 0.9).normalize(), freq: 3.8, amp: 0.028, phase: 1.9 },
  { axis: new THREE.Vector3(0.9, -0.2, 0.4).normalize(), freq: 5.6, amp: 0.019, phase: 3.1 },
  { axis: new THREE.Vector3(-0.7, -0.5, 0.6).normalize(), freq: 7.8, amp: 0.012, phase: 0.8 },
  { axis: new THREE.Vector3(0.2, 0.9, -0.5).normalize(), freq: 9.8, amp: 0.008, phase: 2.4 },
];

function noiseAt(dir: THREE.Vector3) {
  let n = 0;
  for (const s of NOISE_SEEDS) n += s.amp * Math.sin(s.freq * dir.dot(s.axis) * Math.PI + s.phase);
  return n;
}

const randomDir = () =>
  new THREE.Vector3(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1).normalize();

/** Anatomical silhouette shared by every point: rounded overall, only the
 * very base tapers in for the brainstem. Applied after the two lobes are
 * offset apart. */
function applyBrainSilhouette(v: THREE.Vector3) {
  v.z *= 0.92;
  if (v.y < -0.5) v.y = -0.5 + (v.y + 0.5) * 0.55;
  return v;
}

const LOBE_OFFSET = 0.3;
const GAP_HALF_WIDTH = 0.15;

/** Hard-clamps a point off the sagittal midline so the fissure is genuinely
 * empty space (not just a density gradient) — each lobe's sphere naturally
 * extends past the midline, so a soft carve alone lets the two sides bleed
 * into each other. Left unclamped low down, where the lobes should visibly
 * join like the brainstem does. */
function clampOffMidline(p: THREE.Vector3, sideSign: number) {
  if (p.y > -0.45) {
    p.x = sideSign < 0 ? Math.min(p.x, -GAP_HALF_WIDTH) : Math.max(p.x, GAP_HALF_WIDTH);
  }
  return p;
}

/** A point on (or near) one hemisphere's folded surface. Two explicit,
 * separately-centered lobes — not one sphere with a carved dent — so the
 * bilateral split reads unmistakably as a brain rather than a fuzzy blob. */
function lobeSurfacePoint(sideSign: number) {
  const dir = randomDir();
  const r = 0.78 + noiseAt(dir);
  const p = dir.clone().multiplyScalar(Math.max(0.3, r));
  p.x += sideSign * LOBE_OFFSET;
  applyBrainSilhouette(p);
  return clampOffMidline(p, sideSign);
}

/** A point inside one hemisphere's volume, for the neuron/connectome cloud. */
function lobeInteriorPoint(sideSign: number) {
  const dir = randomDir();
  const depth = 0.15 + Math.random() * 0.42;
  const p = dir.clone().multiplyScalar(depth);
  p.x += sideSign * LOBE_OFFSET;
  applyBrainSilhouette(p);
  return clampOffMidline(p, sideSign);
}

/** A dense field of glinting points traced over the folded shell surface —
 * a holographic brain made of light, so it renders reliably at any size
 * without depending on PBR lighting. */
function buildShell(count: number) {
  const points: THREE.Vector3[] = [];
  const phases: number[] = [];
  const speeds: number[] = [];

  for (let i = 0; i < count; i++) {
    points.push(lobeSurfacePoint(i % 2 === 0 ? -1 : 1));
    phases.push(Math.random() * Math.PI * 2);
    speeds.push(0.4 + Math.random() * 1.3);
  }

  return { points, phases, speeds };
}

/** Cortex-biased neuron cloud nestled inside the shell, connected by short
 * dendrites, with synapses firing and signals travelling between them. */
function buildBrain() {
  const nodes: THREE.Vector3[] = [];
  const phases: number[] = [];
  const speeds: number[] = [];

  for (let i = 0; i < NODE_COUNT; i++) {
    nodes.push(lobeInteriorPoint(i % 2 === 0 ? -1 : 1));
    phases.push(Math.random() * Math.PI * 2);
    speeds.push(0.5 + Math.random() * 1.1);
  }

  const seen = new Set<string>();
  const edges: [number, number][] = [];
  for (let i = 0; i < NODE_COUNT; i++) {
    // Same-hemisphere neighbors first, so dendrites stay inside each lobe
    // instead of criss-crossing straight through the middle like a wireframe ball.
    const dists = nodes
      .map((p, j) => ({ j, d: p.distanceToSquared(nodes[i]) }))
      .filter(({ j }) => j !== i)
      .sort((a, b) => {
        const crossA = Math.sign(nodes[a.j].x) === Math.sign(nodes[i].x) ? 0 : 1;
        const crossB = Math.sign(nodes[b.j].x) === Math.sign(nodes[i].x) ? 0 : 1;
        return crossA !== crossB ? crossA - crossB : a.d - b.d;
      });
    for (let k = 0; k < 2; k++) {
      const j = dists[k].j;
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (!seen.has(key)) {
        seen.add(key);
        edges.push([i, j]);
      }
    }
  }

  return { nodes, phases, speeds, edges };
}

/** The living brain at the center of the knowledge graph — the connectivity
 * core the assembled nodes visibly orbit and connect through. Nested inside
 * KnowledgeSphere's own scene (not a separate canvas) so the graph's nodes
 * and links correctly occlude it in 3D. */
export default function NeuralCore() {
  const group = useRef<THREE.Group>(null);
  const shell = useRef<THREE.Points>(null);
  const neurons = useRef<THREE.Points>(null);
  const dendrites = useRef<THREE.LineSegments>(null);
  const signals = useRef<THREE.Points>(null);

  const shellData = useMemo(() => buildShell(SHELL_COUNT), []);
  const data = useMemo(buildBrain, []);
  const glowTexture = useMemo(makeGlowTexture, []);
  const tmpColor = useMemo(() => new THREE.Color(), []);

  const shellPositions = useMemo(() => {
    const arr = new Float32Array(SHELL_COUNT * 3);
    shellData.points.forEach((p, i) => p.toArray(arr, i * 3));
    return arr;
  }, [shellData]);
  const shellColors = useMemo(() => new Float32Array(SHELL_COUNT * 3), []);

  const nodePositions = useMemo(() => {
    const arr = new Float32Array(NODE_COUNT * 3);
    data.nodes.forEach((p, i) => p.toArray(arr, i * 3));
    return arr;
  }, [data]);
  const nodeColors = useMemo(() => new Float32Array(NODE_COUNT * 3), []);
  const fires = useMemo(() => new Float32Array(NODE_COUNT), []);

  const linePositions = useMemo(() => {
    const arr = new Float32Array(data.edges.length * 6);
    data.edges.forEach(([a, b], j) => {
      data.nodes[a].toArray(arr, j * 6);
      data.nodes[b].toArray(arr, j * 6 + 3);
    });
    return arr;
  }, [data]);
  const lineColors = useMemo(() => new Float32Array(data.edges.length * 6), [data]);

  const pulseState = useMemo(
    () => ({
      edge: Array.from({ length: PULSE_COUNT }, () =>
        Math.floor(Math.random() * data.edges.length)
      ),
      progress: Array.from({ length: PULSE_COUNT }, () => Math.random()),
      speed: Array.from({ length: PULSE_COUNT }, () => 0.5 + Math.random() * 0.9),
    }),
    [data]
  );
  const pulsePositions = useMemo(() => new Float32Array(PULSE_COUNT * 3), []);
  const pulseColors = useMemo(() => new Float32Array(PULSE_COUNT * 3), []);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    if (group.current) {
      group.current.rotation.y += delta * 0.22;
      group.current.rotation.x = 0.2 + Math.sin(t * 0.5) * 0.04;
    }

    // Shell glints: the folded silhouette stays continuously visible, with a
    // gentle shimmer travelling across it so it reads as a living surface.
    for (let i = 0; i < SHELL_COUNT; i++) {
      const twinkle =
        0.5 +
        0.5 *
          Math.pow(Math.max(0, Math.sin(t * shellData.speeds[i] + shellData.phases[i])), 3);
      tmpColor.copy(BLUE).lerp(CYAN, 0.25 + 0.25 * Math.sin(t * 0.3 + shellData.phases[i]));
      const o = i * 3;
      shellColors[o] = tmpColor.r * twinkle;
      shellColors[o + 1] = tmpColor.g * twinkle;
      shellColors[o + 2] = tmpColor.b * twinkle;
    }
    if (shell.current) {
      shell.current.geometry.attributes.color.needsUpdate = true;
    }

    // Synapses firing: sharp bright flashes on individual neurons
    for (let i = 0; i < NODE_COUNT; i++) {
      const fire = Math.pow(
        Math.max(0, Math.sin(t * data.speeds[i] + data.phases[i])),
        10
      );
      fires[i] = fire;
      const drift = 0.5 + 0.5 * Math.sin(t * 0.4 + data.phases[i]);
      tmpColor
        .copy(BLUE)
        .lerp(VIOLET, drift * 0.4)
        .lerp(CYAN, fire)
        .multiplyScalar(0.95 + 1.8 * fire);
      const o = i * 3;
      nodeColors[o] = tmpColor.r;
      nodeColors[o + 1] = tmpColor.g;
      nodeColors[o + 2] = tmpColor.b;
    }
    if (neurons.current) {
      neurons.current.geometry.attributes.color.needsUpdate = true;
    }

    // Dendrites glow when either endpoint fires
    for (let j = 0; j < data.edges.length; j++) {
      const [a, b] = data.edges[j];
      const fire = Math.max(fires[a], fires[b]);
      tmpColor
        .copy(BLUE)
        .lerp(CYAN, fire)
        .multiplyScalar(0.3 + 1.1 * fire);
      const o = j * 6;
      lineColors[o] = tmpColor.r;
      lineColors[o + 1] = tmpColor.g;
      lineColors[o + 2] = tmpColor.b;
      lineColors[o + 3] = tmpColor.r;
      lineColors[o + 4] = tmpColor.g;
      lineColors[o + 5] = tmpColor.b;
    }
    if (dendrites.current) {
      dendrites.current.geometry.attributes.color.needsUpdate = true;
    }

    // Signals travelling between neurons
    for (let k = 0; k < PULSE_COUNT; k++) {
      pulseState.progress[k] += pulseState.speed[k] * delta;
      if (pulseState.progress[k] >= 1) {
        pulseState.progress[k] = 0;
        pulseState.edge[k] = Math.floor(Math.random() * data.edges.length);
        pulseState.speed[k] = 0.5 + Math.random() * 0.9;
      }
      const [a, b] = data.edges[pulseState.edge[k]];
      const pr = pulseState.progress[k];
      const pa = data.nodes[a];
      const pb = data.nodes[b];
      const o = k * 3;
      pulsePositions[o] = pa.x + (pb.x - pa.x) * pr;
      pulsePositions[o + 1] = pa.y + (pb.y - pa.y) * pr;
      pulsePositions[o + 2] = pa.z + (pb.z - pa.z) * pr;
      const intensity = Math.sin(Math.PI * pr) * 1.5;
      pulseColors[o] = CYAN.r * intensity;
      pulseColors[o + 1] = CYAN.g * intensity;
      pulseColors[o + 2] = CYAN.b * intensity;
    }
    if (signals.current) {
      signals.current.geometry.attributes.position.needsUpdate = true;
      signals.current.geometry.attributes.color.needsUpdate = true;
    }
  });

  return (
    <group ref={group} scale={0.85}>
      <points ref={shell}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[shellPositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[shellColors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          map={glowTexture}
          vertexColors
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          size={0.1}
          sizeAttenuation
          toneMapped={false}
        />
      </points>

      <points ref={neurons}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[nodePositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[nodeColors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          map={glowTexture}
          vertexColors
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          size={0.16}
          sizeAttenuation
          toneMapped={false}
        />
      </points>

      <lineSegments ref={dendrites}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[lineColors, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          vertexColors
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </lineSegments>

      <points ref={signals}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[pulsePositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[pulseColors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          map={glowTexture}
          vertexColors
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          size={0.12}
          sizeAttenuation
          toneMapped={false}
        />
      </points>
    </group>
  );
}
