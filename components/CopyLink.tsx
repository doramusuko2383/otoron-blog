'use client';
import { useState } from 'react';

type Variant = 'link' | 'icon'; // link=テキストリンク風, icon=アイコンだけ

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
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
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
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      } catch {
        window.prompt('コピーできませんでした。下のテキストをコピーしてください。', text);
      }
    }
  }

  // 共通アイコン
  const Icon = ({ ok }: { ok: boolean }) => (
    ok ? (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-blue-600" aria-hidden="true">
        <path fill="currentColor" d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" />
      </svg>
    ) : (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" aria-hidden="true">
        <path
          fill="currentColor"
          d="M16 1H6a2 2 0 0 0-2 2v12h2V3h10V1zm3 4H10a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H10V7h9v14z"
        />
      </svg>
    )
  );

  if (variant === 'icon') {
    // アイコンだけ（さらに小さく）
    return (
      <button
        type="button"
        onClick={doCopy}
        aria-label={copied ? 'コピーしました' : 'リンクをコピー'}
        className={`not-prose inline-flex h-5 w-5 items-center justify-center rounded-md
                    text-gray-500 hover:text-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-300/70
                    ${className}`}
      >
        <Icon ok={copied} />
      </button>
    );
  }

  // デフォルト：テキストリンク風（極小）
  return (
    <button
      type="button"
      onClick={doCopy}
      aria-live="polite"
      className={`not-prose inline-flex items-center gap-1 h-5 px-1.5 rounded-md
                  text-[11px] leading-[1] text-blue-600 hover:underline hover:bg-blue-50/60
                  focus:outline-none focus:ring-1 focus:ring-blue-300/70
                  ${className}`}
    >
      <Icon ok={copied} />
      <span className="select-none">{copied ? 'コピーしました' : 'リンクをコピー'}</span>
    </button>
  );
}

