// app/page.tsx
import { getAllPosts } from "@/lib/posts";

/** メタデータ（canonical は /blog 固定） */
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

/** 一覧ページ（/）。検索はクエリパラメータ ?q= でサーバー側フィルタ */
export default async function Home({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const q = (searchParams?.q ?? "").trim().toLowerCase();

  // 投稿一覧（draftは lib/posts 側で除外済み）
  const all = getAllPosts();

  const posts = q
    ? all.filter((p) => {
        const hay = `${p.title ?? ""} ${p.description ?? ""} ${p.slug}`.toLowerCase();
        return hay.includes(q);
      })
    : all;

  return (
    <main className="container mx-auto px-4 py-10">
      {/* パンくず（簡易） */}
      <nav className="text-sm mb-6 text-violet-700">
        <a href="/" className="font-semibold">
          オトロン
        </a>{" "}
        / ブログ
      </nav>

      <h1 className="text-5xl font-extrabold tracking-tight mb-3">
        オトロン公式ブログ
      </h1>
      <p className="text-gray-600 mb-6">
        絶対音感トレーニングのノウハウ、幼児の耳育て、アプリ活用ガイドなどをお届けします。
      </p>

      {/* 検索フォーム（GETで/?q=） */}
      <form action="/" method="get" className="mb-6">
        <input
          name="q"
          defaultValue={q}
          placeholder="検索"
          className="border rounded px-3 py-2 w-full max-w-md"
          aria-label="記事検索"
        />
      </form>

      {/* 一覧 */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {posts.map((p) => (
          <a
            key={p.slug}
            href={`/blog/posts/${p.slug}`} // /blog → rewrites で /posts へ
            className="block rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow transition"
          >
            <h2 className="text-violet-700 text-xl font-semibold leading-snug">
              {p.title}
            </h2>
            <div className="text-sm text-gray-500 mt-1">
              {new Date(p.date).toLocaleDateString("ja-JP")}
            </div>
            <p className="text-gray-700 mt-2">{p.description}</p>
          </a>
        ))}
      </section>

      {/* ヒットなし */}
      {posts.length === 0 && (
        <p className="text-gray-600 mt-8">該当する記事が見つかりませんでした。</p>
      )}

      <footer className="text-xs text-gray-500 mt-12">© 2025 OTORON</footer>
    </main>
  );
}
