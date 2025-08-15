import { getAllPosts } from "../../lib/posts";

export async function GET() {
  const data = getAllPosts().map(p => ({
    slug: p.slug,
    title: p.title,
    description: p.description,
    date: p.date
  }));
  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400"
    }
  });
}
