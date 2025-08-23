import type { MetadataRoute } from 'next';
import { getAllPostsMeta } from '@/lib/posts';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://otoron-blog.vercel.app';

  const posts = (await getAllPostsMeta()).filter((p: any) => !p.draft);

  const postUrls: MetadataRoute.Sitemap = posts.map((p: any) => ({
    url: `${base}/blog/posts/${p.slug}`,
    lastModified: p.updated ?? p.date ?? new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  // タグ一覧・各タグページも収録（必要なければ消してOK）
  const tagUrls: MetadataRoute.Sitemap = [];
  if (posts.length) {
    const tags = new Set<string>();
    posts.forEach((p: any) => (p.tags ?? []).forEach((t: string) => tags.add(t)));
    for (const tag of tags) {
      tagUrls.push({
        url: `${base}/blog/tags/${encodeURIComponent(tag)}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.5,
      });
    }
  }

  const staticUrls: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/blog/tags`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
  ];

  return [...staticUrls, ...tagUrls, ...postUrls];
}
