import Image from "next/image";

export default function PostCard({ post }: { post: any }) {
  const href = `/blog/posts/${post.slug}`;
  const src = post.thumb ?? "/images/no-thumb.png";

  return (
    <article className="card overflow-hidden">
      <a href={href} className="block group">
        <div className="post-card-thumb relative w-full aspect-[16/9]">
          <Image
            src={src}
            alt={post.title}
            fill
            className="object-cover rounded-xl transition-transform duration-300 group-hover:scale-[1.03]"
            sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
            priority={false}
          />
        </div>

        <div className="p-4">
          <h2 className="text-base md:text-lg font-semibold leading-snug line-clamp-2">
            {post.title}
          </h2>
          <p className="mt-2 text-sm text-gray-500 line-clamp-2">{post.description}</p>
        </div>
      </a>

      {Array.isArray(post.tags) && post.tags.length > 0 && (
        <div className="px-4 pb-4 flex flex-wrap gap-2">
          {post.tags.slice(0, 3).map((t: string) => (
            <a
              key={t}
              href={`/blog/tags/${encodeURIComponent(t)}`}
              className="tag-chip"
            >
              {t}
            </a>
          ))}
        </div>
      )}
    </article>
  );
}
