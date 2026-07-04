"use client";

import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { SceneCanvas } from "./SceneCanvas";

export type GraphNode = {
  id: number;
  label: string;
  type: "document" | "policy" | "person" | "system";
};

const NODE_LABELS: Array<[string, GraphNode["type"]]> = [
  ["Compliance Policy v4", "policy"],
  ["AML Regulation 2025", "policy"],
  ["Employee Handbook", "document"],
  ["Q3 Board Deck", "document"],
  ["Customer Contract — Zenith", "document"],
  ["Data Retention Policy", "policy"],
  ["Slack #operations", "system"],
  ["Risk Committee Minutes", "document"],
  ["KYC Procedure", "policy"],
  ["Head of Compliance", "person"],
  ["Core Banking API Spec", "document"],
  ["Incident Report 0142", "document"],
  ["Vendor Due Diligence", "policy"],
  ["Finance Shared Drive", "system"],
  ["Audit Trail 2026", "document"],
  ["Branch Ops Manual", "document"],
  ["CTO Office", "person"],
  ["Regulatory Filing Q2", "document"],
  ["Jira — Project Atlas", "system"],
  ["Credit Risk Model", "document"],
  ["Onboarding Checklist", "document"],
  ["Legal Review Notes", "document"],
  ["HR Leave Policy", "policy"],
  ["Treasury Playbook", "document"],
];

const TYPE_COLOR: Record<GraphNode["type"], string> = {
  document: "#3b82f6",
  policy: "#7c5cfc",
  person: "#18c964",
  system: "#f5a524",
};

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

function buildGraph() {
  const rng = mulberry32(42);
  const nodes = NODE_LABELS.map(([label, type], id) => {
    // Even distribution over a sphere (golden spiral), with varied radii.
    const i = id + 0.5;
    const phi = Math.acos(1 - (2 * i) / NODE_LABELS.length);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    const r = 1.5 + rng() * 0.85;
    return {
      id,
      label,
      type,
      position: new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.cos(phi),
        r * Math.sin(phi) * Math.sin(theta),
      ),
    };
  });

  // Each node connects to its two nearest neighbours.
  const edges: Array<[number, number]> = [];
  const seen = new Set<string>();
  for (const n of nodes) {
    const sorted = nodes
      .filter((m) => m.id !== n.id)
      .sort((a, b) => a.position.distanceTo(n.position) - b.position.distanceTo(n.position))
      .slice(0, 2);
    for (const m of sorted) {
      const key = [Math.min(n.id, m.id), Math.max(n.id, m.id)].join("-");
      if (!seen.has(key)) {
        seen.add(key);
        edges.push([n.id, m.id]);
      }
    }
  }
  return { nodes, edges };
}

const SHELL_VERT = /* glsl */ `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const SHELL_FRAG = /* glsl */ `
  varying vec3 vNormal;
  void main() {
    float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 3.2);
    gl_FragColor = vec4(vec3(0.35, 0.55, 0.98), fresnel * 0.4);
  }
`;

function Graph({ onHover }: { onHover?: (node: GraphNode | null) => void }) {
  const { nodes, edges } = useMemo(buildGraph, []);
  const group = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const hoveredRef = useRef<number | null>(null);
  hoveredRef.current = hovered;

  const edgeGeo = useMemo(() => {
    const positions = new Float32Array(edges.length * 6);
    edges.forEach(([a, b], i) => {
      positions.set(nodes[a].position.toArray(), i * 6);
      positions.set(nodes[b].position.toArray(), i * 6 + 3);
    });
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [nodes, edges]);

  const litEdgeGeo = useMemo(() => {
    if (hovered === null) return null;
    const connected = edges.filter(([a, b]) => a === hovered || b === hovered);
    if (!connected.length) return null;
    const positions = new Float32Array(connected.length * 6);
    connected.forEach(([a, b], i) => {
      positions.set(nodes[a].position.toArray(), i * 6);
      positions.set(nodes[b].position.toArray(), i * 6 + 3);
    });
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [hovered, nodes, edges]);

  useFrame((_, delta) => {
    if (group.current && hoveredRef.current === null) {
      group.current.rotation.y += delta * 0.12;
    }
  });

  function setHover(id: number | null) {
    setHovered(id);
    onHover?.(id === null ? null : nodes[id]);
    document.body.style.cursor = ""; // native cursor stays hidden; ring handles feedback
  }

  return (
    <group ref={group}>
      {/* Glass sphere containing the graph */}
      <mesh>
        <sphereGeometry args={[2.75, 48, 48]} />
        <shaderMaterial
          vertexShader={SHELL_VERT}
          fragmentShader={SHELL_FRAG}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <lineSegments geometry={edgeGeo}>
        <lineBasicMaterial color="#3d5f9e" transparent opacity={0.35} depthWrite={false} />
      </lineSegments>

      {litEdgeGeo && (
        <lineSegments geometry={litEdgeGeo}>
          <lineBasicMaterial
            color="#8ab4ff"
            transparent
            opacity={0.95}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </lineSegments>
      )}

      {nodes.map((n) => {
        const isHovered = hovered === n.id;
        return (
          <mesh
            key={n.id}
            position={n.position}
            scale={isHovered ? 1.9 : 1}
            onPointerOver={(e) => {
              e.stopPropagation();
              setHover(n.id);
            }}
            onPointerOut={() => setHover(null)}
          >
            <sphereGeometry args={[0.085, 16, 16]} />
            <meshBasicMaterial color={isHovered ? "#ffffff" : TYPE_COLOR[n.type]} />
            {isHovered && (
              <Html distanceFactor={7} position={[0, 0.22, 0]} center>
                <div className="pointer-events-none whitespace-nowrap rounded-lg border border-white/15 bg-[#0b1020]/90 px-3 py-1.5 text-xs font-medium text-white shadow-[0_0_24px_rgba(59,130,246,0.4)] backdrop-blur">
                  {n.label}
                </div>
              </Html>
            )}
          </mesh>
        );
      })}
    </group>
  );
}

export default function GraphScene({
  onHover,
}: {
  onHover?: (node: GraphNode | null) => void;
}) {
  return (
    <SceneCanvas className="h-full w-full" camera={{ position: [0, 0, 7.2], fov: 42 }}>
      <Graph onHover={onHover} />
    </SceneCanvas>
  );
}
