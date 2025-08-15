import { unified } from 'unified';
import parse from 'remark-parse';
import gfm from 'remark-gfm';
import slug from 'remark-slug';
import autolink from 'remark-autolink-headings';
import remark2rehype from 'remark-rehype';
import sanitize from 'rehype-sanitize';
import stringify from 'rehype-stringify';
import externalLinks from 'rehype-external-links';

export type TocItem = { depth: number; value: string; id: string };

function uniqueSlug(base: string, used = new Set<string>()) {
  let s = base; let i = 2;
  while (used.has(s)) s = `${base}-${i++}`;
  used.add(s);
  return s;
}

export async function renderMarkdown(md: string): Promise<{ html: string; toc: TocItem[] }> {
  const file = await unified()
    .use(parse)
    .use(gfm)
    .use(slug)                               // 見出しにid付与
    .use(autolink, { behavior: 'append' })   // 見出し末尾にアンカー
    .use(remark2rehype, { allowDangerousHtml: false })
    .use(sanitize, {
      attributes: {
        '*': ['className', 'id'],
        a: ['href', 'name', 'target', 'rel', 'aria-hidden', 'title'],
        img: ['src', 'alt', 'title', 'width', 'height', 'loading', 'decoding'],
      },
    })
    .use(externalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] })
    .use(stringify)
    .process(md);

  // 簡易TOC生成（h2/h3）
  const toc: TocItem[] = [];
  const used = new Set<string>();
  for (const line of md.split('\n')) {
    const m = line.match(/^(#{2,3})\s+(.*)$/);
    if (!m) continue;
    const depth = m[1].length;
    const raw = m[2].trim();
    const base = raw
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s-]/gu, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    const id = uniqueSlug(base || 'section', used);
    toc.push({ depth, value: raw, id });
  }

  return { html: String(file), toc };
}
