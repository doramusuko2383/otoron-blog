import Link from 'next/link';
import PostCard from '@/components/PostCard';
import { getPaginatedPosts } from '@/lib/posts';

const PAGE_SIZE = 10;

export const revalidate = 60;

export default async function BlogIndexPage() {
  const { items, total } = await getPaginatedPosts(0, PAGE_SIZE);
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">記事一覧</h1>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {items.map(p => (
          <PostCard
            key={p.slug}
            slug={p.slug}
            title={p.title}
            date={p.date}
            description={p.description}
            thumb={p.thumb}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <nav className="mt-10 flex items-center justify-between">
          <span />
          <Link className="underline" href="/blog/page/2">次のページ →</Link>
        </nav>
      )}
    </main>
  );
}

