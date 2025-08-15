import { getAllPosts, getPost, getPrevNext } from "../../../lib/posts";
import { renderMarkdown } from "../../../lib/markdown";

const BASE = "https://playotoron.com"; // 1か所に集約

export async function generateStaticParams() {
  return getAllPosts().map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const p = getPost(params.slug);
  if (!p) return {};
  const title = `${p.title} | オトロン公式ブログ`;
  const url = `${BASE}/blog/posts/${p.slug}`;
  const og = p.ogImage || `/og/${p.slug}`;
  return {
    title,
    description: p.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      siteName: "OTORON",
      url,
      title,
      description: p.description,
      images: [{ url: og, width: 1200, height: 630 }],
      locale: "ja_JP",
      publishedTime: p.date,
      modifiedTime: p.updated ?? p.date
    },
    twitter: { card: "summary_large_image" },
    robots: p.draft ? { index: false, follow: false } : undefined
  };
}

function readingTime(text) {
  const wpm = 400;
  const words = text.replace(/\s+/g, "").length;
  return Math.max(1, Math.round(words / wpm)) + "分";
}

export default async function PostPage({ params }) {
  const p = getPost(params.slug);
  if (!p) return <div>Not found</div>;

  const { prev, next } = getPrevNext(p.slug);

  const { html: contentHtml } = await renderMarkdown(p.content);

  const url = `${BASE}/blog/posts/${p.slug}`;
  const ogAbs = p.ogImage?.startsWith("http")
    ? p.ogImage
    : `${BASE}${p.ogImage || `/og/${p.slug}`}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: p.title,
    description: p.description,
    image: [ogAbs],
    datePublished: p.date,
    dateModified: p.updated ?? p.date,
    author: { "@type": "Organization", name: "OTORON" },
    publisher: { "@type": "Organization", name: "OTORON" },
    mainEntityOfPage: url
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ブログ", item: "https://playotoron.com/blog" },
      { "@type": "ListItem", position: 2, name: p.title, item: url }
    ]
  };

  return (
    <article className="post">
      <a href="/blog" className="meta">← 記事一覧へ</a>
      <h1>{p.title}</h1>
      <div className="meta">
        {new Date(p.date).toLocaleDateString("ja-JP")}
        {" ・ 読了目安: "}{readingTime(p.content)}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
      <nav className="pn">
        {prev && <a href={`/blog/posts/${prev.slug}`}>← {prev.title}</a>}
        {next && <a href={`/blog/posts/${next.slug}`}>{next.title} →</a>}
      </nav>
    </article>
  );
}
