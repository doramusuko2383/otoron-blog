import Image from "next/image";
import PostCard from "@/components/PostCard";
import { getAllPostsMeta, type PostMeta } from "@/lib/posts";

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
  const posts: PostMeta[] = (await getAllPostsMeta())
    .filter((p) => !p.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  const [latest, ...others] = posts;
  const hero = latest.thumb ?? latest.ogImage ?? "/otolon_face.webp";
  const title = latest.title;

  const featured = others.filter((p) => p.featured).slice(0, 3);
  const rest = others.filter((p) => !p.featured);

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
          width={110}
          height={110}
          sizes="80px"
          className="mascotImg h-full w-full"
          priority={false}
        />
      </div>
    </div>

      <div className="relative mt-4 mx-auto w-full max-w-4xl aspect-[16/9] post-hero overflow-hidden rounded-xl border bg-gray-100">
        <Image
          src={hero}
          alt={title}
          fill
          priority
          sizes="(max-width:768px) 100vw, 720px"
          className={hero.includes("otolon_face") ? "object-contain" : "object-cover"}
        />
      </div>

      {featured.length > 0 && (
        <section className="mb-8">
          <h2 className="text-base font-semibold text-gray-700">注目記事</h2>
          <div className="mt-3 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {featured.map((p) => (
              <PostCard
                key={p.slug}
                slug={p.slug}
                title={p.title}
                description={p.description}
                date={p.date}
                thumb={p.thumb}
              />
            ))}
          </div>
        </section>
      )}

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {rest.map((p) => (
          <PostCard
            key={p.slug}
            slug={p.slug}
            title={p.title}
            description={p.description}
            date={p.date}
            thumb={p.thumb}
          />
        ))}
      </div>
    </main>
  );
}
