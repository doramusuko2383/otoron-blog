import Image from "next/image";
import PostCard from "@/components/PostCard";
import FadeInOnView from "@/components/FadeInOnView";
import { getAllPostsMeta } from "@/lib/posts";

const MASCOT = "/otoron.webp";

export const metadata = {
  title: "オトロン公式ブログ",
  description:
    "絶対音感トレーニングのノウハウ、幼児の耳育て、アプリ活用ガイドなどをお届けします。",
  alternates: { canonical: "https://playotoron.com/blog" },
  robots: { index: true, follow: true },
};

export default async function Page() {
  const posts = getAllPostsMeta()
    .filter((p: any) => !p.draft)
    .sort((a: any, b: any) => (a.date < b.date ? 1 : -1));

  return (
    <main className="wrap">
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

      <section className="cards">
        {posts.map((p: any) => (
          <FadeInOnView key={p.slug}>
            <PostCard
              slug={p.slug}
              title={p.title}
              description={p.description}
              date={p.date}
              thumb={p.thumb || p.ogImage}
            />
          </FadeInOnView>
        ))}
      </section>
    </main>
  );
}
