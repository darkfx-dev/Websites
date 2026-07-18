"use client";

import { LazyMotion } from "framer-motion";
import type { ReactNode } from "react";
import { MotionTierProvider } from "@/lib/motion";
import { CartProvider } from "@/lib/cart";

/**
 * Client-side motion shell: tier detection + order basket + Framer Motion's
 * lazy feature bundle. domMax (loaded async, off the critical path) is
 * required for the product-card layout animations in the ordering flow.
 */
const loadFeatures = () =>
  import("framer-motion").then((mod) => mod.domMax);

export default function MotionRoot({ children }: { children: ReactNode }) {
  return (
    <MotionTierProvider>
      <CartProvider>
        <LazyMotion features={loadFeatures} strict>
          {children}
        </LazyMotion>
      </CartProvider>
    </MotionTierProvider>
  );
}
