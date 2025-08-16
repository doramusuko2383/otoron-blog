'use client';

import { useEffect, useMemo, useState } from 'react';

type Heading = { id: string; text: string; depth: number };

function dedupeId(id: string) {
  return id?.trim().replace(/\s+/g, '-').toLowerCase();
}

export default function TableOfContents({
  headings,
  stickyOffset = 96,
}: { headings?: Heading[]; stickyOffset?: number }) {
  const [items, setItems] = useState<Heading[]>(headings ?? []);

  useEffect(() => {
    if (items.length > 0) return;
    const nodes = Array.from(document.querySelectorAll('article h2, article h3')) as HTMLElement[];
    const hs = nodes
      .filter((el) => el.id || el.textContent)
      .map((el) => ({
        id: el.id || dedupeId(el.textContent || ''),
        text: (el.textContent || '').trim(),
        depth: el.tagName === 'H3' ? 3 : 2,
      }));
    setItems(hs);
  }, [items.length]);

  const [activeId, setActiveId] = useState<string>('');
  useEffect(() => {
    const targets = Array.from(document.querySelectorAll('article h2, article h3'));
    if (!targets.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (a.target as HTMLElement).offsetTop - (b.target as HTMLElement).offsetTop);
        if (visible[0]) setActiveId((visible[0].target as HTMLElement).id);
      },
      { rootMargin: `-${stickyOffset + 8}px 0px -70% 0px`, threshold: [0, 1] }
    );
    targets.forEach((t) => obs.observe(t));
    return () => obs.disconnect();
  }, [stickyOffset, items.length]);

  const content = useMemo(() => (
    <nav aria-label="目次" className="toc">
      <ol>
        {items.map((h) => (
          <li key={h.id} className={h.depth === 3 ? 'toc-li toc-li--lvl3' : 'toc-li'}>
            <a
              href={`#${h.id}`}
              className={`toc-link ${activeId === h.id ? 'is-active' : ''}`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  ), [items, activeId]);

  return (
    <>
      <div className="hidden md:block sticky" style={{ top: stickyOffset }}>{content}</div>
      <details className="md:hidden toc-mobile">
        <summary className="toc-mobile-summary">目次</summary>
        {content}
      </details>
    </>
  );
}

