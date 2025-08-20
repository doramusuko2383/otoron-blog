import Image from "next/image";

type CardProps = {
  slug: string;
  title: string;
  description: string;
  date: string;
  thumb?: string;
};

export default function PostCard({ slug, title, description, date, thumb }: CardProps) {
  const href = `/blog/posts/${slug}`;
  const img = thumb || "/otolon_face.webp";

  return (
    <a href={href} className="group block rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md">
      {/* ←画像は必ず「枠」で囲う（16/9）。ここが最重要 */}
      <div className="relative w-full overflow-hidden rounded-t-2xl" style={{ aspectRatio: "16 / 9" }}>
        <Image
          src={img}
          alt={title}
          fill
          sizes="(max-width:640px) 100vw, 360px"
          className="object-cover"
          priority={false}
        />
      </div>

      <div className="p-4">
        <time className="block text-xs text-gray-400">{new Date(date).toLocaleDateString("ja-JP")}</time>
        <h3 className="mt-1 line-clamp-2 font-semibold leading-snug">{title}</h3>
        <p className="mt-1 text-sm text-gray-600 line-clamp-2">{description}</p>
      </div>
    </a>
  );
}
