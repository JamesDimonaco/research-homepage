import { ImageResponse } from "next/og";

export const alt = "Research Homepage - Professional Academic Websites";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#0f172a",
          color: "#f8fafc",
        }}
      >
        <div style={{ fontSize: 36, color: "#60a5fa" }}>Research Homepage</div>
        <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.1, marginTop: 24 }}>
          A website for your lab or your research
        </div>
        <div style={{ fontSize: 34, color: "#94a3b8", marginTop: 32 }}>
          Set up for you in 48 hours. Publications, talks, datasets, and a domain of your own.
        </div>
      </div>
    ),
    size,
  );
}
