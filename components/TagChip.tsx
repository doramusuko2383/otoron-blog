import React from "react";

export default function TagChip({ tag, children }: { tag: string; children?: React.ReactNode }) {
  return (
    <a
      href={`/blog/tags/${encodeURIComponent(tag)}`}
      className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-sm text-gray-700 no-underline hover:underline hover:bg-gray-200"
    >
      {tag}
      {children}
    </a>
  );
}
