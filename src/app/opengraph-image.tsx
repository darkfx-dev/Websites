import { ImageResponse } from "next/og";
import { business } from "@/data/business";
import { outlets } from "@/data/outlets";

/**
 * Social share card, generated at build time.
 *
 * `twitter.card` is declared as `summary_large_image` and Open Graph expects an
 * image; without one, every share of this site renders as a bare link. This is
 * the only thing that changes — the card is never displayed on the site, so it
 * has no bearing on the approved UI.
 *
 * Drawn from the brand palette in `tailwind.config.ts` (charcoal / saffron /
 * cream) and states only facts already present on the page.
 */
export const alt = `${business.name} — ${outlets.length} outlets across ${business.city}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#15120F",
          color: "#FFF8EB",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 28,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "#F2A93B",
            fontWeight: 600,
          }}
        >
          {business.type}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 24,
            fontSize: 96,
            fontWeight: 700,
            fontFamily: "serif",
            lineHeight: 1.05,
          }}
        >
          {business.name}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 44,
            color: "#F2A93B",
            fontWeight: 600,
          }}
        >
          {business.tagline}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 36,
            fontSize: 30,
            color: "rgba(255,248,235,0.72)",
          }}
        >
          {business.cuisines.join("  ·  ")}
        </div>
      </div>
    ),
    { ...size }
  );
}
