# BrainOS — Landing Page

The public face of **BrainOS**, the enterprise AI operating system by **Brainers Labs**.
A dark, glass, 3D-native landing page built to feel expensive: every pixel has a reason.

## Stack

- **Next.js 15** (App Router, Turbopack) + **React 19** + **TypeScript**
- **Tailwind CSS v4** — design tokens live in `app/globals.css` under `@theme`
- **Framer Motion** — scroll storytelling, reveals, magnetic buttons, cursor
- **React Three Fiber + Three.js** — neural field, brain core, knowledge graph (custom GLSL)
- **@react-three/postprocessing** — bloom on the hero
- **Lenis** — smooth scrolling
- **Lucide** — icons

## Run

```bash
npm install
npm run dev    # http://localhost:3000
npm run build && npm start
```

## Architecture

```
app/
  layout.tsx        SEO + Open Graph metadata, fonts (Geist), viewport/theme
  page.tsx          Section composition
  globals.css       Design tokens (@theme), glass/noise/gradient utilities
  loading.tsx       Route-level loading state
  not-found.tsx     404 ("This page isn't in the graph.")
  icon.svg          Favicon (also public/apple-icon.png, public/og.png)
components/
  chrome/           Navbar, Footer, Preloader, ScrollProgress, CustomCursor, SmoothScroll
  ui/               Reveal/Stagger (scroll entrances), MagneticButton, SectionHeading, BrainMark
  three/            SceneCanvas (visibility-gated render loop), NeuralField, BrainCore,
                    GraphScene (interactive knowledge graph), HeroScene, MiniCoreScene
  sections/         Hero, Problem, HowItWorks, KnowledgeGraphSection, SearchExperience,
                    Dashboard, Security, Integrations, Comparison, Testimonials, FinalCTA
```

## Design tokens

| Token | Value | Use |
| --- | --- | --- |
| `space` | `#05070A` | Primary background |
| `ink` | `#0B1020` | Secondary background |
| `accent` | `#3B82F6` | Electric blue |
| `violet` | `#7C5CFC` | AI purple |
| `success` / `warning` | `#18C964` / `#F5A524` | Status |
| `text-secondary` / `text-muted` | `#B8C2D1` / `#7A8797` | Copy |
| `card` / `edge` | `rgba(255,255,255,.04)` / `rgba(255,255,255,.08)` | Glass surfaces |

Utilities: `.glass`, `.glass-strong`, `.noise`, `.gradient-text`, `.text-glow`, `.hairline-gradient`.

## Performance notes

- All Three.js code is **dynamically imported** (`ssr: false`) — first-load JS stays ~190 kB.
- `SceneCanvas` stops the WebGL render loop entirely when a scene scrolls off screen.
- Hero quality auto-degrades on small/touch screens (fewer nodes, no bloom, core recedes).
- `prefers-reduced-motion` disables smooth scroll, custom cursor, and entrance animations.
- Fully static export-able: every route pre-renders (`○ Static`).
