import Image from "next/image";
import { getAllPosts } from "@/lib/posts";

const MASCOT = "/otoron.webp";
const FALLBACK_THUMB = "/otolon_face.webp";

export const metadata = {
  title: "オトロン公式ブログ",
  description:
    "絶対音感トレーニングのノウハウ、幼児の耳育て、アプリ活用ガイドなどをお届けします。",
  alternates: { canonical: "https://playotoron.com/blog" },
  robots: { index: true, follow: true },
};

export default async function Page() {
  const posts = getAllPosts();

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
        {posts.map((p) => {
          const href = `/blog/posts/${p.slug}`;
          const thumb = p.thumb || p.ogImage || FALLBACK_THUMB;
          return (
            <a key={p.slug} href={href} className="card">
              <div className="thumb">
                <Image
                  src={thumb}
                  alt={p.title}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="thumbImg"
                />
              </div>
              <div className="cardBody">
                <h2 className="cardTitle">{p.title}</h2>
                <div className="cardMeta">
                  {new Date(p.date).toLocaleDateString("ja-JP")}
                </div>
                <p className="cardDesc">{p.description}</p>
              </div>
            </a>
          );
        })}
      </section>
    </main>
  );
}
