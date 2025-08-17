export type BlogPost = {
  slug: string;
  date: string;
  content: string;
  title?: string;
  description?: string;
  ogImage?: string;
  updated?: string;
  draft?: boolean;
  featured?: boolean;
  readingMinutes?: number;
};

declare module "@/lib/posts" {
  import type { BlogPost } from "../types/posts";
  export function getAllPosts(): BlogPost[];
  export function getPost(slug: string): BlogPost | null;
  export function getPrevNext(slug: string): {
    prev: BlogPost | null;
    next: BlogPost | null;
  };
}
