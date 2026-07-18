import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(circle at 30% 20%, #6C5CE7 0%, #07060D 45%), #07060D",
          color: "#FBF6EA",
          fontSize: 64,
          fontStyle: "italic",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 8, textTransform: "uppercase", color: "#E8C766", marginBottom: 24 }}>
          Keepsake
        </div>
        <div style={{ display: "flex", padding: "0 80px", textAlign: "center" }}>A Letter For You</div>
      </div>
    ),
    { ...size }
  );
}
