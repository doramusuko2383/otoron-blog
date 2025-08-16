import { getAllPosts, getPost, getPrevNext } from "@/lib/posts";
import { renderMarkdown } from "@/lib/markdown";
import Breadcrumb from "@/components/Breadcrumb";

const BASE = "https://playotoron.com"; // 1か所に集約

export async function generateStaticParams() {
  return getAllPosts().map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const p: any = getPost(params.slug);
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

function readingTime(text: string) {
  const wpm = 400;
  const words = text.replace(/\s+/g, "").length;
  return Math.max(1, Math.round(words / wpm)) + "分";
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const p: any = getPost(params.slug);
  if (!p) return <div>Not found</div>;

  const { prev, next }: any = getPrevNext(p.slug);

  const { html, toc } = await renderMarkdown(p.content);

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
    <>
      <Breadcrumb
        items={[
          { label: "オトロン", href: "/" },
          { label: "ブログ", href: "/blog" },
          { label: p.title }
        ]}
      />
      <article className="post">
        <a href="/blog" className="meta">← 記事一覧へ</a>
      <h1>{p.title}</h1>
      <div className="meta">
        {new Date(p.date).toLocaleDateString("ja-JP")}
        {" ・ 読了目安: "}{readingTime(p.content)}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      {/* スマホ：上部に目次（必要なら details で折りたたみ） */}
      <div className="toc-mobile">
        {toc ? (
          <details open className="toc-details">
            <summary className="toc-summary">目次</summary>
            <div className="toc-wrap" dangerouslySetInnerHTML={{ __html: toc }} />
          </details>
        ) : null}
      </div>

      <div className="post-body-with-toc">
        {/* PC：サイド固定の目次 */}
        {toc ? (
          <aside className="toc-aside" aria-label="目次">
            <div dangerouslySetInnerHTML={{ __html: toc }} />
          </aside>
        ) : null}

        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
      </div>

        <nav className="pn">
          {prev && <a href={`/blog/posts/${prev.slug}`}>← {prev.title}</a>}
          {next && <a href={`/blog/posts/${next.slug}`}>{next.title} →</a>}
        </nav>
      </article>
    </>
  );
}
