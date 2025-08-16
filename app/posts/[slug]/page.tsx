import Image from "next/image";
import { getAllPosts, getPost, getPrevNext } from "@/lib/posts";
import { renderMarkdown } from "@/lib/markdown";

const BASE = "https://playotoron.com";
const FALLBACK_THUMB = "/otolon_face.webp";

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const p: any = getPost(params.slug);
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
  const p: any = getPost(params.slug);
  if (!p) return <div>Not found</div>;

  const { prev, next }: any = getPrevNext(p.slug);
  const { html } = await renderMarkdown(p.content);
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

      <div className="post-body" dangerouslySetInnerHTML={{ __html: html }} />

      <nav className="pn">
        {prev && <a href={`/blog/posts/${prev.slug}`}>← {prev.title}</a>}
        {next && <a href={`/blog/posts/${next.slug}`}>{next.title} →</a>}
      </nav>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </article>
  );
}
