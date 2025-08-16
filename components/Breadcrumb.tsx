type Crumb = { label: string; href?: string };

export default function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav className="breadcrumb" aria-label="breadcrumb">
      {items.map((c, i) => (
        <span key={i}>
          {c.href ? (
            <a href={c.href} className="brand">{c.label}</a>
          ) : (
            <span className="current">{c.label}</span>
          )}
          {i < items.length - 1 ? " / " : ""}
        </span>
      ))}
    </nav>
  );
}
