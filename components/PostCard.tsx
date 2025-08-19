import Image from 'next/image';

export default function PostCard({ slug, title, description, date, thumb }: any) {
  const href = `/blog/posts/${slug}`;
  const img = thumb || '/otolon_face.webp';

  return (
    <a href={href} className="block rounded-xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md">
      <div className="relative aspect-[16/9] overflow-hidden rounded-t-xl bg-gray-50">
        <Image
          src={img}
          alt={title}
          fill
          sizes="(max-width:768px) 100vw, 400px"
          className="object-cover transition duration-300 group-hover:scale-[1.02]"
          priority={false}
        />
      </div>
      <div className="p-4">
        <time className="block text-xs text-gray-400">
          {new Date(date).toLocaleDateString('ja-JP')}
        </time>
        <h3 className="mt-1 font-semibold text-gray-900">{title}</h3>
        <p className="mt-1 text-sm text-gray-600">{description}</p>
      </div>
    </a>
  );
}
