import Image from 'next/image';

type CardProps = {
  slug: string;
  title: string;
  description: string;
  date: string;
  thumb?: string;
};

export default function PostCard({ slug, title, description, date, thumb }: CardProps) {
  const href = `/blog/posts/${slug}`;
  const img = thumb || '/otolon_face.webp';

  return (
    <a
      href={href}
      className="group block rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md"
    >
      {/* 高さを“確実に”確保（Tailwindに依存しない） */}
      <div className="rounded-t-2xl overflow-hidden bg-gray-50">
        <div className="relative w-full" style={{ aspectRatio: '16 / 9' }}>
          {/* 親が relative / 高さあり → fill が安全に使える */}
          <Image
            src={img}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, 520px"
            className="object-cover"
            priority={false}
          />
        </div>
      </div>

      <div className="p-4">
        <time className="block text-xs text-gray-400">
          {new Date(date).toLocaleDateString('ja-JP')}
        </time>
        <h3 className="mt-1 font-semibold leading-snug line-clamp-2">{title}</h3>
        <p className="mt-1 text-sm text-gray-600 line-clamp-3">{description}</p>
      </div>
    </a>
  );
}
