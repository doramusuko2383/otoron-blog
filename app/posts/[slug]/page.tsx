import Image from "next/image";
import { notFound } from "next/navigation";
import {
  getAllPosts,
  getPostBySlug,
  getAdjacentPosts,
  getRelatedPosts,
} from "@/lib/posts";
import { tagSlug } from "@/lib/tags";
import PostCard from "@/components/PostCard";
import TableOfContents from "@/components/TableOfContents";
import CopyLink from "@/components/CopyLink";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://playotoron.com";
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
  const hero = p.thumb || p.ogImage || '/otolon_face.webp';
  const ogAuto = `/og/${p.slug}`;
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
      images: [{
        url: ogAuto,
        width: 1200,
        height: 630,
        alt: `${p.title} | オトロン公式ブログ`,
      }],
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
    timeRequired: post.readingMinutes ? `PT${post.readingMinutes}M` : undefined,
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ブログ", item: `${BASE}/blog` },
      {
        "@type": "ListItem",
        position: 2,
        name: post.title,
        item: `${BASE}${canonical}`,
      },
    ],
  };

  const hasTOC = Array.isArray(post.headings) && post.headings.length > 0; // 使わなくてもOK（残しても可）

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <div className={`grid grid-cols-1 gap-8 md:grid-cols-12`}>
        {/* 本文（8カラム） */}
        <article className="md:col-span-8">
          <header className="mb-6">
            <h1 className="text-2xl font-bold">{post.title}</h1>
            <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
              <time dateTime={post.date}>
                公開: {new Date(post.date).toLocaleDateString('ja-JP')}
              </time>
              {post.updated && post.updated !== post.date && (
                <span>
                  ／ 更新:{' '}
                  <time dateTime={post.updated}>
                    {new Date(post.updated).toLocaleDateString('ja-JP')}
                  </time>
                </span>
              )}
              {typeof post.readingMinutes === 'number' && (
                <span>／ 約 {post.readingMinutes} 分で読めます</span>
              )}
              <CopyLink url={`${BASE}${canonical}`} className="ml-1" />
            </div>
            <div className="mt-4 post-hero rounded-xl border border-gray-100 overflow-hidden">
              <Image
                src={hero}
                alt={post.title}
                width={1200}
                height={630}               // 16:9相当
                priority
                sizes="(max-width:768px) 100vw, 720px"
                className="w-full h-auto"
              />
            </div>
          </header>

          {post.tags?.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-2">
              {post.tags.map((t: string) => (
                <li key={t}>
                  <a href={`/blog/tags/${tagSlug(t)}`} className="tag-chip">
                    {t}
                  </a>
                </li>
              ))}
            </ul>
          )}

          <div id="post-body" className="prose prose-blue max-w-none">
            <div dangerouslySetInnerHTML={{ __html: post.html }} />
          </div>

          {/* 前後記事 …（既存のまま） */}
          <nav className="mt-10 flex justify-between text-sm">
            <div>
              {prev && (
                <a href={`/blog/posts/${prev.slug}`} className="underline">
                  ← {prev.title}
                </a>
              )}
            </div>
            <div>
              {next && (
                <a href={`/blog/posts/${next.slug}`} className="underline">
                  {next.title} →
                </a>
              )}
            </div>
          </nav>

          {/* 関連記事（← 重複があれば他を削除して1回だけに） */}
          {related?.length > 0 && (
            <section aria-labelledby="related" className="mt-12">
              <h2 id="related" className="text-lg font-semibold">
                関連記事
              </h2>
              <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
                {related.map((p: any) => (
                  <PostCard
                    key={p.slug}
                    slug={p.slug}
                    title={p.title}
                    description={p.description}
                    date={p.date}
                    thumb={p.thumb}
                    readingMinutes={p.readingMinutes}
                  />
                ))}
              </div>
            </section>
          )}

          {/* モバイル TOC（本文に見出しが無い場合は非表示） */}
          {hasTOC && (
            <details className="md:hidden toc-mobile mt-10">
              <summary className="toc-mobile-summary">目次</summary>
              <TableOfContents headings={post.headings} />
            </details>
          )}

          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
          />
        </article>

        {/* ▼ デスクトップ用 */}
        <aside className="hidden md:block md:col-span-4">
          <div className="sticky top-24 toc-aside">
            <TableOfContents headings={post.headings} />
          </div>
        </aside>
      </div>
    </main>
  );
}

