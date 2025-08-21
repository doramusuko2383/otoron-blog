import Image from "next/image";
import clsx from "clsx";

type CardProps = {
  slug: string;
  title: string;
  description: string;
  date: string;
  thumb?: string;
};

export default function PostCard({ slug, title, description, date, thumb }: CardProps) {
  const img = thumb || "/otolon_face.webp";
  const isSquareFallback = img.includes("otolon_face");

  return (
    <a
      href={`/blog/posts/${slug}`}
      className="group block rounded-2xl border bg-white shadow-md transition hover:shadow-lg"
    >
      {/* 画像ラッパー：ここで 16:9 を決める */}
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-t-2xl bg-gray-50">
        <Image
          src={img}
          alt={title}
          fill
          sizes="(max-width:640px) 100vw, 384px"
          className={clsx(isSquareFallback ? "object-contain" : "object-cover")}
          priority={false}
        />
      </div>

      {/* テキスト */}
      <div className="p-4">
        <div className="text-sm text-gray-400">
          {new Date(date).toLocaleDateString("ja-JP")}
        </div>
        <h3 className="mt-1 line-clamp-2 text-base font-semibold leading-snug">{title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-gray-600">{description}</p>
      </div>
    </a>
  );
}
