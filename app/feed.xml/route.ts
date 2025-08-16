import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/posts";

export async function GET() {
  const BASE = "https://playotoron.com";
  const items = getAllPosts()
    .map(
      (p) => `
    <item>
      <title><![CDATA[${p.title}]]></title>
      <link>${BASE}/blog/posts/${p.slug}</link>
      <guid>${BASE}/blog/posts/${p.slug}</guid>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <description><![CDATA[${p.description}]]></description>
    </item>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>オトロン公式ブログ</title>
    <link>${BASE}/blog</link>
    <description>絶対音感トレーニングのノウハウ、幼児の耳育て、アプリ活用ガイド</description>
    ${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: { "content-type": "application/rss+xml; charset=utf-8" },
  });
}
