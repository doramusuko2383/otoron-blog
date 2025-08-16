import { ImageResponse } from "next/og";
import { getPost } from "@/lib/posts";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  const p = getPost(params.slug);
  const title = p?.title ?? "OTORON BLOG";

  const brand = "#6c46ff";

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
          "--brand": brand,
          "--brand-100": "color-mix(in oklab, var(--brand), white 82%)",
          background: "linear-gradient(135deg,#ffffff,var(--brand-100))",
          fontFamily: "system-ui, -apple-system, Segoe UI, Noto Sans JP, sans-serif",
        }}
      >
        <div style={{ fontSize: 30, color: "var(--brand)", marginBottom: 16 }}>OTORON BLOG</div>
        <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.15, whiteSpace: "pre-wrap" }}>
          {title}
        </div>
        <div style={{ position: "absolute", bottom: 40, right: 72, fontSize: 28, opacity: .7, color: "var(--brand)" }}>
          playotoron.com
        </div>
      </div>
    ),
    size
  );
}
