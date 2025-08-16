import Image from "next/image";
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

    const { next }: any = getPrevNext(p.slug);

  const { html } = await renderMarkdown(p.content);

  return (
    <article className="post">
      <a href="/blog" className="meta">← 記事一覧へ</a>
      <h1>{p.title}</h1>
      <div className="meta">
        {new Date(p.date).toLocaleDateString("ja-JP")} ・ 読了目安: {Math.max(1, Math.round(p.content.replace(/\s+/g, "").length / 400))}分
      </div>

      <div className="post-body" dangerouslySetInnerHTML={{ __html: html }} />

        <nav className="pn" aria-label="次の記事">
          {next && (
            <a
              className="card"
              href={`/blog/posts/${next.slug}`}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 64px",
                alignItems: "center",
                gap: 16,
              }}
            >
              <div>
                <div className="card_meta">次の記事</div>
                <div className="card_title" style={{ margin: 0 }}>
                  {next.title}
                </div>
              </div>
              <Image
                src="/otoron.webp"
                alt=""
                width={64}
                height={64}
                decoding="async"
              />
            </a>
          )}
        </nav>
      </article>
    );
  }
