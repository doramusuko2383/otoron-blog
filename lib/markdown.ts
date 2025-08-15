import { unified } from "unified";
import parse from "remark-parse";
import gfm from "remark-gfm";
import smartypants from "remark-smartypants";
import remark2rehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import slug from "rehype-slug";
import autolink from "rehype-autolink-headings";
import externalLinks from "rehype-external-links";
import rehypeToc from "rehype-toc";
import sanitize from "rehype-sanitize";
import type { Root } from "hast";
import { defaultSchema } from "hast-util-sanitize";

// ---- 設定：sanitize allowlist（表・コード・画像など許可） ----
const schema: any = structuredClone(defaultSchema);

// 追加タグ
schema.tagNames = Array.from(
  new Set([
    ...(schema.tagNames ?? []),
    "section",
    "details",
    "summary",
    "table",
    "thead",
    "tbody",
    "tr",
    "th",
    "td",
    "pre",
    "code",
    "img",
  ])
);

// a要素の追加属性
schema.attributes = {
  ...(schema.attributes ?? {}),
  a: [
    ...(schema.attributes?.a ?? []),
    "href",
    "name",
    "target",
    "rel",
    "aria-label",
  ],
  img: [
    ...(schema.attributes?.img ?? []),
    "src",
    "alt",
    "title",
    "width",
    "height",
    "decoding",
    "loading",
  ],
  code: [
    ...(schema.attributes?.code ?? []),
    // rehype-prism など導入時に className を許可
    ["className", /^language-[\w-]+$/],
  ],
  th: [...(schema.attributes?.th ?? []), "align"],
  td: [...(schema.attributes?.td ?? []), "align"],
};

// headingアンカーリンクの見た目（自動で小さなリンクアイコンを追加しない）
const autolinkOptions = {
  behavior: "append" as const,
  content: () => ({
    type: "text",
    value: "",
  }),
};

// TOC出力を受け取るための一時変数
function captureToc() {
  let tocHtml = "";
  return {
    plugin: () =>
      function rehypeTocCapture(tree: Root) {
        // rehype-toc 実行後、tree 内に .toc を含むノードが乗るので、
        // 文字列化の前に抽出するのではなく、2パスに分ける。
        // → 今回は rehype-toc を1回目のパイプラインで走らせ、文字列化結果から抽出する方式にする。
      },
    get html() {
      return tocHtml;
    },
    set(html: string) {
      tocHtml = html;
    },
  };
}

/**
 * Markdown文字列を安全にHTMLへ変換し、
 * 本文HTMLとTOC(目次)HTMLを返す
 */
export async function renderMarkdown(md: string): Promise<{ html: string; toc: string }> {
  // 1パス目：TOC付きでHTML化
  const withToc = await unified()
    .use(parse)
    .use(gfm)
    .use(smartypants)
    .use(remark2rehype, { allowDangerousHtml: false })
    .use(slug) // 見出しにid付与
    .use(autolink, autolinkOptions)
    .use(externalLinks, { target: "_blank", rel: ["noopener", "noreferrer"] })
    .use(rehypeToc, {
      headings: ["h1", "h2", "h3"],
      cssClasses: {
        toc: "toc",
        list: "toc-list",
        listItem: "toc-item",
        link: "toc-link",
      },
    })
    .use(sanitize, schema)
    .use(rehypeStringify)
    .process(md);

  const withTocHtml = String(withToc);

  // 2パス目：同じ内容をTOCなしで本文のみHTML化（TOCは別枠で出すため）
  const withoutToc = await unified()
    .use(parse)
    .use(gfm)
    .use(smartypants)
    .use(remark2rehype, { allowDangerousHtml: false })
    .use(slug)
    .use(autolink, autolinkOptions)
    .use(externalLinks, { target: "_blank", rel: ["noopener", "noreferrer"] })
    .use(sanitize, schema)
    .use(rehypeStringify)
    .process(md);

  const bodyHtml = String(withoutToc);

  // withTocHtml から .toc セクションだけを切り出す（簡易抽出）
  // rehypeをもう一度使うのもアリだが、軽量に正規化された構造前提で抽出
  const tocMatch = withTocHtml.match(/<nav class="toc"[\s\S]*?<\/nav>/);
  const tocHtml = tocMatch ? tocMatch[0] : "";

  return { html: bodyHtml, toc: tocHtml };
}
