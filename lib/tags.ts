import { getAllPostsMeta } from "@/lib/posts";

type PostMeta = {
  slug: string;
  title?: string;
  description?: string;
  date?: string;
  draft?: boolean;
  tags?: string[];
};

export function tagSlug(s: string) {
  return s
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-ぁ-んァ-ヴー一-龠]/g, "");
}

export async function getAllTags() {
  const posts = (await getAllPostsMeta() as unknown as PostMeta[])
    .filter(p => !p.draft);

  const acc = new Map<string, { slug: string; name: string; count: number }>();
  for (const p of posts) {
    const tags = Array.isArray(p.tags) ? p.tags : [];
    for (const t of tags) {
      const slug = tagSlug(t);
      const cur = acc.get(slug);
      if (cur) cur.count += 1;
      else acc.set(slug, { slug, name: t, count: 1 });
    }
  }
  return Array.from(acc.values())
    .sort((a, b) => b.count - a.count || a.slug.localeCompare(b.slug));
}

export async function getPostsByTag(tagOrSlug: string) {
  const slug = tagSlug(tagOrSlug);
  const posts = (await getAllPostsMeta() as unknown as PostMeta[])
    .filter(p =>
      !p.draft &&
      (Array.isArray(p.tags) ? p.tags : []).some(t => tagSlug(t) === slug)
    )
    .sort((a, b) => (a.date ?? "") < (b.date ?? "") ? 1 : -1);
  return posts;
}

export async function getTagName(slug: string) {
  const hit = (await getAllTags()).find(t => t.slug === slug);
  return hit?.name ?? slug;
}
