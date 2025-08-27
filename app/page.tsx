import { getPaginatedPosts } from '@/lib/posts';
import InfinitePosts from '@/components/InfinitePosts';

const PAGE_SIZE = 10;

export const revalidate = 60;

export const metadata = {
  title: 'ブログ | オトロン',
  description: '公式サイトと統一感のある軽量ブログ',
  alternates: {
    canonical: '/blog',
    types: { 'application/rss+xml': '/rss.xml' },
  },
};

export default async function BlogIndexPage() {
  const { items, total, nextOffset } = await getPaginatedPosts(0, PAGE_SIZE);

  return (
    <main className="bg-page">
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <h1 className="text-2xl font-bold mb-6">記事一覧</h1>

        <InfinitePosts
          initialItems={items}
          initialOffset={nextOffset}
          total={total}
          pageSize={PAGE_SIZE}
          gridClassName="posts-grid mt-8"
        />
      </div>
    </main>
  );
}
