"use client";

import { useEffect, useRef, useState } from "react";

import { CheckIcon, CopyIcon } from "@/components/ui/icons";

/**
 * 083 — copy-address confirmation.
 *
 * The label changes to "Address copied", a polite live region announces it,
 * and the original label returns after two seconds without moving focus.
 * Failure is reported rather than silently showing success.
 */
export function CopyAddress({ address }: { address: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(address);
      setState("copied");
    } catch {
      setState("failed");
    }
    timer.current = setTimeout(() => setState("idle"), 2000);
  }

  const label =
    state === "copied"
      ? "Address copied"
      : state === "failed"
        ? "Copy failed — select the address above"
        : "Copy address";

  return (
    <>
      <button
        type="button"
        onClick={copy}
        className="inline-flex min-h-[44px] items-center justify-center gap-2.5 rounded-md border border-border-strong bg-surface px-5 py-2.5 text-[0.9375rem] font-semibold text-ink transition-colors duration-[160ms] hover:bg-surface-subtle"
      >
        {state === "copied" ? <CheckIcon /> : <CopyIcon />}
        <span className="transition-opacity duration-[160ms]">{label}</span>
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {state === "idle" ? "" : label}
      </span>
    </>
  );
}
