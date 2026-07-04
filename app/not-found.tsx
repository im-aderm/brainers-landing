import Link from "next/link";
import { BrainMark } from "@/components/ui/BrainMark";

export default function NotFound() {
  return (
    <main className="relative flex min-h-svh flex-col items-center justify-center gap-8 overflow-hidden px-6 text-center">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/8 blur-[120px]" />
      <div className="animate-pulse-soft">
        <BrainMark size={64} />
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-text-muted">Error 404</p>
        <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          This page isn&apos;t in the graph.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-text-secondary">
          Even the best knowledge graph has edges. The page you&apos;re looking for
          doesn&apos;t exist — but everything else is one click away.
        </p>
      </div>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-white shadow-[0_0_32px_rgba(59,130,246,0.45)] transition-colors hover:bg-[#4b8ef7]"
      >
        Back to BrainOS
      </Link>
    </main>
  );
}
