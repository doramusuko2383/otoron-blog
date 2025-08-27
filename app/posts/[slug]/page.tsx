import type { Metadata } from "next";
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
import TagChip from "@/components/TagChip";

const BASE =
  process.env.NEXT_PUBLIC_SITE_URL || "https://otoron-blog.vercel.app";

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post: any = await getPostBySlug(params.slug);
  if (!post) return {};

  const canonical = `/blog/posts/${post.slug}`;
  const ogImage = post.ogImage || "/ogp.png";
  const title = post.title;
  const description = post.description;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "article",
      url: `${BASE}${canonical}`,
      title,
      description,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: post.draft ? { index: false, follow: false } : undefined,
  };
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post: any = await getPostBySlug(params.slug);
  if (!post || post.draft) return notFound();

  const { prev, next }: any = await getAdjacentPosts(post.slug);
  const related = await getRelatedPosts(post.slug, 2);
  const hero = post.thumb ?? null;
  const canonical = `${BASE}/blog/posts/${post.slug}`;
  const ogImageAbs = `${BASE}${post.ogImage || "/ogp.png"}`;

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    image: [ogImageAbs],
    mainEntityOfPage: canonical,
    author: { "@type": "Organization", name: "OTORON" },
    publisher: {
      "@type": "Organization",
      name: "OTORON",
      logo: { "@type": "ImageObject", url: `${BASE}/favicon.ico` },
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ブログ", item: `${BASE}/blog` },
      { "@type": "ListItem", position: 2, name: post.title, item: canonical },
    ],
  };

  const hasTOC =
    Array.isArray(post.headings) && post.headings.length > 0;

  return (
    <>
      <main className="bg-page">
        <div className="mx-auto max-w-6xl px-4 py-10">
          {hasTOC && (
            <details className="md:hidden toc-mobile mb-6">
              <summary>目次</summary>
              <TableOfContents headings={post.headings} />
            </details>
          )}

          <article className="card p-6">
            {/* 本文カラムだけ中央寄せ＆読み幅制御 */}
            <div className="prose prose-neutral md:prose-lg mx-auto">
                <header className="mb-6">
                  <h1 className="text-2xl font-bold">{post.title}</h1>
                  <time className="mt-2 block text-sm text-[color:var(--muted)]">
                    {new Date(post.date).toLocaleDateString("ja-JP")}
                  </time>

                  {hero && (
                    <div className="relative mx-auto mt-4 w-full max-w-3xl overflow-hidden rounded-xl border bg-gray-100 aspect-[16/9] max-h-[320px] md:max-h-[380px]">
                      <Image
                        src={hero}
                        alt={post.title}
                        fill
                        priority={false}
                        sizes="(max-width:640px) 100vw, 768px"
                        className="object-cover img-reset"
                      />
                    </div>
                  )}
                </header>

                {post.tags?.length > 0 && (
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {post.tags.map((t: string) => (
                      <li key={t}>
                        <TagChip tag={t} />
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-6" dangerouslySetInnerHTML={{ __html: post.html }} />

                <nav className="mt-10 flex justify-between text-sm">
                  <div>
                    {prev && (
                      <a href={`/blog/posts/${prev.slug}`} className="link-plain">
                        ← {prev.title}
                      </a>
                    )}
                  </div>
                  <div>
                    {next && (
                      <a href={`/blog/posts/${next.slug}`} className="link-plain">
                        {next.title} →
                      </a>
                    )}
                  </div>
                </nav>

                {related?.length > 0 && (
                  <section aria-labelledby="related" className="mt-12">
                    <h2 id="related" className="text-lg font-semibold">関連記事</h2>
                    <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
                      {related.map((p: any) => (
                        <PostCard key={p.slug} post={p} />
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </article>
        </div>
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
    </>
  );
}
