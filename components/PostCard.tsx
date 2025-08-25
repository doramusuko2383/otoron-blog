import Image from "next/image";

export default function PostCard({ post }: { post: any }) {
  const href = `/blog/posts/${post.slug}`;
  const src = post.thumb ?? "/images/no-thumb.png";

  return (
    <article className="card overflow-hidden">
      <a href={href} className="block">
        {/* 16:9 の器 + 最大200pxでクランプ */}
        <div className="relative aspect-[16/9] w-full max-h-[200px]">
          <Image
            src={src}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
            priority={false}
          />
        </div>
      </a>

      <div className="p-4">
        <a href={href} className="link-plain">
          <h2 className="text-base md:text-lg font-semibold leading-snug line-clamp-2">
            {post.title}
          </h2>
        </a>
        <p className="mt-2 text-sm text-gray-500 line-clamp-2">{post.description}</p>

        {post.tags?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((t: string) => (
              <a key={t} href={`/blog/tags/${encodeURIComponent(t)}`} className="tag-chip">
                {t}
              </a>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
