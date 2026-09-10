import { ImageResponse } from "next/og";
import { getMediaBySlug } from "@/lib/media/client";
import { formatDuration } from "@/lib/utils";

export const runtime = "nodejs";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const media = await getMediaBySlug(slug);

  const title = media?.title || "Adalwise Lecture";
  const speaker = media?.speaker.name || "Dr. Hafiz Haseeb";
  const category = media?.category || "Archival Lecture";
  const duration = media ? formatDuration(media.durationSeconds) : "";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#00261a",
          color: "#fff9e9",
          padding: "60px",
          fontFamily: "serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: "24px",
            border: "2px solid #cea72c",
            display: "flex",
          }}
        />

        {/* Top Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#ffe08e",
            }}
          >
            LECTURE ARCHIVE • {category}
          </div>
          {duration && (
            <div
              style={{
                fontSize: "18px",
                color: "#00261a",
                backgroundColor: "#ffe08e",
                padding: "4px 12px",
                borderRadius: "999px",
                fontWeight: "bold",
              }}
            >
              {duration}
            </div>
          )}
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: "44px",
            fontWeight: "bold",
            color: "#ffffff",
            lineHeight: 1.2,
            maxWidth: "1000px",
          }}
        >
          {title}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            borderTop: "1px solid rgba(232, 226, 209, 0.3)",
            paddingTop: "24px",
          }}
        >
          <div style={{ fontSize: "22px", color: "#e8e2d1" }}>{speaker}</div>
          <div style={{ fontSize: "20px", color: "#cea72c" }}>•</div>
          <div style={{ fontSize: "20px", color: "#a2d1bb" }}>Adalwise Institute</div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
