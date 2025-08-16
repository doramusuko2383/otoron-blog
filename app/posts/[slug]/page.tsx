import Image from "next/image";
import { notFound } from "next/navigation";
import {
  getAllPosts,
  getPostBySlug,
  getAdjacentPosts,
  getRelatedPosts,
} from "@/lib/posts";
import PostCard from "@/components/PostCard";
import TableOfContents from "@/components/TableOfContents";

const BASE = "https://playotoron.com";
const FALLBACK_THUMB = "/otolon_face.webp";

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const p: any = await getPostBySlug(params.slug);
  if (!p) return {};
  const title = `${p.title} | オトロン公式ブログ`;
  const canonical = `/blog/posts/${p.slug}`;
  const url = `${BASE}${canonical}`;
  const hero = p.thumb || p.ogImage || `/og/${p.slug}`;
  return {
    title,
    description: p.description,
    alternates: { canonical },
    openGraph: {
      type: "article",
      siteName: "OTORON",
      url,
      title,
      description: p.description,
      images: [{ url: hero, width: 1200, height: 630 }],
      locale: "ja_JP",
      publishedTime: p.date,
      modifiedTime: p.updated ?? p.date,
    },
    twitter: { card: "summary_large_image" },
    robots: p.draft ? { index: false, follow: false } : undefined,
  };
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post: any = await getPostBySlug(params.slug);
  if (!post || post.draft) return notFound();

  const { prev, next }: any = await getAdjacentPosts(post.slug);
  const related = await getRelatedPosts(post.slug, 2);
  const hero = post.thumb || post.ogImage || FALLBACK_THUMB;
  const canonical = `/blog/posts/${post.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    image: hero,
    url: `${BASE}${canonical}`,
    description: post.description,
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,1fr)_240px]">
        {/* 本文 */}
        <article className="max-w-3xl">
          <header className="mb-6">
            <h1 className="text-2xl font-bold">{post.title}</h1>
            <time className="mt-2 block text-sm text-gray-500">
              {new Date(post.date).toLocaleDateString('ja-JP')}
            </time>
            <div className="relative mt-4 aspect-[16/9] w-full overflow-hidden rounded-xl border border-gray-100">
              <Image src={hero} alt={post.title} fill priority sizes="(max-width:768px) 100vw, 720px" className="object-cover" />
            </div>
          </header>

          <div className="prose prose-blue max-w-none">
            <div dangerouslySetInnerHTML={{ __html: post.html }} />
          </div>

          {/* 前後記事 …（既存のまま） */}
          <nav className="mt-10 flex justify-between text-sm">
            <div>{prev && <a href={`/blog/posts/${prev.slug}`} className="underline">← {prev.title}</a>}</div>
            <div>{next && <a href={`/blog/posts/${next.slug}`} className="underline">{next.title} →</a>}</div>
          </nav>

          {/* 既に実装済みの関連記事セクション（このまま） */}
          {related.length > 0 && (
            <section style={{ marginTop: "48px" }}>
              <h2 style={{ fontSize: "18px", margin: "0 0 16px" }}>関連記事</h2>
              <div className="cards">
                {related.map((r: any) => (
                  <PostCard
                    key={r.slug}
                    slug={r.slug}
                    title={r.title}
                    description={r.description}
                    date={r.date}
                    thumb={r.thumb || r.ogImage}
                  />
                ))}
              </div>
            </section>
          )}

          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        </article>

        {/* 目次（右サイド固定） */}
        <aside className="hidden md:block">
          {/* post.headings があれば渡す。無ければ未指定でOK（DOMから抽出） */}
          <TableOfContents headings={post.headings} />
        </aside>

        {/* モバイルの折りたたみ版（本文末尾に表示したい場合はここに） */}
        <div className="md:hidden">
          <TableOfContents headings={post.headings} />
        </div>
      </div>
    </main>
  );
}

