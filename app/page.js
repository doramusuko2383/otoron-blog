import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export default function BlogTop() {
  const posts = getAllPosts();
  return (
    <>
      <h1 className="hero">オトロン公式ブログ</h1>
      <p className="sub">絶対音感トレーニングのノウハウ、幼児の耳育て、アプリ活用ガイドなどをお届けします。</p>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:16}}>
        {posts.map(p => (
          <Link href={`/posts/${p.slug}`} key={p.slug} className="card">
            <div style={{fontWeight:800}}>{p.title}</div>
            <div className="meta">{new Date(p.date).toLocaleDateString("ja-JP")}</div>
            {p.description && <p style={{marginTop:8}}>{p.description}</p>}
          </Link>
        ))}
      </div>

      {posts.length === 0 && (
        <p className="sub">まだ記事がありません。<code>/posts</code> に Markdown を追加すると自動で表示されます。</p>
      )}
    </>
  );
}
