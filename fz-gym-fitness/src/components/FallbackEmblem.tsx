import { cn } from "@/lib/utils";

/**
 * Lightweight non-WebGL fallback (also used as the loading state for the 3D
 * scene). Pure CSS — a glowing "FZ" monogram emblem. No canvas required.
 */
export function FallbackEmblem({ loading = false }: { loading?: boolean }) {
  return (
    <div
      className="relative flex aspect-square w-full max-w-md items-center justify-center"
      role="img"
      aria-label="F Z Gym & Fitness neon emblem"
    >
      {/* Glow rings */}
      <div className="absolute h-64 w-64 rounded-full bg-lime/20 blur-3xl" />
      <div className="absolute h-40 w-40 rounded-full bg-cyan/20 blur-2xl" />

      <div
        className={cn(
          "relative flex h-56 w-56 items-center justify-center rounded-3xl border-2 border-lime/50 bg-surface/60 backdrop-blur-sm",
          "shadow-neon-lime",
          !loading && "motion-safe:animate-float"
        )}
      >
        <span className="neon-text font-display text-8xl font-bold tracking-tight">
          FZ
        </span>
        {loading && (
          <span className="absolute -bottom-8 text-xs uppercase tracking-widest text-muted">
            Loading…
          </span>
        )}
      </div>
    </div>
  );
}
