'use client';
import { useState } from 'react';

export default function CopyLink({
  url,
  className = '',
}: { url: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  async function doCopy() {
    const text = String(url || '');
    try {
      // 標準API
      await navigator.clipboard.writeText(text);
      done();
    } catch {
      // フォールバック（非HTTPS/権限NGでも可）
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
        done();
      } catch {
        // 最後の保険
        window.prompt('コピーできませんでした。下のテキストをコピーしてください。', text);
      }
    }
  }

  function done() {
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button
      type="button"
      onClick={doCopy}
      aria-live="polite"
      // not-prose で typography の巨大化を遮断。サイズを強制。
      className={`not-prose inline-flex items-center gap-1 rounded-full border
                  px-2 py-1 text-[12px] leading-none
                  border-gray-300 text-gray-700
                  hover:bg-blue-50 hover:border-blue-300
                  active:translate-y-[1px] focus:outline-none focus:ring-2 focus:ring-blue-300/60
                  ${className}`}
    >
      {/* コピー前アイコン */}
      <svg viewBox="0 0 24 24" className={`w-3.5 h-3.5 shrink-0 ${copied ? 'hidden' : ''}`} aria-hidden="true">
        <path fill="currentColor" d="M16 1H6a2 2 0 0 0-2 2v12h2V3h10V1zm3 4H10a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H10V7h9v14z"/>
      </svg>
      {/* 成功アイコン */}
      <svg viewBox="0 0 24 24" className={`w-3.5 h-3.5 shrink-0 text-blue-600 ${copied ? '' : 'hidden'}`} aria-hidden="true">
        <path fill="currentColor" d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"/>
      </svg>

      <span className="select-none">{copied ? 'コピーしました' : 'リンクをコピー'}</span>
    </button>
  );
}
