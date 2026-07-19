import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-base px-6">
      <div className="glass-card max-w-md p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-lime/50 bg-surface/60 font-display text-xl font-bold text-lime shadow-neon-lime">
          FZ
        </div>
        <h1 className="heading mt-6 text-5xl neon-text">404</h1>
        <p className="mt-3 text-sm text-muted">
          This page took a rest day. Let&apos;s get you back to the main floor.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-lime px-6 py-3 text-sm font-semibold text-base transition-all hover:shadow-neon-lime hover:brightness-110"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
