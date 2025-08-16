import Image from "next/image";
import { notFound } from "next/navigation";
import {
  getAllPosts,
  getPostBySlug,
  getAdjacentPosts,
  getRelatedPosts,
} from "@/lib/posts";
import PostCard from "@/components/PostCard";

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

function readingTime(content: string) {
  return Math.max(1, Math.round(content.replace(/\s+/g, "").length / 400));
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const p: any = await getPostBySlug(params.slug);
  if (!p || p.draft) return notFound();

  const { prev, next }: any = await getAdjacentPosts(p.slug);
  const related = await getRelatedPosts(p.slug, 2);
  const hero = p.thumb || p.ogImage || FALLBACK_THUMB;
  const canonical = `/blog/posts/${p.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: p.title,
    datePublished: p.date,
    dateModified: p.updated ?? p.date,
    image: hero,
    url: `${BASE}${canonical}`,
    description: p.description,
  };

  return (
    <article className="post">
      <header className="postHeader">
        <div className="heroMedia">
          <Image
            src={hero}
            alt={p.title}
            fill
            priority
            sizes="100vw"
            className="heroMediaImg"
          />
        </div>
        <h1 className="postTitle">{p.title}</h1>
        <div className="meta">
          {new Date(p.date).toLocaleDateString("ja-JP")} ・ 読了目安: {readingTime(p.content)}分
        </div>
      </header>

      <div className="post-body" dangerouslySetInnerHTML={{ __html: p.html }} />

      <nav className="pn">
        {prev && <a href={`/blog/posts/${prev.slug}`}>← {prev.title}</a>}
        {next && <a href={`/blog/posts/${next.slug}`}>{next.title} →</a>}
      </nav>

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
  );
}
