declare module "@/lib/posts" {
  export type PostMeta = {
    slug: string;
    title: string;
    description: string;
    date: string;
    updated?: string;
    ogImage?: string;
    thumb?: string;
    featured?: boolean;
    tags?: string[];
    draft?: boolean;
    readingMinutes?: number;
  };

  export type BlogPost = PostMeta & {
    content: string;
  };

  export function getAllPosts(): BlogPost[];
  export function getAllPostsMeta(): PostMeta[];
  export function getPost(slug: string): BlogPost | null;
  export function getPrevNext(slug: string): {
    prev: BlogPost | null;
    next: BlogPost | null;
  };
  export function getPostBySlug(slug: string): Promise<
    (BlogPost & {
      html: string;
      headings: { depth: number; text: string; id: string }[];
    }) | null
  >;
  export function getAdjacentPosts(slug: string): Promise<{
    prev: BlogPost | null;
    next: BlogPost | null;
  }>;
  export function getRelatedPosts(slug: string, limit?: number): Promise<PostMeta[]>;
  export function getAllSlugs(): string[];
  export function getPaginatedPosts(
    offset?: number,
    limit?: number
  ): Promise<{
    items: PostMeta[];
    total: number;
    nextOffset: number;
    hasMore: boolean;
  }>;
}

