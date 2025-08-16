/* eslint-disable react/jsx-key */
import { ImageResponse } from 'next/og';
import { getPost } from '@/lib/posts';

export const runtime = 'nodejs';
export async function GET(_: Request, { params }: { params: { slug: string } }) {
  const p: any = getPost(params.slug);
  return new ImageResponse(
    (
      <div style={{ fontSize: 64, width: 1200, height: 630, display: 'flex', padding: 80, background: '#fff' }}>
        <div style={{ fontSize: 48, fontWeight: 700, lineHeight: 1.2 }}>{p?.title ?? 'OTORON BLOG'}</div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
