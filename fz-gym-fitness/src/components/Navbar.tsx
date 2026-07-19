"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { navLinks } from "@/config/siteConfig";
import { generalWhatsappUrl } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-white/10 bg-base/80 backdrop-blur-md"
          : "bg-transparent"
      )}
    >
      <nav
        className="container-px flex h-16 items-center justify-between"
        aria-label="Primary"
      >
        {/* Logo */}
        <a
          href="#home"
          className="flex items-center gap-2"
          aria-label="F Z Gym & Fitness home"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-lime/60 bg-lime/10 font-display text-lg font-bold text-lime shadow-neon-lime">
            FZ
          </span>
          <span className="hidden font-display text-lg font-semibold uppercase tracking-wide text-ink sm:block">
            Gym &amp; Fitness
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm font-medium text-muted transition-colors hover:text-lime"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a
            href={generalWhatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-full bg-lime px-5 py-2 text-sm font-semibold text-base transition-all hover:shadow-neon-lime hover:brightness-110 sm:inline-flex"
          >
            Join Now
          </a>

          {/* Mobile toggle */}
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-ink lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-white/10 bg-base/95 backdrop-blur-md lg:hidden">
          <ul className="container-px flex flex-col gap-1 py-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-3 text-base font-medium text-ink transition-colors hover:bg-white/5 hover:text-lime"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="mt-2">
              <a
                href={generalWhatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="block rounded-full bg-lime px-5 py-3 text-center text-base font-semibold text-base"
              >
                Join Now
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
