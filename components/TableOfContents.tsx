'use client';

type Heading = { depth: number; text: string; id: string };

export default function TableOfContents({ headings }: { headings: Heading[] }) {
  const handleClick = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.replaceState(null, '', `#${encodeURIComponent(id)}`);
  };

  return (
    <nav aria-label="目次">
      <ul className="space-y-1 text-sm">
        {headings.map((h) => (
          <li key={h.id} className={`pl-${(h.depth - 1) * 3}`}>
            {/* Next.js の <Link> は使わず、素の <a> に onClick */}
            <a
              href={`#${h.id}`}
              onClick={handleClick(h.id)}
              className="hover:underline"
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

