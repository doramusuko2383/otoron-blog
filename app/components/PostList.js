'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

export default function PostList({ initialPosts, page, hasPrev, hasNext }) {
  const [q, setQ] = useState('');
  const [all, setAll] = useState([]);

  useEffect(() => {
    fetch('/search.json').then(r => r.json()).then(setAll);
  }, []);

  const shown = useMemo(() => {
    const s = q.trim();
    if (!s) return initialPosts;
    return all.filter(p =>
      p.title.includes(s) || p.description.includes(s)
    );
  }, [q, all, initialPosts]);

  return (
    <>
      <input placeholder="検索" value={q} onChange={e => setQ(e.target.value)} />
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:16}}>
        {shown.map(p => (
          <Link href={`/posts/${p.slug}`} key={p.slug} className="card">
            <div style={{fontWeight:800}}>{p.title}</div>
            <div className="meta">{new Date(p.date).toLocaleDateString("ja-JP")}</div>
            {p.description && <p style={{marginTop:8}}>{p.description}</p>}
          </Link>
        ))}
      </div>
      {!q.trim() && (
        <nav className="pager">
          {hasPrev && <a rel="prev" href={`/blog?page=${page-1}`}>← 前のページ</a>}
          {hasNext && <a rel="next" href={`/blog?page=${page+1}`}>次のページ →</a>}
        </nav>
      )}
    </>
  );
}
