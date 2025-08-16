import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { getAllPostsMeta } from '@/lib/posts';

export const runtime = 'nodejs';

function siteBase() {
  const h = headers();
  const proto = h.get('x-forwarded-proto') ?? 'https';
  const host = h.get('host') ?? process.env.NEXT_PUBLIC_SITE_HOST; // 例: otoron-blog.vercel.app
  const envBase = process.env.NEXT_PUBLIC_SITE_URL; // 例: https://otoron.jp
  return envBase ?? (host ? `${proto}://${host}` : 'http://localhost:3000');
}

export async function GET() {
  const SITE = siteBase();
  const posts = (await getAllPostsMeta())
    .filter(p => !p.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 20);

  const items = posts.map(p => {
    const url = `${SITE}/blog/posts/${p.slug}`;
    const pubDate = new Date(p.date).toUTCString();
    return `
      <item>
        <title><![CDATA[${p.title}]]></title>
        <link>${url}</link>
        <guid>${url}</guid>
        <pubDate>${pubDate}</pubDate>
        <description><![CDATA[${p.description ?? ''}]]></description>
      </item>
    `;
  }).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0">
    <channel>
      <title>オトロンブログ</title>
      <link>${SITE}/blog</link>
      <description>公式サイトと統一感のある軽量ブログ</description>
      ${items}
    </channel>
  </rss>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 's-maxage=300, stale-while-revalidate',
    },
  });
}

