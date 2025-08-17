/* eslint-disable @next/next/no-img-element, jsx-a11y/alt-text */
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

const BRAND = { bg: '#F8FAFC', fg: '#60A5FA', text: '#0F172A', sub: '#334155' };

function abs(base: string, u?: string) {
  if (!u) return '';
  return u.startsWith('http') ? u : `${base}${u}`;
}

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;

  // Node ランタイムのメタAPIから記事情報を取得
  const res = await fetch(`${origin}/api/post-meta/${params.slug}`, { cache: 'no-store' });
  const meta = res.ok ? await res.json() : null;

  const title = meta?.title ?? 'オトロン公式ブログ';
  const description = meta?.description ?? '絶対音感トレーニングのノウハウ、幼児の耳育て、アプリ活用ガイド。';
  const thumb = abs(origin, meta?.ogImage || meta?.thumb);
  const mascot = `${origin}/otoron.webp`;

  return new ImageResponse(
    (
      <div
        style={{
          width: OG_WIDTH,
          height: OG_HEIGHT,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          background: BRAND.bg,
          padding: 48,
        }}
      >
        {thumb ? (
          <img
            src={thumb}
            width={OG_WIDTH}
            height={OG_HEIGHT}
            alt=""
            style={{ position: 'absolute', inset: 0, objectFit: 'cover', opacity: 0.12, filter: 'grayscale(20%)' }}
          />
        ) : null}

        <div style={{ position: 'absolute', top: 28, right: 28, width: 96, height: 96 }}>
          <img src={mascot} width={96} height={96} alt="OTORON" style={{ objectFit: 'contain' }} />
        </div>

        <div style={{ position: 'absolute', left: 0, bottom: 0, width: '100%', height: 12, background: BRAND.fg }} />

        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ fontSize: 56, lineHeight: 1.25, color: BRAND.text, fontWeight: 800, maxWidth: 1000, letterSpacing: '-0.5px', whiteSpace: 'pre-wrap' }}>
            {title}
          </div>
          <div style={{ fontSize: 28, lineHeight: 1.5, color: BRAND.sub, maxWidth: 1000, whiteSpace: 'pre-wrap' }}>
            {description}
          </div>
          <div style={{ marginTop: 8, fontSize: 22, color: BRAND.sub }}>OTORON BLOG</div>
        </div>
      </div>
    ),
    { width: OG_WIDTH, height: OG_HEIGHT }
  );
}

