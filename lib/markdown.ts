import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkSmartypants from "remark-smartypants";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import { visit } from "unist-util-visit";
import { toString } from "mdast-util-to-string";

export type Heading = { level: number; title: string; id: string };

export function slugify(raw: string): string {
  const base = raw.trim().replace(/\s+/g, "-");
  return encodeURIComponent(base);
}

export function addHeadingIds(html: string): string {
  return html.replace(/<h([1-4])([^>]*)>([\s\S]*?)<\/h\1>/g, (_m, lvl, attrs, inner) => {
    if (/\sid=/.test(attrs)) return `<h${lvl}${attrs}>${inner}</h${lvl}>`;
    const text = inner.replace(/<[^>]+>/g, "").trim();
    const id = slugify(text);
    return `<h${lvl}${attrs} id="${id}" class="anchor-target">${inner}</h${lvl}>`;
  });
}

function rehypeExternalLinks() {
  return (tree: any) => {
    visit(tree, "element", (node: any) => {
      if (node.tagName !== "a") return;
      const href = node.properties?.href;
      if (typeof href !== "string") return;
      if (/^https?:\/\//i.test(href)) {
        node.properties = {
          ...node.properties,
          target: "_blank",
          rel: Array.from(
            new Set([...(node.properties?.rel || []), "nofollow", "noopener", "noreferrer"])
          ),
        };
      }
    });
  };
}

// rehype-sanitize の許可拡張（必要最低限）
const schema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    a: [
      ...(defaultSchema.attributes?.a || []),
      ["target", ["_blank"]],
      ["rel", ["noopener", "noreferrer", "nofollow"]],
    ],
    img: [
      ...(defaultSchema.attributes?.img || []),
      ["loading", ["lazy"]],
      ["decoding", ["async"]],
      ["referrerpolicy", ["no-referrer"]],
    ],
    code: [...(defaultSchema.attributes?.code || []), ["className", "string"]],
  },
  tagNames: [
    ...(defaultSchema.tagNames || []),
    "details",
    "summary",
    "kbd",
    "mark",
    "figure",
    "figcaption",
  ],
};

export async function parseMarkdown(md: string) {
  const mdast = unified().use(remarkParse).use(remarkGfm).parse(md);

  const headings: Heading[] = [];
  visit(mdast, "heading", (node: any) => {
    const title = toString(node);
    const id = slugify(title);
    headings.push({ level: node.depth, title, id });
  });

  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkSmartypants)
    .use(remarkRehype)
    .use(rehypeExternalLinks)
    .use(rehypeSanitize, schema as any)
    .use(rehypeStringify)
    .process(md);

  const html = addHeadingIds(String(file));
  return { html, headings };
}

export { rehypeExternalLinks };

