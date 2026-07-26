import { ImageResponse } from "next/og";
import { profile, real, site } from "@/data/portfolio";

export const alt = "Portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * The social preview card.
 *
 * Generated from the same data as the page, so it cannot drift out of sync
 * with it. Where a value is still a placeholder the card omits that line
 * rather than printing brackets into an image that gets cached by every
 * platform that sees it.
 *
 * Deliberately plain: no photo, no logo, no third-party font fetch. It is a
 * name and a sentence, rendered legibly at thumbnail size.
 */
export default function OpengraphImage() {
  const name = real(profile.name) ?? "Portfolio";
  const role = real(profile.role);
  const statement = real(site.ogStatement) ?? real(profile.domain);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#07090d",
          padding: "72px 80px",
          color: "#f4f1e9",
        }}
      >
        {/* A single soft accent glow, echoing the hero. */}
        <div
          style={{
            position: "absolute",
            top: -220,
            left: 380,
            width: 760,
            height: 640,
            background:
              "radial-gradient(closest-side, rgba(109,124,255,0.34), rgba(109,124,255,0))",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 12,
              background: "#8b97ff",
            }}
          />
          <div
            style={{
              fontSize: 22,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#8d94a2",
            }}
          >
            Portfolio
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 86, lineHeight: 1.04, letterSpacing: -2 }}>
            {name}
          </div>
          {role ? (
            <div style={{ marginTop: 22, fontSize: 36, color: "#b6bdc9" }}>
              {role}
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: "flex",
            borderTop: "1px solid rgba(255,255,255,0.14)",
            paddingTop: 26,
            fontSize: 26,
            color: "#b6bdc9",
          }}
        >
          {statement ?? ""}
        </div>
      </div>
    ),
    size
  );
}
