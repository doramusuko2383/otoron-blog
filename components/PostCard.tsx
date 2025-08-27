import Image from "next/image";

export default function PostCard({ post }: { post: any }) {
  const href = `/blog/posts/${post.slug}`;
  const src  = post.thumb ?? "/images/no-thumb.png";

  return (
    <article className="card overflow-hidden group">
      <a href={href} className="block group">
        <div className="post-card-thumb">
          <Image
            src={src}
            alt={post.title}
            fill
            priority={false}
            sizes="(min-width:1024px) 320px, (min-width:640px) 50vw, 100vw"
            className="transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </div>
      </a>

      <div className="p-4">
        <h2 className="text-base md:text-lg font-semibold leading-snug line-clamp-2">
          <a href={href} className="link-plain">{post.title}</a>
        </h2>
        {post.description && (
          <p className="mt-1 text-sm text-gray-600 line-clamp-2">{post.description}</p>
        )}
        {Array.isArray(post.tags) && post.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {post.tags.slice(0,3).map((t:string)=>(
              <a key={t} href={`/blog/tags/${encodeURIComponent(t)}`} className="tag-chip">{t}</a>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
