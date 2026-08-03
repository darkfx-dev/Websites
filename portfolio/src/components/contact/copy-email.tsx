"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

/**
 * Copy-to-clipboard for the email address.
 *
 * Sits beside — never instead of — the plain `mailto:` link, because the
 * clipboard API is permission-gated and can fail. The result is announced in a
 * live region so the confirmation is not carried by the icon change alone, and
 * a failure says so rather than silently pretending it worked.
 */
export function CopyEmail({ email }: { email: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    window.clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(email);
      setState("copied");
    } catch {
      setState("failed");
    }
    timer.current = window.setTimeout(() => setState("idle"), 2600);
  };

  return (
    <>
      <button
        type="button"
        onClick={copy}
        className="btn btn-ghost"
        aria-label={`Copy the email address ${email} to the clipboard`}
      >
        {state === "copied" ? (
          <Check className="h-4 w-4 text-success" aria-hidden="true" />
        ) : (
          <Copy className="h-4 w-4" aria-hidden="true" />
        )}
        {state === "copied" ? "Copied" : "Copy address"}
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {state === "copied"
          ? "Email address copied to the clipboard."
          : state === "failed"
            ? "Could not copy automatically. Select the address and copy it manually."
            : ""}
      </span>
    </>
  );
}
