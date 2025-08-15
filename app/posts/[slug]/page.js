import { getAllPosts, getPost } from "../../../lib/posts";
import { remark } from "remark";
import html from "remark-html";

const BASE = "https://playotoron.com"; // 1か所に集約

export async function generateStaticParams() {
  return getAllPosts().map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const p = getPost(params.slug);
  if (!p) return {};
  const title = `${p.title} | オトロン公式ブログ`;
  const url = `${BASE}/blog/posts/${p.slug}`;
  const og = p.ogImage || "/ogp.png";
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
    twitter: { card: "summary_large_image" }
  };
}

export default async function PostPage({ params }) {
  const p = getPost(params.slug);
  if (!p) return <div>Not found</div>;

  const processed = await remark().use(html).process(p.content);
  const contentHtml = processed.toString();

  const url = `${BASE}/blog/posts/${p.slug}`;
  const ogAbs = p.ogImage?.startsWith("http")
    ? p.ogImage
    : `${BASE}${p.ogImage || "/ogp.png"}`;
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

  return (
    <article className="post">
      <a href="/blog" className="meta">← 記事一覧へ</a>
      <h1>{p.title}</h1>
      <div className="meta">{new Date(p.date).toLocaleDateString("ja-JP")}</div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
    </article>
  );
}
