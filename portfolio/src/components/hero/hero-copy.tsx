"use client";

import { useEffect, useState } from "react";
import { ArrowDown, ArrowUpRight, FileText } from "lucide-react";
import {
  contact,
  headlineVariant,
  headlines,
  isPlaceholder,
  profile,
  real,
} from "@/data/portfolio";
import { SafeLink, Text } from "@/components/ui/content";
import { LiquidGlass } from "@/components/ui/liquid-glass";
import { useReducedMotionPreference } from "@/hooks/use-reduced-motion-preference";

/**
 * The typed boot sequence, used only by the "terminal" headline variant.
 *
 * The finished text is always in the DOM — the typing is a visual overlay on
 * top of content that already exists. Screen readers get the whole block at
 * once (the animated copy is `aria-hidden`), and any click, key press or
 * reduced-motion preference completes it instantly.
 */
function TerminalSequence({ lines }: { lines: string[] }) {
  const reduced = useReducedMotionPreference();
  const [done, setDone] = useState(false);
  const [shown, setShown] = useState(0);

  const full = lines.join("\n");

  useEffect(() => {
    if (reduced) {
      setDone(true);
      return;
    }
    let raf = 0;
    let last = performance.now();
    let count = 0;
    const CPS = 1000 / 40; // ~40ms per character

    const step = (now: number) => {
      if (now - last >= CPS) {
        last = now;
        count += 1;
        setShown(count);
        if (count >= full.length) {
          setDone(true);
          return;
        }
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);

    const skip = () => {
      cancelAnimationFrame(raf);
      setDone(true);
    };
    window.addEventListener("keydown", skip, { once: true });
    window.addEventListener("pointerdown", skip, { once: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
    };
  }, [full.length, reduced]);

  const visible = done ? full : full.slice(0, shown);

  return (
    <div className="mono text-sm leading-relaxed text-ink-soft">
      {/* The real content, always present for assistive technology. */}
      <span className="sr-only">{full}</span>
      <pre aria-hidden="true" className="whitespace-pre-wrap font-[inherit]">
        {visible}
        {!done ? <span className="animate-pulse text-accent">▍</span> : null}
      </pre>
    </div>
  );
}

export function HeroCopy() {
  const isTerminal = headlineVariant === "terminal";
  const name = profile.name;
  const role = profile.role;
  const domain = profile.domain;
  const status = profile.currentStatus;
  const availability = real(profile.availability);
  const resume = contact.resume;

  return (
    <div className="relative z-10 max-w-2xl" data-choreo="hero-copy">
      {/* Status pill — only rendered when availability is a real value. */}
      {availability ? (
        <div className="mb-7 inline-flex">
          <LiquidGlass className="flex items-center gap-2.5 rounded-full px-4 py-2">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full rounded-full bg-success opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
            </span>
            <span className="mono text-xs tracking-wide text-ink-soft">
              {availability}
            </span>
          </LiquidGlass>
        </div>
      ) : null}

      {isTerminal ? (
        <>
          <h1 className="text-hero">
            <span className="mono block text-lg text-accent">$ whoami</span>
            <span className="mt-3 block">
              <Text value={name} />
            </span>
            <span className="mt-2 block text-ink-soft">{headlines.terminal}</span>
          </h1>
          <div className="mt-8">
            <TerminalSequence
              lines={[
                "> loading profile...",
                `> name: ${name}`,
                `> stack: ${profile.domain}`,
                `> status: ${profile.availability}`,
                "> _",
              ]}
            />
          </div>
        </>
      ) : (
        <h1 className="text-hero">{headlines[headlineVariant]}</h1>
      )}

      {!isTerminal ? (
        <p className="mt-7 max-w-xl text-lg text-ink-soft">
          <Text value={role} /> focused on <Text value={domain} />.
          <br />
          Currently <Text value={status} />.
        </p>
      ) : null}

      <div className="mt-10 flex flex-wrap items-center gap-3">
        <a href="#work" className="btn btn-primary">
          View my work
          <ArrowDown className="h-4 w-4" aria-hidden="true" />
        </a>
        <a href="#contact" className="btn btn-ghost">
          Get in touch
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </a>
        {/* Only shown when a real file or URL exists. */}
        {!isPlaceholder(resume) ? (
          <SafeLink
            href={resume}
            className="btn btn-quiet inline-flex items-center gap-2 text-sm underline decoration-line-strong underline-offset-4 hover:decoration-accent"
          >
            <FileText className="h-4 w-4" aria-hidden="true" />
            Download résumé
          </SafeLink>
        ) : null}
      </div>
    </div>
  );
}
