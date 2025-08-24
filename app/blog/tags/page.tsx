import { getAllTags } from "@/lib/tags";
import TagChip from "@/components/TagChip";

export const metadata = { title: "タグ一覧 | オトロンブログ" };

export default async function TagsPage() {
  const tags = await getAllTags(); // { slug, name, count }[]
  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">タグ一覧</h1>
      <ul className="flex flex-wrap gap-3">
        {tags.map((t) => (
          <li key={t.slug}>
            <TagChip tag={t.name}>
              <span>({t.count})</span>
            </TagChip>
          </li>
        ))}
      </ul>
    </main>
  );
}
