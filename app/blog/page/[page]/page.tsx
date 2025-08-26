import Link from 'next/link';
import { notFound } from 'next/navigation';
import PostCard from '@/components/PostCard';
import { getPaginatedPosts, getAllPostsMeta } from '@/lib/posts';

const PAGE_SIZE = 10;

export async function generateStaticParams() {
  const all = await getAllPostsMeta();
  const totalPages = Math.ceil(all.length / PAGE_SIZE);
  return Array.from({ length: Math.max(totalPages - 1, 0) }, (_, i) => ({
    page: String(i + 2), // 2..N
  }));
}

export default async function BlogPagedPage({ params }: { params: { page: string } }) {
  const pageNum = Number(params.page);
  if (!Number.isInteger(pageNum) || pageNum < 2) return notFound();

  const offset = (pageNum - 1) * PAGE_SIZE;
  const { items, total } = await getPaginatedPosts(offset, PAGE_SIZE);
  const totalPages = Math.ceil(total / PAGE_SIZE);
  if (items.length === 0) return notFound();

  return (
    <main className="bg-page">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-2xl font-bold text-[color:var(--ink)] heading-underline">記事一覧（{pageNum} / {totalPages}）</h1>

        {/* auto-fill + minmax で常に複数カラム化 */}
        <div
          className="mt-8 grid gap-8"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))" }}
        >
          {items.map(p => (
            <PostCard key={p.slug} post={p} />
          ))}
        </div>

        <nav className="mt-10 flex items-center justify-between">
          <Link className="link-plain" href={pageNum === 2 ? '/blog' : `/blog/page/${pageNum - 1}`}>← 前のページ</Link>
          {pageNum < totalPages ? (
            <Link className="link-plain" href={`/blog/page/${pageNum + 1}`}>次のページ →</Link>
          ) : (
            <span />
          )}
        </nav>
      </div>
    </main>
  );
}
