export const metadata = {
  alternates: { canonical: "https://playotoron.com/blog" }
};

import { getAllPosts } from "../lib/posts";
import PostList from "./components/PostList";

const PER = 9;

export default function BlogTop({ searchParams }) {
  const page = Math.max(1, parseInt(searchParams?.page ?? "1", 10));
  const all = getAllPosts();
  const total = all.length;
  const start = (page - 1) * PER;
  const posts = all.slice(start, start + PER);
  const hasPrev = page > 1;
  const hasNext = start + PER < total;

  return (
    <>
      <h1 className="hero">オトロン公式ブログ</h1>
      <p className="sub">絶対音感トレーニングのノウハウ、幼児の耳育て、アプリ活用ガイドなどをお届けします。</p>
      <PostList initialPosts={posts} page={page} hasPrev={hasPrev} hasNext={hasNext} />
      {posts.length === 0 && (
        <p className="sub">まだ記事がありません。<code>/posts</code> に Markdown を追加すると自動で表示されます。</p>
      )}
    </>
  );
}
