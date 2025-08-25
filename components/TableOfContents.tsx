'use client';

type TocItem = { level: number; title: string; id: string };

const HEADER_OFFSET = 96; // ヘッダーの高さに合わせて調整

export default function TableOfContents({ headings }: { headings: TocItem[] }) {
  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ) => {
    e.preventDefault();
    const el = document.getElementById(id); // decode しない
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
      window.scrollTo({ top: y, behavior: 'smooth' });
      history.replaceState(null, '', `#${id}`);
    }
  };

  return (
    <nav aria-label="目次" className="toc z-40">
      <ul>
        {headings.map((h) => (
          <li key={h.id} className={`lvl-${h.level}`}>
            <a
              href={`#${h.id}`}
              onClick={(e) => handleClick(e, h.id)}
              className="link-plain"
            >
              {h.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

