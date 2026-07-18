"use client";

import { LazyMotion, domAnimation } from "framer-motion";
import type { ReactNode } from "react";
import { MotionTierProvider } from "@/lib/motion";

/**
 * Client-side motion shell: tier detection + Framer Motion's lazy feature
 * bundle (domAnimation keeps the initial JS payload small).
 */
export default function MotionRoot({ children }: { children: ReactNode }) {
  return (
    <MotionTierProvider>
      <LazyMotion features={domAnimation} strict>
        {children}
      </LazyMotion>
    </MotionTierProvider>
  );
}
