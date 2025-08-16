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
    alternates: {
      canonical: `${BASE}/blog`,
      types: { "application/rss+xml": `${BASE}/feed.xml` },
    },
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

export default async function Home() {
  const posts = getAllPosts();

  return (
    <main className="wrap">
      <h1 className="page-title">オトロン公式ブログ</h1>
      <p className="lede">
        絶対音感トレーニングのノウハウ、幼児の耳育て、アプリ活用ガイドなどをお届けします。
      </p>

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
    </main>
  );
}

