import { getAllPosts, getPost, getPrevNext } from "@/lib/posts";
import { renderMarkdown } from "@/lib/markdown";

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

export default async function PostPage({ params }: { params: { slug: string } }) {
  const p: any = getPost(params.slug);
  if (!p) return <div>Not found</div>;

  const { prev, next }: any = getPrevNext(p.slug);

  const { html } = await renderMarkdown(p.content);

  return (
    <article className="post">
      <a href="/blog" className="meta">← 記事一覧へ</a>
      <h1>{p.title}</h1>
      <div className="meta">
        {new Date(p.date).toLocaleDateString("ja-JP")} ・ 読了目安: {Math.max(1, Math.round(p.content.replace(/\s+/g, "").length / 400))}分
      </div>

      <div className="post-body" dangerouslySetInnerHTML={{ __html: html }} />

      <nav className="pn">
        {prev && <a href={`/blog/posts/${prev.slug}`}>← {prev.title}</a>}
        {next && <a href={`/blog/posts/${next.slug}`}>{next.title} →</a>}
      </nav>
    </article>
  );
}
