import { ImageResponse } from "next/og";

// Code-generated app icon (no binary asset needed): a saffron "M" wordmark
// initial on Spiced Charcoal, matching the brand palette.
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

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
          background: "#15120F",
          color: "#F2A93B",
          fontSize: 42,
          fontWeight: 700,
          fontFamily: "serif",
          borderRadius: 12,
        }}
      >
        M
      </div>
    ),
    { ...size }
  );
}
