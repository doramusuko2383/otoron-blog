import Image from "next/image";

export default function PostCard({ post }: { post: any }) {
  const href = `/blog/posts/${post.slug}`;
  const src  = post.thumb ?? "/images/no-thumb.png";

  return (
    <article className="card overflow-hidden">
      <a href={href} className="block group">
        <div className="post-card-thumb">
          <Image
            src={src}
            alt={post.title}
            fill
            sizes="(min-width:1280px) 25vw, (min-width:640px) 33vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            priority={false}
          />
        </div>

        <div className="p-4">
          <h2 className="text-base md:text-lg font-semibold leading-snug line-clamp-2">
            {post.title}
          </h2>
          {post.description && (
            <p className="mt-2 text-sm text-gray-500 line-clamp-2">{post.description}</p>
          )}
        </div>
      </a>
    </article>
  );
}
