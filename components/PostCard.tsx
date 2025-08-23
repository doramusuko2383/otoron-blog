import Image from "next/image";

export type CardProps = {
  slug: string;
  title: string;
  description: string;
  date: string;
  thumb?: string; // あれば使う。無ければ画像は出さない
};

export default function PostCard({ slug, title, description, date, thumb }: CardProps) {
  return (
    <a
      href={`/blog/posts/${slug}`}
      className="group block rounded-2xl border bg-white shadow-md transition hover:shadow-lg"
    >
      <div className="w-full overflow-hidden rounded-t-2xl bg-gray-50">
        {thumb ? (
          <Image
            alt={title}
            src={thumb}
            width={1280}
            height={720}
            sizes="(max-width:640px) 100vw, 384px"
            className="w-full h-auto object-cover"
            priority={false}
          />
        ) : (
          <div className="aspect-[16/9] w-full flex items-center justify-center text-gray-400">
            <span className="text-xs">No thumbnail</span>
          </div>
        )}
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
