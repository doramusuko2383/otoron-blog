import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDir = path.join(process.cwd(), "posts");

function assertFrontMatter(p) {
  const missing = ["title", "description", "date"].filter(k => !p[k]);
  if (missing.length) throw new Error(`Front-matter missing: ${missing.join(', ')} in ${p.slug}`);
}

export function getAllPosts() {
  if (!fs.existsSync(postsDir)) return [];
  const files = fs.readdirSync(postsDir).filter(f => f.endsWith(".md"));
  const posts = files.map(file => {
    const slug = file.replace(/\.md$/, "");
    const raw = fs.readFileSync(path.join(postsDir, file), "utf8");
    const { data, content } = matter(raw);
    const p = { slug, content, ...data };
    assertFrontMatter(p);
    return p;
  });
  return posts.sort((a,b) => (a.date < b.date ? 1 : -1));
}

export function getPost(slug) {
  const full = path.join(postsDir, `${slug}.md`);
  if (!fs.existsSync(full)) return null;
  const raw = fs.readFileSync(full, "utf8");
  const { data, content } = matter(raw);
  const p = { slug, content, ...data };
  assertFrontMatter(p);
  return p;
}
