// lib/posts.js
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { renderMarkdown } from "./markdown";

const POSTS_DIR = path.join(process.cwd(), "posts");
const MD_REGEX = /\.mdx?$/i;

function stripMd(md) {
  return md
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]+`/g, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[[^\]]+\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function estimateJaMinutes(md) {
  const chars = stripMd(md).length;
  const CPM = 550; // 日本語のざっくり読字速度（400–600の中庸）
  return Math.max(1, Math.round(chars / CPM));
}

const slugify = (s) =>
  s.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]/g, '');

const normalizeTags = (tags) => {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags.map(String).map((s) => s.trim()).filter(Boolean);
  return String(tags)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
};

function extractHeadingsFromMarkdown(md) {
  const lines = md.split('\n');
  const hs = [];
  for (const line of lines) {
    const m2 = line.match(/^##\s+(.+)/);
    const m3 = line.match(/^###\s+(.+)/);
    if (m2) hs.push({ depth: 2, text: m2[1].trim(), id: slugify(m2[1]) });
    if (m3) hs.push({ depth: 3, text: m3[1].trim(), id: slugify(m3[1]) });
  }
  return hs;
}

// HTML文字列の <h2>/<h3> に id を埋め込む（同じslugなら上書き）
function injectIdsToHtmlHeadings(html, headings) {
  let out = html;
  for (const h of headings) {
    if (h.depth === 2) {
      out = out.replace(
        new RegExp(`<h2>(\\s*?)${h.text.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}(\\s*?)<\/h2>`),
        `<h2 id="${h.id}">$1${h.text}$2</h2>`
      );
    }
    if (h.depth === 3) {
      out = out.replace(
        new RegExp(`<h3>(\\s*?)${h.text.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}(\\s*?)<\/h3>`),
        `<h3 id="${h.id}">$1${h.text}$2</h3>`
      );
    }
  }
  return out;
}

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

  p.tags = normalizeTags(data.tags);
  p.readingMinutes = estimateJaMinutes(content);
  p.featured = Boolean(p.featured);
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
  const { data, content } = matter(raw);

  const p = { slug, ...data };
  assertFrontMatter(p);

  p.tags = normalizeTags(data.tags);
  p.readingMinutes = estimateJaMinutes(content);
  p.featured = Boolean(p.featured);

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
  const md = p.content;
  const headings = extractHeadingsFromMarkdown(md);
  const minutes = estimateJaMinutes(md);
  const { html } = await renderMarkdown(md);
  const htmlWithIds = injectIdsToHtmlHeadings(html, headings);
  return { ...p, html: htmlWithIds, headings, readingMinutes: minutes };
}

// 前後ナビ（非同期ラッパー）
export async function getAdjacentPosts(slug) {
  return getPrevNext(slug);
}

// 関連記事を取得
export async function getRelatedPosts(slug, limit = 2) {
  const all = (await getAllPostsMeta()).filter((p) => !p.draft && p.slug !== slug);
  const cur = await getPostBySlug(slug);
  if (!cur) return all.slice(0, limit);

  const curTags = new Set((cur.tags ?? []).map((t) => String(t).toLowerCase()));
  const curDate = new Date(cur.date);

  all.sort((a, b) => {
    const score = (p) =>
      (p.tags ?? []).reduce(
        (s, t) => s + (curTags.has(String(t).toLowerCase()) ? 1 : 0),
        0
      );
    const ta = score(b) - score(a); // 1) タグ一致数が多い順
    if (ta !== 0) return ta;

    const sameMonth = (p) => {
      const d = new Date(p.date);
      return d.getFullYear() === curDate.getFullYear() && d.getMonth() === curDate.getMonth();
    };
    const mb = Number(sameMonth(b)) - Number(sameMonth(a)); // 2) 同月優先
    if (mb !== 0) return mb;

    const da = Math.abs(new Date(a.date) - curDate); // 3) 近い順
    const db = Math.abs(new Date(b.date) - curDate);
    return da - db;
  });

  return all.slice(0, limit);
}
