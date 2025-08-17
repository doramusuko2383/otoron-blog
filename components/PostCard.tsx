import Image from "next/image";

const FALLBACK_THUMB = "/otolon_face.webp";

interface Props {
  slug: string;
  title: string;
  description: string;
  date: string;
  thumb?: string;
  readingMinutes?: number;
}

export default function PostCard({ slug, title, description, date, thumb, readingMinutes }: Props) {
  const href = `/blog/posts/${slug}`;
  const hero = thumb || FALLBACK_THUMB;
  return (
    <a href={href} className="card">
      <div className="thumb">
        <Image
          src={hero}
          alt={title}
          fill
          sizes="(max-width: 768px) 50vw, 33vw"
          className="thumbImg"
        />
      </div>
      <div className="cardBody">
        <h2 className="cardTitle">{title}</h2>
        <div className="cardMeta">
          {new Date(date).toLocaleDateString("ja-JP")}
          {typeof readingMinutes === "number" && (
            <span> ・ 約 {readingMinutes} 分</span>
          )}
        </div>
        <p className="cardDesc">{description}</p>
      </div>
    </a>
  );
}
