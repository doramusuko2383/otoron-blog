// lib/posts.js
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { renderMarkdown } from "./markdown";

const POSTS_DIR = path.join(process.cwd(), "posts");
const MD_REGEX = /\.mdx?$/i;

// posts/ 内のMarkdownファイル一覧を取得（READMEと"_"始まりは無視）
function listPostFiles() {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => MD_REGEX.test(f))
    .filter((f) => !/^readme(\.mdx?)?$/i.test(f)) // READMEを無視
    .filter((f) => !f.startsWith("_"));           // _で始まるファイルを無視（運用メモなど）
}

// 必須Front-matterをチェック
function assertFrontMatter(p) {
  const missing = ["title", "description", "date"].filter((k) => !p[k]);
  if (missing.length) {
    throw new Error(`Front-matter missing: ${missing.join(", ")} in ${p.slug}`);
  }
}

// ファイル→投稿オブジェクトへ変換
function readPost(file) {
  const slug = file.replace(MD_REGEX, "");
  const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf8");
  const { data, content } = matter(raw);

  const p = { slug, content, ...data };
  assertFrontMatter(p);

  // 日付を YYYY-MM-DD 文字列へ正規化（不正ならそのまま文字列）
  const d = new Date(p.date);
  p.date = isNaN(d) ? String(p.date) : d.toISOString().slice(0, 10);

  // 正規化（空なら undefined）
  p.thumb =
    typeof p.thumb === "string" && p.thumb.trim() ? p.thumb.trim() : undefined;
  p.ogImage =
    typeof p.ogImage === "string" && p.ogImage.trim() ? p.ogImage.trim() : undefined;

  return p;
}

// ファイル→投稿メタ情報へ変換（content除外）
function readPostMeta(file) {
  const slug = file.replace(MD_REGEX, "");
  const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf8");
  const { data } = matter(raw);

  const p = { slug, ...data };
  assertFrontMatter(p);

  // 日付を YYYY-MM-DD 文字列へ正規化（不正ならそのまま文字列）
  const d = new Date(p.date);
  p.date = isNaN(d) ? String(p.date) : d.toISOString().slice(0, 10);

  // 正規化（空なら undefined）
  p.thumb =
    typeof p.thumb === "string" && p.thumb.trim() ? p.thumb.trim() : undefined;
  p.ogImage =
    typeof p.ogImage === "string" && p.ogImage.trim() ? p.ogImage.trim() : undefined;

  return p;
}

// 公開用投稿一覧（draft除外、日付降順）
export function getAllPosts() {
  return listPostFiles()
    .map(readPost)
    .filter((p) => !p.draft)
    .sort((a, b) => (a.date > b.date ? -1 : 1));
}

// 全投稿メタ情報（contentなし）
export function getAllPostsMeta() {
  return listPostFiles().map(readPostMeta);
}

// 個別取得（slugは拡張子なし）
export function getPost(slug) {
  const file = listPostFiles().find((f) => f.replace(MD_REGEX, "") === slug);
  if (!file) return null;
  return readPost(file);
}

// 前後ナビ用
export function getPrevNext(slug) {
  const posts = getAllPosts();
  const i = posts.findIndex((p) => p.slug === slug);
  return {
    prev: i > 0 ? posts[i - 1] : null,
    next: i >= 0 && i < posts.length - 1 ? posts[i + 1] : null,
  };
}

// SSGのgenerateStaticParams等で使える全スラッグ
export function getAllSlugs() {
  return listPostFiles().map((f) => f.replace(MD_REGEX, ""));
}

// slug指定で投稿を取得（HTML含む）
export async function getPostBySlug(slug) {
  const p = getPost(slug);
  if (!p) return null;
  const { html } = await renderMarkdown(p.content);
  return { ...p, html };
}

// 前後ナビ（非同期ラッパー）
export async function getAdjacentPosts(slug) {
  return getPrevNext(slug);
}

// 関連記事を取得
export async function getRelatedPosts(slug, limit = 2) {
  const all = (await getAllPostsMeta()).filter(
    (p) => !p.draft && p.slug !== slug
  );

  const cur = await getPostBySlug(slug);
  if (!cur) return all.slice(0, limit);

  const curDate = new Date(cur.date);

  const sameMonth = all.filter((p) => {
    const d = new Date(p.date);
    return (
      d.getFullYear() === curDate.getFullYear() &&
      d.getMonth() === curDate.getMonth()
    );
  });

  let result = sameMonth.slice(0, limit);

  if (result.length < limit) {
    const rest = all
      .filter((p) => !result.find((r) => r.slug === p.slug))
      .sort(
        (a, b) =>
          Math.abs(new Date(a.date).getTime() - curDate.getTime()) -
          Math.abs(new Date(b.date).getTime() - curDate.getTime())
      );
    result = result.concat(rest.slice(0, limit - result.length));
  }

  return result;
}
