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
      {/* サムネ */}
      <div
        className="overflow-hidden rounded-t-2xl bg-gray-50"
        style={{ aspectRatio: "16 / 9" }}
      >
        <Image
          src={img}
          alt={title}
          width={640}
          height={360}
          className="h-full w-full object-cover"
          sizes="(max-width: 640px) 100vw, 384px"
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
