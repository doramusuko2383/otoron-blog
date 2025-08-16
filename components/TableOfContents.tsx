'use client';

import { useEffect, useState } from 'react';

type Heading = { id: string; text: string; depth: number };

function slugify(s: string) {
  return s.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]/g, '');
}

export default function TableOfContents({ headings = [] as Heading[] }) {
  const [items, setItems] = useState<Heading[]>(headings);

  useEffect(() => {
    if (items.length > 0) return;
    const nodes = Array.from(document.querySelectorAll('article h2, article h3')) as HTMLElement[];
    const hs: Heading[] = nodes.map((el) => {
      const text = (el.textContent || '').trim();
      if (!el.id) el.id = slugify(text); // ← 見出しに実IDを付与（重要）
      return { id: el.id, text, depth: el.tagName === 'H3' ? 3 : 2 };
    });
    setItems(hs);
  }, [items.length]);

  const [active, setActive] = useState('');
  useEffect(() => {
    const targets = Array.from(document.querySelectorAll('article h2, article h3'));
    if (!targets.length) return;
    const io = new IntersectionObserver(
      (ents) => {
        const top = ents
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (a.target as HTMLElement).offsetTop - (b.target as HTMLElement).offsetTop)[0];
        if (top) setActive((top.target as HTMLElement).id);
      },
      { rootMargin: '-96px 0px -70% 0px', threshold: [0, 1] }
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  return (
    <nav aria-label="目次" className="toc">
      <ol>
        {items.map((h) => (
          <li key={h.id} className={h.depth === 3 ? 'toc-li toc-li--lvl3' : 'toc-li'}>
            <a href={`#${h.id}`} className={`toc-link ${active === h.id ? 'is-active' : ''}`}>
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
