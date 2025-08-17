export const runtime = "nodejs";
import Link from "next/link";
import { getAllTags } from "@/lib/tags";

export const metadata = {
  title: "トピック一覧 | オトロン公式ブログ",
  description: "タグ別に記事を探せます。",
  alternates: { canonical: "/blog/tags" },
};

export default async function TagsIndex() {
  const tags = await getAllTags();
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-xl font-semibold">トピック</h1>
      <ul className="mt-4 flex flex-wrap gap-2">
        {tags.map((t) => (
          <li key={t.slug}>
            <Link href={`/blog/tags/${t.slug}`} className="tag-chip">
              {t.name}
              <span className="ml-1 text-gray-500">({t.count})</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
