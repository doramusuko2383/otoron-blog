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
  const q = (searchParams?.q ?? "").trim().toLowerCase();
  const all: BlogPost[] = getAllPosts();
  const posts = q
    ? all.filter((p) => {
        const hay = `${p.title ?? ""} ${p.description ?? ""} ${p.slug}`.toLowerCase();
        return hay.includes(q);
      })
    : all;

  return (
    <main className="wrap">
      <nav className="breadcrumb">
        <a href="/" className="brand">オトロン</a> <span>/ ブログ</span>
      </nav>

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
          defaultValue={q}
          placeholder="キーワードで検索"
          inputMode="search"
        />
        <button type="submit" className="btn">検索</button>
      </form>

      {/* 一覧 */}
      <ul className="cards" role="list">
        {posts.map((p) => (
          <li key={p.slug} className="cards__item">
            <a href={`/blog/posts/${p.slug}`} className="card">
              <h2 className="card__title">{p.title}</h2>
              <time className="card__date" dateTime={p.date}>
                {new Date(p.date).toLocaleDateString("ja-JP")}
              </time>
              <p className="card__desc">{p.description}</p>
            </a>
          </li>
        ))}
      </ul>

      {posts.length === 0 && (
        <p className="muted">該当する記事が見つかりませんでした。</p>
      )}

      <footer className="foot">© 2025 OTORON</footer>
    </main>
  );
}

