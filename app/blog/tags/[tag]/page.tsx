import { getAllPostsMeta } from "@/lib/posts";

export const revalidate = 300; // ISR 任意
export const dynamic = "force-static"; // 任意
export const dynamicParams = true;

export async function generateStaticParams() {
  const posts = await getAllPostsMeta();
  const set = new Set<string>();
  posts.forEach((p) =>
    (p.tags ?? []).forEach((t: string) => set.add(String(t).trim()))
  );
  // ★ ここは「エンコードしない」そのまま返す
  return Array.from(set).map((tag) => ({ tag }));
}

export default async function TagPage({ params }: { params: { tag: string } }) {
  const tag = params.tag.trim(); // Next 側ですでに decode 済み
  const all = await getAllPostsMeta();
  const posts = all.filter((p) =>
    (p.tags ?? []).map((s: string) => s.trim()).includes(tag)
  );

  if (!posts.length) {
    return (
      <div className="prose mx-auto p-6">
        「{tag}」のタグ記事はまだありません。
      </div>
    );
  }

  return (
    <main className="container prose">
      <h1>#{tag}</h1>
      <ul>
        {posts.map((p) => (
          <li key={p.slug}>
            <a href={`/blog/posts/${p.slug}`} className="link-plain">
              {p.title}
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
