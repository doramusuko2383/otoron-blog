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
  const src  = thumb || "/otolon_face.webp";

  return (
    <a href={href} className="group block rounded-2xl border bg-white shadow-sm transition hover:shadow-md">
      {/* ←画像は必ず「枠」で囲う（16/9）。ここが最重要 */}
      <div className="relative w-full overflow-hidden rounded-t-2xl" style={{ aspectRatio: "16 / 9" }}>
        <Image
          src={src}
          alt={title}
          fill
          className="object-cover"
          // ここも重要：一覧カードで実際に使う幅だけを宣言
          sizes="(min-width:1024px) 560px, (min-width:640px) 50vw, 100vw"
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
