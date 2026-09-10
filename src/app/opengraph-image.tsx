import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const runtime = "nodejs";
export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#00261a",
          color: "#fff9e9",
          padding: "60px",
          fontFamily: "serif",
          position: "relative",
        }}
      >
        {/* Double Manuscript Framing Border (Jadwal) */}
        <div
          style={{
            position: "absolute",
            inset: "24px",
            border: "2px solid #cea72c",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: "30px",
            border: "1px solid rgba(206, 167, 44, 0.4)",
            display: "flex",
          }}
        />

        <div
          style={{
            fontSize: "48px",
            fontWeight: "bold",
            letterSpacing: "0.08em",
            color: "#ffe08e",
            marginBottom: "16px",
          }}
        >
          عدل و حکمت
        </div>

        <div
          style={{
            fontSize: "64px",
            fontWeight: "bold",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#ffffff",
            marginBottom: "16px",
          }}
        >
          ADALWISE
        </div>

        <div
          style={{
            fontSize: "24px",
            fontStyle: "italic",
            color: "#e8e2d1",
            maxWidth: "800px",
            textAlign: "center",
            lineHeight: 1.4,
          }}
        >
          Classical Jurisprudence &amp; Civic Constitutionalism
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
