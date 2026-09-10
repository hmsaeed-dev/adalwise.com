import { ImageResponse } from "next/og";
import { getArticleBySlug } from "@/lib/content/client";

export const runtime = "nodejs";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  const title = article?.frontmatter.title || "Adalwise Treatise";
  const author = article?.frontmatter.author.name || "Adalwise Institute";
  const category = article?.frontmatter.category || "Legal Treatises";

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

        {/* Header Tag */}
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
            ADALWISE • {category}
          </div>
          <div style={{ fontSize: "28px", color: "#ffe08e", fontWeight: "bold" }}>
            عدل و حکمت
          </div>
        </div>

        {/* Main Title */}
        <div
          style={{
            fontSize: "48px",
            fontWeight: "bold",
            color: "#ffffff",
            lineHeight: 1.2,
            maxWidth: "1000px",
          }}
        >
          {title}
        </div>

        {/* Footer Author */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            borderTop: "1px solid rgba(232, 226, 209, 0.3)",
            paddingTop: "24px",
          }}
        >
          <div style={{ fontSize: "22px", color: "#e8e2d1" }}>{author}</div>
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
