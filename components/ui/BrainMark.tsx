/** The BrainersOS logomark — a neural core in a rounded square. Pure SVG, no assets. */
export function BrainMark({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <rect
        x="1"
        y="1"
        width="30"
        height="30"
        rx="9"
        stroke="url(#bm-edge)"
        strokeWidth="1.25"
        fill="rgba(255,255,255,0.03)"
      />
      <circle cx="16" cy="16" r="3.2" fill="url(#bm-core)" />
      <circle cx="16" cy="16" r="6.5" stroke="rgba(59,130,246,0.55)" strokeWidth="0.9" />
      <g stroke="rgba(184,194,209,0.6)" strokeWidth="0.9" strokeLinecap="round">
        <line x1="16" y1="9.5" x2="16" y2="6.5" />
        <line x1="16" y1="22.5" x2="16" y2="25.5" />
        <line x1="9.5" y1="16" x2="6.5" y2="16" />
        <line x1="22.5" y1="16" x2="25.5" y2="16" />
        <line x1="11.4" y1="11.4" x2="9.2" y2="9.2" />
        <line x1="20.6" y1="20.6" x2="22.8" y2="22.8" />
      </g>
      <g fill="#7C5CFC">
        <circle cx="16" cy="6.5" r="1.1" />
        <circle cx="25.5" cy="16" r="1.1" />
        <circle cx="9.2" cy="9.2" r="1.1" />
      </g>
      <g fill="#3B82F6">
        <circle cx="16" cy="25.5" r="1.1" />
        <circle cx="6.5" cy="16" r="1.1" />
        <circle cx="22.8" cy="22.8" r="1.1" />
      </g>
      <defs>
        <linearGradient id="bm-edge" x1="0" y1="0" x2="32" y2="32">
          <stop stopColor="#3B82F6" stopOpacity="0.8" />
          <stop offset="1" stopColor="#7C5CFC" stopOpacity="0.8" />
        </linearGradient>
        <radialGradient id="bm-core" cx="0.35" cy="0.35" r="1">
          <stop stopColor="#9EC2FF" />
          <stop offset="1" stopColor="#3B82F6" />
        </radialGradient>
      </defs>
    </svg>
  );
}
