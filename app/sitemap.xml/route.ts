import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { getAllPostsMeta } from '@/lib/posts';
import { getAllTags } from '@/lib/tags';

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
  const tags = await getAllTags();
  const nowISO = new Date().toISOString();

  const urls = [
    { loc: `${SITE}/blog`, lastmod: nowISO },
    ...posts.map((p: any) => ({
      loc: `${SITE}/blog/posts/${p.slug}`,
      lastmod: new Date(p.date).toISOString(),
    })),
  ];
  for (const t of tags) {
    urls.push({ loc: `${SITE}/blog/tags/${t.slug}`, lastmod: nowISO });
  }

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

