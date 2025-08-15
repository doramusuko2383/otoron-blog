import { getAllPosts } from "../lib/posts";

export default async function sitemap() {
  const base = "https://playotoron.com/blog";
  const posts = getAllPosts().map(p => ({
    url: `${base}/posts/${p.slug}`,
    lastModified: p.date
  }));
  return [
    { url: `${base}`, lastModified: new Date().toISOString() },
    ...posts
  ];
}
