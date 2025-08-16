// app/page.tsx
import { getAllPosts } from "@/lib/posts";

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
      images: [{ url: "/og/blog", width: 1200, height: 630 }],
      locale: "ja_JP",
    },
    twitter: { card: "summary_large_image" },
    robots: { index: true, follow: true },
  };
}

type SearchParams = { q?: string };

export default async function Home({ searchParams }: { searchParams: SearchParams }) {
  const q = (searchParams?.q ?? "").trim().toLowerCase();
  const all = getAllPosts();

  // ※検索は「タイトル＋説明＋スラッグ」のみ（軽量・高速）
  const posts = q
    ? all.filter((p) => {
        const hay = `${p.title ?? ""} ${p.description ?? ""} ${p.slug}`.toLowerCase();
        return hay.includes(q);
      })
    : all;

  return (
    <main className="wrap">
      {/* ← パンくずは削除。ヘッダは大きく1つだけ */}
      <h1 className="page-title">オトロン公式ブログ</h1>
      <p className="lede">
        絶対音感トレーニングのノウハウ、幼児の耳育て、アプリ活用ガイドなどをお届けします。
      </p>

      {/* 検索（GETクエリ） */}
      <form action="/blog" method="get" className="search" role="search">
        <label htmlFor="q" className="visually-hidden">ブログ内検索</label>
        <input
          id="q"
          name="q"
          type="search"
          inputMode="search"
          placeholder="キーワードで検索（タイトル・説明）"
          defaultValue={q}
          className="search__input"
          aria-label="ブログ内検索"
        />
        <button type="submit" className="btn btn--brand">検索</button>
      </form>

      {/* カード一覧 */}
      <ul className="cards" aria-live="polite">
        {posts.map((p) => (
          <li key={p.slug} className="card">
            <a href={`/blog/posts/${p.slug}`} className="card__link">
              <div className="card__title">{p.title}</div>
              <div className="card__date">
                {new Date(p.date).toLocaleDateString("ja-JP")}
              </div>
              <p className="card__desc">{p.description}</p>
            </a>
          </li>
        ))}
      </ul>

      <footer className="copyright">© 2025 OTORON</footer>
    </main>
  );
}

