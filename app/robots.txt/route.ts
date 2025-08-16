import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export const runtime = 'nodejs'; // 静的でも可。統一のためNodeに。

function siteBase() {
  const h = headers();
  const proto = h.get('x-forwarded-proto') ?? 'https';
  const host = h.get('host') ?? process.env.NEXT_PUBLIC_SITE_HOST;
  const envBase = process.env.NEXT_PUBLIC_SITE_URL;
  return envBase ?? (host ? `${proto}://${host}` : 'http://localhost:3000');
}

export async function GET() {
  const SITE = siteBase();
  const body = `User-agent: *
Allow: /
Sitemap: ${SITE}/sitemap.xml
`;
  return new NextResponse(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 's-maxage=300, stale-while-revalidate',
    },
  });
}

