"use client";

import { Environment, Lightformer } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import NeuralCore from "./NeuralCore";
import { SceneCanvas } from "./SceneCanvas";

const DEEP = new THREE.Color("#2b3a8c"); // deep indigo base
const BLUE = new THREE.Color("#3d7bff"); // electric blue
const CYAN = new THREE.Color("#35d6ff"); // intelligence cyan
const SPARKLE_TINT = new THREE.Color("#cfe4ff");

const SPHERE_RADIUS = 1.75;
const ASSEMBLE_START = 0.5;
const ASSEMBLE_DURATION = 1.9;
const LINK_START = 2.3;

function easeInOutCubic(x: number) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

function clamp01(x: number) {
  return Math.min(1, Math.max(0, x));
}

/** Evenly distributed points on a sphere (fibonacci lattice). */
function fibonacciSphere(count: number, radius: number) {
  const points: THREE.Vector3[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    points.push(
      new THREE.Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r).multiplyScalar(radius)
    );
  }
  return points;
}

/** Soft glow with a 4-point star cross — the node sparkle sprite. */
function makeStarTexture() {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const glow = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  glow.addColorStop(0, "rgba(255,255,255,1)");
  glow.addColorStop(0.2, "rgba(190,225,255,0.55)");
  glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, size, size);
  ctx.globalCompositeOperation = "lighter";
  const ray = ctx.createLinearGradient(0, 30, 0, 34);
  ray.addColorStop(0, "rgba(255,255,255,0)");
  ray.addColorStop(0.5, "rgba(255,255,255,0.95)");
  ray.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = ray;
  ctx.fillRect(2, 30, 60, 4);
  ctx.save();
  ctx.translate(32, 32);
  ctx.rotate(Math.PI / 2);
  ctx.translate(-32, -32);
  ctx.fillRect(2, 30, 60, 4);
  ctx.restore();
  return new THREE.CanvasTexture(canvas);
}

type GraphData = {
  targets: THREE.Vector3[];
  scatters: THREE.Vector3[];
  delays: number[];
  sizes: number[];
  glass: number[];
  metal: number[];
  sparklePhases: number[];
  sparkleSpeeds: number[];
  edges: [number, number][];
  edgeDelays: number[];
  edgePhases: number[];
};

function buildGraph(count: number): GraphData {
  const targets = fibonacciSphere(count, SPHERE_RADIUS);
  const scatters: THREE.Vector3[] = [];
  const delays: number[] = [];
  const sizes: number[] = [];
  const glass: number[] = [];
  const metal: number[] = [];
  const sparklePhases: number[] = [];
  const sparkleSpeeds: number[] = [];

  for (let i = 0; i < count; i++) {
    scatters.push(
      targets[i]
        .clone()
        .multiplyScalar(1.7 + Math.random() * 1.6)
        .add(
          new THREE.Vector3(
            (Math.random() - 0.5) * 2.4,
            (Math.random() - 0.5) * 2.4,
            (Math.random() - 0.5) * 2.4
          )
        )
    );
    delays.push(Math.random() * 1.2);
    sizes.push(0.05 + Math.random() * 0.06);
    sparklePhases.push(Math.random() * Math.PI * 2);
    sparkleSpeeds.push(0.6 + Math.random() * 0.8);
    (Math.random() < 0.62 ? glass : metal).push(i);
  }

  const seen = new Set<string>();
  const edges: [number, number][] = [];
  for (let i = 0; i < count; i++) {
    const dists = targets
      .map((p, j) => ({ j, d: p.distanceToSquared(targets[i]) }))
      .filter(({ j }) => j !== i)
      .sort((a, b) => a.d - b.d);
    for (let k = 0; k < 2; k++) {
      const j = dists[k].j;
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (!seen.has(key)) {
        seen.add(key);
        edges.push([i, j]);
      }
    }
  }

  return {
    targets,
    scatters,
    delays,
    sizes,
    glass,
    metal,
    sparklePhases,
    sparkleSpeeds,
    edges,
    edgeDelays: edges.map(() => LINK_START + Math.random() * 1.5),
    edgePhases: edges.map(() => Math.random() * Math.PI * 2),
  };
}

function Graph({ quality }: { quality: "high" | "low" }) {
  const count = quality === "high" ? 120 : 70;
  const pulseCount = quality === "high" ? 58 : 26;
  const data = useMemo(() => buildGraph(count), [count]);

  const tilt = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const glassMesh = useRef<THREE.InstancedMesh>(null);
  const metalMesh = useRef<THREE.InstancedMesh>(null);
  const lines = useRef<THREE.LineSegments>(null);
  const sparkles = useRef<THREE.Points>(null);
  const pulsePoints = useRef<THREE.Points>(null);
  const coreLight = useRef<THREE.PointLight>(null);

  const gl = useThree((s) => s.gl);
  const starTexture = useMemo(makeStarTexture, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const tmpColor = useMemo(() => new THREE.Color(), []);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const pointerNdc = useRef(new THREE.Vector2(10, 10)); // starts offscreen
  const localRay = useMemo(() => new THREE.Ray(), []);
  const invMatrix = useMemo(() => new THREE.Matrix4(), []);

  const nodePositions = useMemo(() => data.targets.map((p) => p.clone()), [data]);
  const influences = useMemo(() => new Float32Array(count), [count]);
  const linePositions = useMemo(() => new Float32Array(data.edges.length * 6), [data]);
  const lineColors = useMemo(() => new Float32Array(data.edges.length * 6), [data]);
  const sparklePositions = useMemo(() => new Float32Array(count * 3), [count]);
  const sparkleColors = useMemo(() => new Float32Array(count * 3), [count]);
  const pulseState = useMemo(
    () => ({
      edge: Array.from({ length: pulseCount }, () =>
        Math.floor(Math.random() * data.edges.length)
      ),
      progress: Array.from({ length: pulseCount }, () => Math.random()),
      speed: Array.from({ length: pulseCount }, () => 0.3 + Math.random() * 0.5),
    }),
    [pulseCount, data]
  );
  const pulsePositions = useMemo(() => new Float32Array(pulseCount * 3), [pulseCount]);
  const pulseColors = useMemo(() => new Float32Array(pulseCount * 3), [pulseCount]);

  // Track the cursor without capturing pointer events from the page
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const rect = gl.domElement.getBoundingClientRect();
      pointerNdc.current.set(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );
    };
    const onLeave = () => pointerNdc.current.set(10, 10);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, [gl]);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const scroll = clamp01(window.scrollY / window.innerHeight);

    // Camera dolly inward while the structure assembles
    const dollyEase = easeInOutCubic(clamp01((t - 0.2) / 3));
    state.camera.position.z = 11.6 - 3.4 * dollyEase;

    // Parallax tilt toward the cursor; drift + release on scroll
    if (tilt.current) {
      const px = pointerNdc.current.x > 5 ? 0 : pointerNdc.current.x;
      const py = pointerNdc.current.y > 5 ? 0 : pointerNdc.current.y;
      tilt.current.rotation.x = THREE.MathUtils.damp(
        tilt.current.rotation.x, 0.25 - py * 0.14, 4, delta
      );
      tilt.current.rotation.z = THREE.MathUtils.damp(
        tilt.current.rotation.z, 0.05 + px * 0.1, 4, delta
      );
      tilt.current.position.y = 2.4 * scroll;
    }
    if (spin.current) {
      spin.current.rotation.y += delta * 0.12 * (1 + 2.6 * scroll);
      spin.current.scale.setScalar(1 + 0.024 * Math.sin(t * 1.2));
    }
    if (coreLight.current) {
      coreLight.current.intensity = 5 + 2.2 * Math.sin(t * 1.2);
    }

    // Cursor ray in the sphere's local space → per-node hover influence
    let hoverEnabled = pointerNdc.current.x < 5;
    if (spin.current && hoverEnabled) {
      raycaster.setFromCamera(pointerNdc.current, state.camera);
      invMatrix.copy(spin.current.matrixWorld).invert();
      localRay.copy(raycaster.ray).applyMatrix4(invMatrix);
    } else {
      hoverEnabled = false;
    }

    const linkFade = 1 - 0.6 * scroll;
    const disperse = 1 + 0.4 * scroll;

    for (let i = 0; i < count; i++) {
      const e = easeInOutCubic(
        clamp01((t - ASSEMBLE_START - data.delays[i]) / ASSEMBLE_DURATION)
      );
      const p = nodePositions[i];
      p.lerpVectors(data.scatters[i], data.targets[i], e);
      const wobble = (1 - e) * 0.22;
      p.x += Math.sin(t * 1.4 + i * 1.7) * wobble;
      p.y += Math.cos(t * 1.1 + i * 2.3) * wobble;
      p.z += Math.sin(t * 1.7 + i * 0.9) * wobble;
      p.addScaledVector(
        data.targets[i],
        (e * Math.sin(t * 0.9 + i) * 0.018) / SPHERE_RADIUS
      );
      // Scroll gently disperses the assembled lattice
      p.multiplyScalar(1 + (disperse - 1) * e);

      // Hover influence eases in and out
      const target = hoverEnabled
        ? Math.pow(Math.max(0, 1 - localRay.distanceToPoint(p) / 1.4), 2)
        : 0;
      influences[i] += (target - influences[i]) * Math.min(1, delta * 10);
    }

    const writeInstances = (mesh: THREE.InstancedMesh | null, indices: number[]) => {
      if (!mesh) return;
      indices.forEach((nodeIndex, k) => {
        const e = easeInOutCubic(
          clamp01((t - ASSEMBLE_START - data.delays[nodeIndex]) / ASSEMBLE_DURATION)
        );
        dummy.position.copy(nodePositions[nodeIndex]);
        dummy.scale.setScalar(
          data.sizes[nodeIndex] * (0.55 + 0.45 * e) * (1 + 1.1 * influences[nodeIndex])
        );
        dummy.updateMatrix();
        mesh.setMatrixAt(k, dummy.matrix);
      });
      mesh.instanceMatrix.needsUpdate = true;
    };
    writeInstances(glassMesh.current, data.glass);
    writeInstances(metalMesh.current, data.metal);

    // Links: blink in, shimmer indigo → electric blue, surge cyan near cursor
    for (let j = 0; j < data.edges.length; j++) {
      const [a, b] = data.edges[j];
      const o = j * 6;
      const pa = nodePositions[a];
      const pb = nodePositions[b];
      linePositions[o] = pa.x;
      linePositions[o + 1] = pa.y;
      linePositions[o + 2] = pa.z;
      linePositions[o + 3] = pb.x;
      linePositions[o + 4] = pb.y;
      linePositions[o + 5] = pb.z;

      const blink = clamp01((t - data.edgeDelays[j]) / 0.45);
      const shimmer = 0.5 + 0.5 * Math.sin(t * 0.8 + data.edgePhases[j]);
      const hover = Math.max(influences[a], influences[b]);
      const energy =
        blink *
        linkFade *
        (0.55 + 0.45 * Math.sin(t * 1.6 + data.edgePhases[j] * 2)) *
        (1 + 2.4 * hover);
      tmpColor
        .copy(DEEP)
        .lerp(BLUE, shimmer)
        .lerp(CYAN, Math.min(1, hover * 1.2))
        .multiplyScalar(energy * 1.9);
      lineColors[o] = tmpColor.r;
      lineColors[o + 1] = tmpColor.g;
      lineColors[o + 2] = tmpColor.b;
      lineColors[o + 3] = tmpColor.r;
      lineColors[o + 4] = tmpColor.g;
      lineColors[o + 5] = tmpColor.b;
    }
    if (lines.current) {
      lines.current.geometry.attributes.position.needsUpdate = true;
      lines.current.geometry.attributes.color.needsUpdate = true;
    }

    // Sparkling stars: rare sharp twinkles, brightened near the cursor
    for (let i = 0; i < count; i++) {
      const o = i * 3;
      const p = nodePositions[i];
      sparklePositions[o] = p.x;
      sparklePositions[o + 1] = p.y;
      sparklePositions[o + 2] = p.z;
      const twinkle =
        Math.pow(
          Math.max(0, Math.sin(t * data.sparkleSpeeds[i] + data.sparklePhases[i])),
          8
        ) * 1.3;
      const glow = (0.12 + twinkle + influences[i] * 2.2) * clamp01((t - LINK_START) / 1);
      sparkleColors[o] = SPARKLE_TINT.r * glow;
      sparkleColors[o + 1] = SPARKLE_TINT.g * glow;
      sparkleColors[o + 2] = SPARKLE_TINT.b * glow;
    }
    if (sparkles.current) {
      sparkles.current.geometry.attributes.position.needsUpdate = true;
      sparkles.current.geometry.attributes.color.needsUpdate = true;
    }

    // Data pulses: bright packets travelling along the links
    const pulsesLive = clamp01((t - LINK_START - 0.8) / 1);
    for (let k = 0; k < pulseCount; k++) {
      pulseState.progress[k] += pulseState.speed[k] * delta;
      if (pulseState.progress[k] >= 1) {
        pulseState.progress[k] = 0;
        pulseState.edge[k] = Math.floor(Math.random() * data.edges.length);
        pulseState.speed[k] = 0.3 + Math.random() * 0.5;
      }
      const [a, b] = data.edges[pulseState.edge[k]];
      const pr = pulseState.progress[k];
      const o = k * 3;
      pulsePositions[o] = nodePositions[a].x + (nodePositions[b].x - nodePositions[a].x) * pr;
      pulsePositions[o + 1] = nodePositions[a].y + (nodePositions[b].y - nodePositions[a].y) * pr;
      pulsePositions[o + 2] = nodePositions[a].z + (nodePositions[b].z - nodePositions[a].z) * pr;
      const intensity = Math.sin(Math.PI * pr) * pulsesLive * linkFade * 1.6;
      pulseColors[o] = CYAN.r * intensity;
      pulseColors[o + 1] = CYAN.g * intensity;
      pulseColors[o + 2] = CYAN.b * intensity;
    }
    if (pulsePoints.current) {
      pulsePoints.current.geometry.attributes.position.needsUpdate = true;
      pulsePoints.current.geometry.attributes.color.needsUpdate = true;
    }
  });

  const segments = quality === "high" ? 24 : 14;

  return (
    <group ref={tilt} rotation={[0.25, 0, 0.05]}>
      <group ref={spin}>
        {/* Frosted glassmorphic nodes */}
        <instancedMesh ref={glassMesh} args={[undefined, undefined, data.glass.length]}>
          <sphereGeometry args={[1, segments, segments]} />
          <meshPhysicalMaterial
            color="#cdd8f0"
            roughness={0.38}
            metalness={0.05}
            transparent
            opacity={0.7}
            clearcoat={0.9}
            clearcoatRoughness={0.3}
            envMapIntensity={1.3}
          />
        </instancedMesh>

        {/* Dark metallic data nodes */}
        <instancedMesh ref={metalMesh} args={[undefined, undefined, data.metal.length]}>
          <sphereGeometry args={[1, segments, segments]} />
          <meshStandardMaterial
            color="#10151f"
            metalness={0.95}
            roughness={0.28}
            envMapIntensity={1.6}
          />
        </instancedMesh>

        {/* Luminescent vector links */}
        <lineSegments ref={lines}>
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

        {/* Sparkling stars on the nodes */}
        <points ref={sparkles}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[sparklePositions, 3]} />
            <bufferAttribute attach="attributes-color" args={[sparkleColors, 3]} />
          </bufferGeometry>
          <pointsMaterial
            map={starTexture}
            vertexColors
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            size={0.42}
            sizeAttenuation
            toneMapped={false}
          />
        </points>

        {/* Data packets flowing through the network */}
        <points ref={pulsePoints}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[pulsePositions, 3]} />
            <bufferAttribute attach="attributes-color" args={[pulseColors, 3]} />
          </bufferGeometry>
          <pointsMaterial
            map={starTexture}
            vertexColors
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            size={0.2}
            sizeAttenuation
            toneMapped={false}
          />
        </points>

        {/* The living brain at the center — the graph nodes surround and
            connect through it, making the core of the connectivity literal */}
        <group scale={0.8}>
          <NeuralCore />
        </group>
        <pointLight ref={coreLight} color="#3d7bff" distance={7} decay={2} intensity={5} />
      </group>
    </group>
  );
}

export default function KnowledgeSphere() {
  const [quality, setQuality] = useState<"high" | "low">("high");

  useEffect(() => {
    const small = window.innerWidth < 768;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (small || coarse) setQuality("low");
  }, []);

  return (
    <SceneCanvas
      className="absolute inset-0"
      camera={{ position: [0, 0, 11.6], fov: 42 }}
    >
      <ambientLight intensity={0.22} />
      {/* Minimalist studio: soft key + cool rim lights off the glass */}
      <directionalLight position={[4, 6, 6]} intensity={1.1} color="#dfe6ff" />
      <directionalLight position={[-6, 2, -4]} intensity={2.2} color="#3d7bff" />
      <directionalLight position={[5, -3, -4]} intensity={2.2} color="#35d6ff" />
      <Graph quality={quality} />
      <Environment resolution={256}>
        <Lightformer intensity={4} position={[0, 5, 2]} scale={[10, 1.5, 1]} color="#ffffff" />
        <Lightformer intensity={5} position={[-5, 1, 3]} rotation={[0, Math.PI / 3, 0]} scale={[3, 6, 1]} color="#3d7bff" />
        <Lightformer intensity={4} position={[5, -0.5, 2]} rotation={[0, -Math.PI / 3, 0]} scale={[3, 6, 1]} color="#35d6ff" />
      </Environment>
    </SceneCanvas>
  );
}
