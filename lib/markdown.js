import { remark } from 'remark';
import html from 'remark-html';
import { visit } from 'unist-util-visit';
import { toString } from 'mdast-util-to-string';

function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u3040-\u30ff\u3400-\u9faf\s-]/g, '')
    .replace(/\s+/g, '-');
}

export async function renderMarkdown(md) {
  const toc = [];
  const processor = remark().use(() => tree => {
    visit(tree, 'heading', node => {
      const text = toString(node);
      const id = slugify(text);
      node.data = node.data || {};
      node.data.hProperties = { ...(node.data.hProperties || {}), id };
      node.children.push({
        type: 'link',
        url: `#${id}`,
        data: { hProperties: { className: 'anchor', 'aria-hidden': 'true' } },
        children: [{ type: 'text', value: '#' }]
      });
      toc.push({ depth: node.depth, id, title: text });
    });
  }).use(html, { sanitize: false });
  const file = await processor.process(md);
  return { html: String(file), toc };
}
