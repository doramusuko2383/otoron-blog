import Image from "next/image";
import PostCard from "@/components/PostCard";
import { getAllPostsMeta } from "@/lib/posts";

const MASCOT = "/otoron.webp";

export const metadata = {
  title: 'ブログ | オトロン',
  description: '公式サイトと統一感のある軽量ブログ',
  alternates: {
    canonical: '/blog',
    types: { 'application/rss+xml': '/rss.xml' },
  },
};

export default async function Page() {
  const posts = getAllPostsMeta()
    .filter((p: any) => !p.draft)
    .sort((a: any, b: any) => (a.date < b.date ? 1 : -1));

  const featured = posts.filter((p: any) => p.featured).slice(0, 3);
  const rest = posts.filter((p: any) => !p.featured);

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <div className="hero">
        <div className="heroText">
          <h1 className="pageTitle">オトロン公式ブログ</h1>
          <p className="lede">
            絶対音感トレーニングのノウハウ、幼児の耳育て、アプリ活用ガイドなどをお届けします。
          </p>
        </div>
        <div className="mascot">
          <Image
            src={MASCOT}
            alt="オトロン"
            fill
            sizes="80px"
            className="mascotImg"
            priority={false}
          />
        </div>
      </div>

      {featured.length > 0 && (
        <section className="mb-8">
          <h2 className="text-base font-semibold text-gray-700">注目記事</h2>
          <div className="mt-3 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {featured.map((p: any) => (
              <PostCard key={p.slug} {...p} />
            ))}
          </div>
        </section>
      )}

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {rest.map((p: any) => (
          <PostCard key={p.slug} {...p} />
        ))}
      </div>
    </main>
  );
}
