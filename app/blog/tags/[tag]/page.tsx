import type { Metadata } from "next";
import { getAllPostsMeta } from "@/lib/posts";

export const dynamicParams = true; // 新タグでも動きやすく

const safeDecode = (s: string) => {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
};

/** タグ一覧の静的生成パラメータ
 *  ⚠ ここでは encode しない（生の日本語のまま返す）
 */
export async function generateStaticParams() {
  const posts = await getAllPostsMeta();
  const set = new Set<string>();
  posts.forEach(p => (p.tags ?? []).forEach((t: string) => set.add(String(t).trim())));
  return Array.from(set).map(tag => ({ tag }));
}

/** メタデータ（表示はデコード、canonicalはエンコード） */
export async function generateMetadata(
  { params }: { params: { tag: string } }
): Promise<Metadata> {
  const displayTag = safeDecode(params.tag).trim(); // 画面表示用
  const title = `#${displayTag} の記事`;
  const description = `タグ「${displayTag}」の記事一覧`;
  const canonical = `${process.env.NEXT_PUBLIC_SITE_URL}/blog/tags/${encodeURIComponent(displayTag)}`;

  return {
    title,
    description,
    alternates: { canonical },
  };
}

export default async function TagPage({ params }: { params: { tag: string } }) {
  const displayTag = safeDecode(params.tag).trim(); // 画面表示用（日本語）
  const all = await getAllPostsMeta();              // tags を含むメタを返すこと（lib/posts.jsで対応）
  const posts = all.filter(p =>
    (p.tags ?? []).map((t: unknown) => String(t).trim()).includes(displayTag)
  );

  if (!posts.length) {
    // 404でもOK。まずは文言表示のままで。
    return (
      <div className="prose mx-auto p-6">
        <h1>#{displayTag}</h1>
        <p>「{displayTag}」のタグ記事はまだありません。</p>
      </div>
    );
  }

  return (
    <div className="prose mx-auto p-6">
      <h1>#{displayTag}</h1>
      <ul>
        {posts.map(p => (
          <li key={p.slug}>
            <a href={`/blog/posts/${p.slug}`} className="link-plain">{p.title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
