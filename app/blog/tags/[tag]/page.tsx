import { notFound } from "next/navigation";
import PostCard from "@/components/PostCard";
import { getAllPostsMeta } from "@/lib/posts";

export async function generateStaticParams() {
  const posts = await getAllPostsMeta();
  const set = new Set<string>();
  posts.forEach(p => (p.tags ?? []).forEach((t: string) => set.add(t)));
  return Array.from(set).map(tag => ({ tag }));
}

export default async function TagPage({ params }: { params: { tag: string } }) {
  const posts = (await getAllPostsMeta()).filter(p => (p.tags ?? []).includes(params.tag));
  if (!posts.length) return notFound();

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">タグ: {params.tag}</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {posts.map(p => (
          <PostCard
            key={p.slug}
            slug={p.slug}
            title={p.title}
            description={p.description}
            date={p.date}
            thumb={p.thumb}
          />
        ))}
      </div>
    </main>
  );
}
