// app/page.tsx
import { getAllPosts } from "@/lib/posts";
import type { BlogPost } from "@/types/posts";

export async function generateMetadata() {
  const BASE = "https://playotoron.com";
  const title = "オトロン公式ブログ";
  const description =
    "絶対音感トレーニングのノウハウ、幼児の耳育て、アプリ活用ガイドなどをお届けします。";
  return {
    title,
    description,
    alternates: { canonical: `${BASE}/blog` },
    openGraph: {
      type: "website",
      siteName: "OTORON",
      url: `${BASE}/blog`,
      title,
      description,
      images: [{ url: "/og-plain.png", width: 1200, height: 630 }],
      locale: "ja_JP",
    },
    twitter: { card: "summary_large_image" },
    robots: { index: true, follow: true },
  };
}

type SearchParams = { q?: string };

export default async function Home({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const all: BlogPost[] = getAllPosts();

  // Markdownをざっくり素のテキストに
  const mdToText = (md: string) =>
    md
      // コードブロック・インラインコードを間引く
      .replace(/```[\s\S]*?```/g, " ")
      .replace(/`[^`]+`/g, " ")
      // 画像/リンク表記
      .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
      .replace(/\[[^\]]*\]\([^)]*\)/g, " ")
      // 見出し・強調などの記号
      .replace(/[#>*_~\-+]+/g, " ")
      // 余分な空白
      .replace(/\s{2,}/g, " ")
      // 重くならないように上限をかける
      .slice(0, 3000);

  const q = (searchParams?.q ?? "").trim().toLowerCase();
  const allText = (p: BlogPost) =>
    `${p.title ?? ""} ${p.description ?? ""} ${p.slug} ${mdToText(p.content)}`
      .toLowerCase();

  const posts = q
    ? all.filter((p) => allText(p).includes(q))
    : all;

  const listLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "オトロン公式ブログ",
    description:
      "絶対音感トレーニングのノウハウ、幼児の耳育て、アプリ活用ガイドなどをお届けします。",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: posts.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://playotoron.com"}/blog/posts/${p.slug}`,
      })),
    },
  };

  return (
    <main className="wrap">
      {/* 一覧のパンくずは表示しない（記事ページのみ） */}

      <h1 className="page-title">オトロン公式ブログ</h1>
      <p className="lede">
        絶対音感トレーニングのノウハウ、幼児の耳育て、アプリ活用ガイドなどをお届けします。
      </p>

      {/* 検索（GET /?q=） */}
      <form action="/" method="get" className="search">
        <label htmlFor="q" className="visually-hidden">検索</label>
        <input
          id="q"
          name="q"
          type="search"
          defaultValue={q}
          placeholder="キーワードで検索"
          inputMode="search"
        />
        {/* Enterで送信できるのでボタンは省略可 */}
      </form>

      {/* 一覧 */}
      <ul className="cards" role="list">
        {posts.map((p) => (
          <li key={p.slug} className="cards__item">
            <a href={`/blog/posts/${p.slug}`} className="card">
              <h2 className="card_title">{p.title}</h2>
              <time className="card__date" dateTime={p.date}>
                {new Date(p.date).toLocaleDateString("ja-JP")}
              </time>
              <p className="card_desc">{p.description}</p>
            </a>
          </li>
        ))}
      </ul>

      {posts.length === 0 && (
        <p className="muted">該当する記事が見つかりませんでした。</p>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(listLd) }}
      />

      <footer className="foot">© 2025 OTORON</footer>
    </main>
  );
}

