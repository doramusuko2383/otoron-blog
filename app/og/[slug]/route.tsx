import { ImageResponse } from 'next/server';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const BRAND = {
  bg: '#F8FAFC',        // 背景
  fg: '#60A5FA',        // アクセント（ライトブルー）
  text: '#0F172A',      // 濃い文字
  sub: '#334155',       // サブ文字
};

function abs(base: string, u?: string) {
  if (!u) return '';
  return u.startsWith('http') ? u : `${base}${u}`;
}

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;

  // Node ランタイムのメタAPIを叩いて記事情報を取得
  const res = await fetch(`${origin}/api/post-meta/${params.slug}`, { cache: 'no-store' });
  const meta = res.ok ? await res.json() : null;

  const title = meta?.title ?? 'オトロン公式ブログ';
  const description = meta?.description ?? '絶対音感トレーニングのノウハウ、幼児の耳育て、アプリ活用ガイド。';
  const thumb = abs(origin, meta?.ogImage || meta?.thumb);
  const mascot = `${origin}/otoron.webp`;

  // 背景用のサムネ（任意）
  const bgImage = thumb ? (
    // ImageResponse は <img> の外部URLを解決可能（絶対URL必須）
    <img
      src={thumb}
      width={1200}
      height={630}
      style={{
        position: 'absolute',
        inset: 0,
        objectFit: 'cover',
        opacity: 0.12,
        filter: 'grayscale(20%)',
      }}
    />
  ) : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: size.width,
          height: size.height,
          display: 'flex',
          flexDirection: 'column',
          background: BRAND.bg,
          position: 'relative',
          padding: 48,
        }}
      >
        {bgImage}

        {/* 右上マスコット */}
        <div style={{ position: 'absolute', top: 28, right: 28, width: 96, height: 96 }}>
          <img src={mascot} width={96} height={96} style={{ objectFit: 'contain' }} />
        </div>

        {/* アクセント帯 */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: '100%',
            height: 12,
            background: BRAND.fg,
          }}
        />

        {/* テキスト */}
        <div
          style={{
            marginTop: 12,
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
          }}
        >
          <div
            style={{
              fontSize: 56,
              lineHeight: 1.25,
              color: BRAND.text,
              fontWeight: 800,
              maxWidth: 1000,
              letterSpacing: '-0.5px',
              whiteSpace: 'pre-wrap',
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 28,
              lineHeight: 1.5,
              color: BRAND.sub,
              maxWidth: 1000,
              whiteSpace: 'pre-wrap',
            }}
          >
            {description}
          </div>
          <div style={{ marginTop: 8, fontSize: 22, color: BRAND.sub }}>OTORON BLOG</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
