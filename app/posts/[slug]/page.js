import { getAllPosts, getPost } from "@/lib/posts";
import { remark } from "remark";
import html from "remark-html";

export async function generateStaticParams() {
  return getAllPosts().map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const p = getPost(params.slug);
  if (!p) return {};
  const title = `${p.title} | オトロン公式ブログ`;
  const url = `https://playotoron.com/blog/posts/${p.slug}`;
  const og = p.ogImage || "/ogp.png";
  return {
    title,
    description: p.description,
    openGraph: { title, description: p.description, url, images:[{url: og, width:1200, height:630}] },
    twitter: { card: "summary_large_image" }
  };
}

export default async function PostPage({ params }) {
  const p = getPost(params.slug);
  if (!p) return <div>Not found</div>;
  const processed = await remark().use(html).process(p.content);
  const contentHtml = processed.toString();

  return (
    <article className="post">
      <a href="/blog" className="meta">← 記事一覧に戻る</a>
      <h1 className="hero" style={{fontSize:32}}>{p.title}</h1>
      <div className="meta">{new Date(p.date).toLocaleDateString("ja-JP")}</div>
      {p.ogImage && <img src={p.ogImage} alt="" style={{marginTop:16}} />}
      <div style={{marginTop:16}} dangerouslySetInnerHTML={{ __html: contentHtml }} />
    </article>
  );
}
