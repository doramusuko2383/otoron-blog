export const runtime = "nodejs";
import PostCard from "@/components/PostCard";
import Reveal from "@/components/Reveal";
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
  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `タグ: ${name}`,
    itemListElement: posts.map((p: any, i: number) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `/blog/posts/${p.slug}`,
      name: p.title,
    })),
  };
  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
      />
      <h1 className="text-xl font-semibold">タグ: {name}</h1>
      <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {posts.map((p: any) => (
          <Reveal key={p.slug}>
            <PostCard
              slug={p.slug}
              title={p.title}
              description={p.description}
              date={p.date}
              thumb={p.thumb}
            />
          </Reveal>
        ))}
      </div>
    </main>
  );
}
