'use client';

type TocItem = { level: number; title: string; id: string };

export default function TableOfContents({ headings }: { headings: TocItem[] }) {
  const onClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(decodeURIComponent(id));
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', `#${id}`);
    }
  };

  return (
    <nav aria-label="目次" className="toc">
      <ul>
        {headings.map((h) => (
          <li key={h.id} className={`lvl-${h.level}`}>
            <a href={`#${h.id}`} onClick={(e) => onClick(e, h.id)}>
              {h.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

