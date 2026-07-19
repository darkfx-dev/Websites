import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/siteConfig";

export const runtime = "edge";
export const alt = "F Z Gym & Fitness — Gym in Rustampura, Surat";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        backgroundColor: "#07090B",
        backgroundImage:
          "radial-gradient(circle at 80% 20%, rgba(0,229,255,0.18), transparent 45%), radial-gradient(circle at 15% 85%, rgba(183,255,0,0.20), transparent 45%)",
        padding: "80px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
          border: "3px solid #B7FF00",
          borderRadius: 20,
          padding: "10px 26px",
          color: "#B7FF00",
          fontSize: 44,
          fontWeight: 800,
          letterSpacing: 2,
        }}
      >
        FZ
      </div>
      <div
        style={{
          marginTop: 36,
          fontSize: 76,
          fontWeight: 900,
          color: "#F7F9FC",
          lineHeight: 1.05,
        }}
      >
        F Z Gym &amp; Fitness
      </div>
      <div
        style={{
          marginTop: 16,
          fontSize: 40,
          fontWeight: 700,
          color: "#00E5FF",
        }}
      >
        Build Strength. Transform Your Life.
      </div>
      <div
        style={{
          marginTop: 28,
          fontSize: 30,
          color: "#AAB2BD",
        }}
      >
        {`${siteConfig.rating} / 5 · ${siteConfig.reviewCount} Reviews · Rustampura, Surat`}
      </div>
    </div>,
    { ...size }
  );
}
