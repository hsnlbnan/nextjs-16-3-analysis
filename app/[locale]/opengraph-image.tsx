import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Instant Lab — the Next.js 16.3 rendering model, measured";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#111214",
          color: "#f7f7f8",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              fontSize: 24,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#5ecfe0",
            }}
          >
            Next.js 16.3
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              fontSize: 92,
              lineHeight: 1.02,
              letterSpacing: -3,
              maxWidth: 900,
            }}
          >
            The rendering model, measured.
          </div>
          <div style={{ fontSize: 30, color: "#a1a1aa", maxWidth: 860 }}>
            Suspense, Partial Prerendering, Cache Components and Partial
            Prefetching — with real routes and real timings.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 36,
            fontSize: 24,
            color: "#71717a",
          }}
        >
          <span style={{ color: "#f7f7f8" }}>Instant Lab</span>
          <span style={{ color: "#e0a75e" }}>◐ shell + stream</span>
          <span>Nothing here is simulated</span>
        </div>
      </div>
    ),
    size,
  );
}
