import Link from "next/link";
import { getAllTags } from "@/lib/tags";

export const metadata = { title: "タグ一覧 | オトロンブログ" };

export default async function TagsPage() {
  const tags = await getAllTags(); // { slug, name, count }[]
  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">タグ一覧</h1>
      <ul className="flex flex-wrap gap-3">
        {tags.map(t => (
          <li key={t.slug}>
            <Link
              href={`/blog/tags/${encodeURIComponent(t.name)}`}
              className="inline-block rounded-full border px-3 py-1 text-sm hover:bg-gray-50"
            >
              {t.name} <span className="text-gray-400">({t.count})</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
