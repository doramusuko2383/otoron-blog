// app/page.tsx
import Image from "next/image";
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
    <>
      {/* Hero */}
      <section className="hero">
        <div>
          <h1>オトロン公式ブログ</h1>
          <p>絶対音感トレーニングのノウハウ、幼児の耳育て、アプリ活用ガイドなどをお届けします。</p>
        </div>

        {/* mascot (PC表示) */}
        <Image
          className="hero__mascot"
          src="/otoron.webp"
          alt="オトロン（公式キャラクター）"
          width={140}
          height={140}
          priority
        />
      </section>

      {/* Cards */}
      <section className="cards">
        {posts.map((p) => (
          <a key={p.slug} className="card" href={`/blog/posts/${p.slug}`}>
            <h2 className="card_title">{p.title}</h2>
            <p className="card_meta">
              {new Date(p.date).toLocaleDateString("ja-JP")}
            </p>
            <p className="card_desc">{p.description}</p>
          </a>
        ))}
      </section>
    </>
  );
}

