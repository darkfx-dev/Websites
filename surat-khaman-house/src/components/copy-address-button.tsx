"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/**
 * Copies the address and confirms it in an `aria-live` region, so the result
 * is announced rather than only shown.
 *
 * If the Clipboard API is unavailable or blocked, the button says so instead
 * of silently claiming success — the address is visible on the page directly
 * above, so there is always a working fallback.
 */
export function CopyAddressButton({ address }: { address: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timeout.current) clearTimeout(timeout.current);
    },
    [],
  );

  async function copy() {
    try {
      await navigator.clipboard.writeText(address);
      setState("copied");
    } catch {
      setState("failed");
    }
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(() => setState("idle"), 2400);
  }

  return (
    <>
      <button
        type="button"
        onClick={copy}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-card border border-[rgba(10,10,10,0.16)] bg-surface px-5 text-sm font-semibold text-ink transition-colors duration-150 hover:bg-surface-muted"
      >
        {state === "copied" ? (
          <Check className="h-4 w-4" aria-hidden />
        ) : (
          <Copy className="h-4 w-4" aria-hidden />
        )}
        Copy Address
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {state === "copied"
          ? "Address copied to clipboard"
          : state === "failed"
            ? "Could not copy automatically. The address is shown on the page."
            : ""}
      </span>
    </>
  );
}
