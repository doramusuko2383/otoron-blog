export const runtime = "nodejs";
import PostCard from "@/components/PostCard";
import { getAllTags, getPostsByTag, getTagName } from "@/lib/tags";

export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.map((t) => ({ tag: t.slug }));
}

export async function generateMetadata({ params }: { params: { tag: string } }) {
  const name = await getTagName(params.tag);
  return {
    title: `「${name}」の記事 | オトロン公式ブログ`,
    description: `タグ「${name}」の記事一覧です。`,
    alternates: { canonical: `/blog/tags/${params.tag}` },
  };
}

export default async function TagPage({ params }: { params: { tag: string } }) {
  const posts = await getPostsByTag(params.tag);
  const name = await getTagName(params.tag);
  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-xl font-semibold">タグ: {name}</h1>
      <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {posts.map((p: any) => (
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
