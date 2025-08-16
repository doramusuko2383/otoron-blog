import { ImageResponse } from "next/og";

// ImageResponse は Edge で動かす
export const runtime = "edge";

type Ctx = { params: { slug: string } };

export async function GET(_req: Request, { params }: Ctx) {
  // fsを使わずに slug から見出しを作る（最低限の表示）
  const title =
    decodeURIComponent(params.slug ?? "")
      .replace(/-/g, " ")
      .trim() || "OTORON 公式ブログ";

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fff",
          color: "#111",
          fontSize: 64,
          fontWeight: 700,
          padding: 80,
          letterSpacing: "-0.02em",
        }}
      >
        {title} — OTORON
      </div>
    ),
    { width: 1200, height: 630 } // ← ここでサイズ指定（exportしない）
  );
}

