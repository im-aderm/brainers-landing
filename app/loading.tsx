import { BrainMark } from "@/components/ui/BrainMark";

export default function Loading() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-space">
      <div className="animate-pulse-soft drop-shadow-[0_0_40px_rgba(59,130,246,0.5)]">
        <BrainMark size={56} />
      </div>
      <p className="text-xs font-medium uppercase tracking-[0.3em] text-text-muted">
        Connecting intelligence…
      </p>
    </div>
  );
}
