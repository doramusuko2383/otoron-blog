'use client';

import { useEffect, useRef, useState } from 'react';
import PostCard from '@/components/PostCard';
import type { PostMeta } from '@/lib/posts';

type Props = {
  initialItems: PostMeta[];
  initialOffset: number;
  total: number;
  pageSize: number;
  gridClassName?: string;
};

export default function InfinitePosts({
  initialItems,
  initialOffset,
  total,
  pageSize,
  gridClassName = 'mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3',
}: Props) {
  const [items, setItems] = useState<PostMeta[]>(initialItems);
  const [offset, setOffset] = useState(initialOffset);
  const [hasMore, setHasMore] = useState(initialOffset < total);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasMore) return;

    const el = sentinelRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting || loading) return;
        setLoading(true);
        setError(null);
        try {
          const res = await fetch(
            `/api/posts?offset=${offset}&limit=${pageSize}`,
            { cache: 'no-store' }
          );
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const json = await res.json();
          setItems(prev => [...prev, ...json.items]);
          setOffset(json.nextOffset);
          setHasMore(json.hasMore);
        } catch (e: any) {
          setError(e?.message ?? '読み込みに失敗しました');
        } finally {
          setLoading(false);
        }
      },
      { rootMargin: '800px 0px' }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [offset, hasMore, loading, pageSize]);

  return (
    <>
      <div className={gridClassName}>
        {items.map(p => (
          <PostCard key={p.slug} post={p} />
        ))}
      </div>

      {hasMore && (
        <div ref={sentinelRef} aria-hidden className="h-10" />
      )}

      <div className="mt-6 text-center text-sm text-gray-500">
        {loading && '読み込み中…'}
        {!loading && !hasMore && items.length > 0 && 'すべて読み込みました'}
        {error && (
          <div className="text-red-500">エラー: {error}</div>
        )}
      </div>
    </>
  );
}
