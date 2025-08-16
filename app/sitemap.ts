import { getAllPosts } from "@/lib/posts";

export default function sitemap() {
  const BASE = "https://playotoron.com";
  const items = getAllPosts().map((p) => ({
    url: `${BASE}/blog/posts/${p.slug}`,
    lastModified: new Date(p.updated ?? p.date),
  }));

  return [
    { url: `${BASE}/blog`, lastModified: new Date() },
    ...items,
  ];
}
