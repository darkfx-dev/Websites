"use client";

import * as React from "react";
import { Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/icons";
import { useOutletTrigger } from "@/components/outlets/outlet-action-provider";

/**
 * The hero's three outlet-dependent CTAs.
 *
 * They live here, rather than in `hero-section.tsx`, so the hero itself stays a
 * Server Component: only these three buttons need client interactivity. Each
 * one opens the shared outlet selector instead of carrying a destination, since
 * there is no single "our WhatsApp", "our number" or "our address" to send
 * someone to. "Explore the Menu" stays in the hero — it only scrolls to the
 * shared menu, so making a visitor pick a branch just to browse would be
 * friction for nothing.
 */
export function HeroWhatsAppButton() {
  const trigger = useOutletTrigger(() => ({ type: "general-whatsapp" }));
  return (
    <Button variant="whatsapp" size="lg" {...trigger}>
      <WhatsAppIcon className="h-[18px] w-[18px]" />
      WhatsApp Us
    </Button>
  );
}

export function HeroCallButton() {
  const trigger = useOutletTrigger(() => ({ type: "call" }));
  return (
    <Button variant="secondary" {...trigger}>
      <Phone className="h-[18px] w-[18px]" aria-hidden="true" />
      Call Now
    </Button>
  );
}

export function HeroDirectionsButton() {
  const trigger = useOutletTrigger(() => ({ type: "directions" }));
  return (
    <Button variant="secondary" {...trigger}>
      <MapPin className="h-[18px] w-[18px]" aria-hidden="true" />
      Get Directions
    </Button>
  );
}
