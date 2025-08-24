import { notFound } from "next/navigation";
import { getAllPostsMeta } from "@/lib/posts";

export const revalidate = 300; // ISR 任意
export const dynamic = "force-static"; // 任意

export async function generateStaticParams() {
  const posts = await getAllPostsMeta();
  const set = new Set<string>();
  posts.forEach((p) => (p.tags ?? []).forEach((t: string) => set.add(String(t))));
  // ★ ここは「エンコードしない」そのまま返す
  return Array.from(set).map((tag) => ({ tag }));
}

export default async function TagPage({ params }: { params: { tag: string } }) {
  const tag = params.tag; // Next 側ですでに decode 済み
  const posts = (await getAllPostsMeta()).filter((p) => (p.tags ?? []).includes(tag));
  if (posts.length === 0) return notFound();
  return (
    <main className="container prose">
      <h1>#{tag}</h1>
      <ul>
        {posts.map((p) => (
          <li key={p.slug}>
            <a href={`/blog/posts/${p.slug}`}>{p.title}</a>
          </li>
        ))}
      </ul>
    </main>
  );
}
