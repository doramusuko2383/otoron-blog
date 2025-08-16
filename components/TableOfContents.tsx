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
    const root = document.querySelector('#post-body');
    if (!root) return;
    const nodes = Array.from(root.querySelectorAll('h2, h3')) as HTMLElement[];
    const hs: Heading[] = nodes.map((el) => {
      const text = (el.textContent || '').trim();
      if (!el.id) el.id = slugify(text);
      return { id: el.id, text, depth: el.tagName === 'H3' ? 3 : 2 };
    });
    setItems(hs);
  }, [items.length]);

  const [active, setActive] = useState('');
  useEffect(() => {
    const root = document.querySelector('#post-body');
    if (!root) return;
    const targets = Array.from(root.querySelectorAll('h2, h3'));
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

  if (!items.length) return null;

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
