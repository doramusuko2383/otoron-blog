import { getAllPosts } from "../lib/posts";

export const revalidate = 3600;

export default async function sitemap() {
  const base = "https://playotoron.com/blog";
  const posts = getAllPosts().map(p => ({
    url: `${base}/posts/${p.slug}`,
    lastModified: p.updated ?? p.date
  }));
  return [{ url: `${base}`, lastModified: new Date().toISOString() }, ...posts];
}
