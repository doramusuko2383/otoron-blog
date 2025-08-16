'use client';

import { useEffect, useState } from 'react';

type Heading = { id: string; text: string; depth: number };

function slugify(s: string) {
  return s.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]/g, '');
}

export default function TableOfContents({ headings = [] as Heading[] }) {
  const [items, setItems] = useState<Heading[]>(headings);

  useEffect(() => {
    // 1) props に既に見出しがあるならそれを使う
    if (headings.length > 0) {
      setItems(headings);
      return;
    }
    // 2) 本文 (#post-body) から h2/h3 を抽出
    const root = document.querySelector('#post-body');
    if (!root) return;

    let hs: Heading[] = [];
    const hNodes = Array.from(root.querySelectorAll('h2, h3')) as HTMLElement[];
    if (hNodes.length) {
      hs = hNodes.map((el) => {
        const text = (el.textContent || '').trim();
        if (!el.id) el.id = slugify(text);
        return { id: el.id, text, depth: el.tagName === 'H3' ? 3 : 2 };
      });
    } else {
      // 3) 見出しが無ければ、直下のリスト項目から擬似TOCを作成（最大5件）
      const lis = Array.from(
        root.querySelectorAll(':scope > ol > li, :scope > ul > li')
      ) as HTMLElement[];
      hs = lis.slice(0, 5).map((li, i) => {
        const text = (li.textContent || '').trim();
        const id = li.id || `sec-${i + 1}`;
        li.id = id; // アンカーを付与
        return { id, text, depth: 2 };
      });
    }
    setItems(hs);
  }, [headings]);

  // 現在位置ハイライト（軽量）
  const [active, setActive] = useState('');
  useEffect(() => {
    const root = document.querySelector('#post-body');
    if (!root) return;
    const targets = Array.from(root.querySelectorAll('h2, h3, :scope > ol > li, :scope > ul > li'));
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

  // 何も作れなければ描画しない（右サイドは CSS で自動非表示）
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
