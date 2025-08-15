import { getAllPosts } from "../../lib/posts";

const BASE = "https://playotoron.com";

export async function GET() {
  const items = getAllPosts().map(p => `
    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${BASE}/blog/posts/${p.slug}</link>
      <guid>${BASE}/blog/posts/${p.slug}</guid>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <description>${escapeXml(p.description || "")}</description>
    </item>
  `).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0">
    <channel>
      <title>オトロン公式ブログ</title>
      <link>${BASE}/blog</link>
      <description>絶対音感トレーニング『オトロン』の公式ブログ。</description>
      ${items}
    </channel>
  </rss>`;

  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}

function escapeXml(s) {
  return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}
