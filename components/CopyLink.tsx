'use client';
import { useState } from 'react';

type Variant = 'link' | 'icon';

export default function CopyLink({
  url,
  variant = 'link',
  className = '',
}: {
  url: string;
  variant?: Variant;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function doCopy() {
    const text = String(url || '');
    try {
      await navigator.clipboard.writeText(text);
      ok();
    } catch {
      try {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.top = '-1000px';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        ok();
      } catch {
        window.prompt('コピーできませんでした。下のテキストをコピーしてください。', text);
      }
    }
  }

  function ok() {
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }

  // アイコン（SVGにwidth/height属性を直書き = どんなCSSでも巨大化しない）
  const Icon = ({ ok = false }) =>
    ok ? (
      <svg width="14" height="14" viewBox="0 0 24 24" className="shrink-0" aria-hidden="true">
        <path fill="currentColor" d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" />
      </svg>
    ) : (
      <svg width="14" height="14" viewBox="0 0 24 24" className="shrink-0" aria-hidden="true">
        <path fill="currentColor" d="M16 1H6a2 2 0 0 0-2 2v12h2V3h10V1zm3 4H10a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H10V7h9v14z" />
      </svg>
    );

  if (variant === 'icon') {
    // アイコンだけ（極小・余白ゼロ）
    return (
      <button
        type="button"
        onClick={doCopy}
        data-copylink
        aria-label={copied ? 'コピーしました' : 'リンクをコピー'}
        className={`not-prose inline-flex h-4 w-4 items-center justify-center
                    appearance-none bg-transparent p-0 rounded
                    text-gray-500 hover:text-blue-600
                    focus:outline-none focus:ring-1 focus:ring-blue-300/70
                    ${className}`}
      >
        <Icon ok={copied} />
      </button>
    );
  }

  // テキストリンク風（極小）
  return (
    <button
      type="button"
      onClick={doCopy}
      data-copylink
      aria-live="polite"
      className={`not-prose inline-flex items-center gap-1
                  appearance-none bg-transparent h-5 px-1.5 rounded
                  text-xs leading-none text-blue-600 hover:underline hover:bg-blue-50/60
                  focus:outline-none focus:ring-1 focus:ring-blue-300/70
                  ${className}`}
    >
      <Icon ok={copied} />
      <span className="select-none">{copied ? 'コピーしました' : 'リンクをコピー'}</span>
    </button>
  );
}

