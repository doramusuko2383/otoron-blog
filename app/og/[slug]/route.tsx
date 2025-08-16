import { ImageResponse } from "next/og";
import { getPost } from "@/lib/posts";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  const p = getPost(params.slug);
  const title = p?.title ?? "OTORON BLOG";

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "64px 72px",
          background: "linear-gradient(135deg,#ffffff,#f7f5ff)",
          fontFamily: "system-ui, -apple-system, Segoe UI, Noto Sans JP, sans-serif",
        }}
      >
        <div style={{ fontSize: 30, color: "#6c46ff", marginBottom: 16 }}>OTORON BLOG</div>
        <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.15, whiteSpace: "pre-wrap" }}>
          {title}
        </div>
        <div style={{ position: "absolute", bottom: 40, right: 72, fontSize: 28, opacity: .7 }}>
          playotoron.com
        </div>
      </div>
    ),
    size
  );
}
