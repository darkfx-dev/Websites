"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface the error for debugging without breaking the UI.
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-base px-6">
      <div className="glass-card max-w-md p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-redx/60 bg-redx/10 font-display text-xl font-bold text-redx shadow-neon-red">
          FZ
        </div>
        <h1 className="heading mt-6 text-2xl text-ink">Something went wrong</h1>
        <p className="mt-3 text-sm text-muted">
          We hit an unexpected error. Please try again — or reach us directly on
          WhatsApp and we&apos;ll help you out.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 inline-flex items-center justify-center rounded-full bg-lime px-6 py-3 text-sm font-semibold text-base transition-all hover:shadow-neon-lime hover:brightness-110"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
