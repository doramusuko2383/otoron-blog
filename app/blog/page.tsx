import PostCard from "@/components/PostCard";
import { getAllPostsMeta } from "@/lib/posts";

export const revalidate = 60;

export default async function BlogIndex() {
  const posts = await getAllPostsMeta();
  return (
    <main className="bg-page">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-2xl font-bold">記事一覧</h1>

        <div className="posts-grid mt-6">
          {posts.map((p:any) => <PostCard key={p.slug} post={p} />)}
        </div>
      </div>
    </main>
  );
}
