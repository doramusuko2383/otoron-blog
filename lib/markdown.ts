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

// 見出しから簡易TOCを作るプラグイン（h2/h3）
function collectToc() {
  return (tree: any, file: any) => {
    const headings: { depth: number; id: string; text: string }[] = [];
    const visit = (node: any) => {
      if (node.type === "element" && /^h[2-3]$/.test(node.tagName)) {
        const id = node.properties?.id || "";
        const text = (node.children || [])
          .filter((c: any) => c.type === "text")
          .map((c: any) => c.value)
          .join("");
        const depth = Number(node.tagName.slice(1));
        if (id && text) headings.push({ depth, id, text });
      }
      (node.children || []).forEach(visit);
    };
    visit(tree);

    if (!headings.length) {
      file.data.toc = null;
      file.data.headings = [];
      return;
    }

    // h2 をトップ、h3 をサブとして UL を組む
    let html = '<nav class="toc"><ul>';
    for (let i = 0; i < headings.length; i++) {
      const h = headings[i];
      if (h.depth === 2) {
        if (i !== 0) html += "</ul></li>";
        html += `<li><a href="#${h.id}">${h.text}</a><ul>`;
      } else {
        html += `<li><a href="#${h.id}">${h.text}</a></li>`;
      }
    }
    html += "</ul></li></ul></nav>";
    file.data.toc = html;
    file.data.headings = headings;
  };
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

export async function renderMarkdown(
  md: string
): Promise<{ html: string; toc: string | null; headings: { depth: number; id: string; text: string }[] }> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkSmartypants)
    .use(remarkRehype, { allowDangerousHtml: false })
    .use(rehypeSlug)
    .use(collectToc) // ← 先に見出しを収集（rehypeSlug 後）
    .use(rehypeAutolinkHeadings, {
      behavior: "wrap",
    })
    .use(rehypeExternalLinks)
    .use(rehypeSanitize, schema as any)
    .use(rehypeStringify)
    .process(md);

  return {
    html: String(file),
    toc: (file.data as any).toc ?? null,
    headings: (file.data as any).headings ?? [],
  };
}

export { rehypeExternalLinks };
