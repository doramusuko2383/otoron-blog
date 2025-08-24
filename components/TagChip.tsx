import React from "react";

export default function TagChip({ tag, children }: { tag: string; children?: React.ReactNode }) {
  return (
    <a href={`/blog/tags/${encodeURIComponent(tag)}`} className="tag-chip">
      {tag}
      {children}
    </a>
  );
}
