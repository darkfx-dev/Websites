import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

/**
 * 404.
 *
 * Says what happened and offers the one useful action, rather than a joke
 * about the void. No 3D scene here — someone who has already failed to reach
 * the page they wanted should not wait on a WebGL context to be told so.
 */
export default function NotFound() {
  return (
    <main
      id="main"
      className="grid min-h-[100svh] place-items-center px-6 text-center"
    >
      <div>
        <p className="eyebrow">Error 404</p>
        <h1 className="mt-5 text-2xl">This page does not exist</h1>
        <p className="mx-auto mt-5 max-w-prose text-base text-ink-soft">
          The address may have changed, or it may never have been here. Nothing
          is broken on your end.
        </p>
        <Link href="/" className="btn btn-primary mt-9">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to the homepage
        </Link>
      </div>
    </main>
  );
}
