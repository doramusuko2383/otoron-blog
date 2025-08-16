import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { getAllPostsMeta } from '@/lib/posts';

export const runtime = 'nodejs';

function siteBase() {
  const h = headers();
  const proto = h.get('x-forwarded-proto') ?? 'https';
  const host = h.get('host') ?? process.env.NEXT_PUBLIC_SITE_HOST;
  const envBase = process.env.NEXT_PUBLIC_SITE_URL;
  return envBase ?? (host ? `${proto}://${host}` : 'http://localhost:3000');
}

export async function GET() {
  const SITE = siteBase();
  const posts = (await getAllPostsMeta() as any[]).filter((p: any) => !p.draft);

  const urls = [
    { loc: `${SITE}/blog`, lastmod: new Date().toISOString() },
    ...posts.map((p: any) => ({
      loc: `${SITE}/blog/posts/${p.slug}`,
      lastmod: new Date(p.date).toISOString(),
    })),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls.map(u => `<url><loc>${u.loc}</loc><lastmod>${u.lastmod}</lastmod></url>`).join('')}
  </urlset>`;

  return new NextResponse(body, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=300, stale-while-revalidate',
    },
  });
}

