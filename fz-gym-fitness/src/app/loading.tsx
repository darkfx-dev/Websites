export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-base">
      <div className="flex flex-col items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-lime/50 bg-surface/60 font-display text-2xl font-bold text-lime shadow-neon-lime motion-safe:animate-pulse-glow">
          FZ
        </div>
        <p className="text-sm uppercase tracking-widest text-muted">Loading…</p>
      </div>
    </div>
  );
}
