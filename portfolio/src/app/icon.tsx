import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/**
 * The favicon: the hero's core and one orbit, reduced to 32px.
 *
 * Deliberately a mark rather than initials — initials would be derived from a
 * name that is still a placeholder, and a favicon reading "YN" would be a
 * small lie repeated in every browser tab.
 */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#07090d",
          borderRadius: 7,
        }}
      >
        <div
          style={{
            width: 26,
            height: 26,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "2px solid #8b97ff",
            borderRadius: 26,
          }}
        >
          <div
            style={{
              width: 9,
              height: 9,
              borderRadius: 9,
              background: "#f4f1e9",
            }}
          />
        </div>
      </div>
    ),
    size
  );
}
