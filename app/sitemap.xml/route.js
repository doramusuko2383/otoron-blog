import { getAllPosts } from "../../lib/posts";

export const revalidate = 3600;

export async function GET() {
  const base = "https://playotoron.com/blog";
  const posts = getAllPosts().map(p => `
    <url>
      <loc>${base}/posts/${p.slug}</loc>
      <lastmod>${p.updated ?? p.date}</lastmod>
    </url>
  `).join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${base}</loc><lastmod>${new Date().toISOString()}</lastmod></url>${posts}\n</urlset>`;
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400"
    }
  });
}
