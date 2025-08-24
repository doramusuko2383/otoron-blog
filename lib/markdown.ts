import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkSmartypants from "remark-smartypants";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import { visit } from "unist-util-visit";
import { toString } from "mdast-util-to-string";
import GithubSlugger from "github-slugger";

export type Heading = { depth: number; text: string; id: string };

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
  // 1) 見出し一覧（目次用）を抽出し、GitHubSluggerでidを作る
  const mdast = unified().use(remarkParse).use(remarkGfm).parse(md);

  const slugger = new GithubSlugger();
  const headings: Heading[] = [];
  visit(mdast, "heading", (node: any) => {
    const text = toString(node);
    const id = slugger.slug(text);
    headings.push({ depth: node.depth, text, id });
  });

  // 2) HTML 生成（本文側の見出しにもidを付ける）
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkSmartypants)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, {
      behavior: "append",
      content: {
        type: "element",
        tagName: "span",
        properties: { className: ["anchor"] },
        children: [{ type: "text", value: "" }],
      },
    })
    .use(rehypeExternalLinks)
    .use(rehypeSanitize, schema as any)
    .use(rehypeStringify)
    .process(md);

  const html = String(file);
  return { html, headings };
}

export { rehypeExternalLinks };

