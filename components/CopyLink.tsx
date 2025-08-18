'use client';
import { useState } from 'react';

export default function CopyLink({ url, className = '' }: { url: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  async function doCopy() {
    const text = String(url || '');
    try {
      // 1) 標準 API
      await navigator.clipboard.writeText(text);
      done();
    } catch {
      // 2) フォールバック（セキュアコンテキスト外や権限NGでも動く）
      try {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.top = '-1000px';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        done();
      } catch {
        // 最後の保険（明示フィードバック）
        window.prompt('リンクをコピーできませんでした。下のテキストをコピーしてください。', text);
      }
    }
  }

  function done() {
    setCopied(true);
    const t = setTimeout(() => setCopied(false), 1500);
    // GC されにくいケース用
    return () => clearTimeout(t);
  }

  return (
    <button
      type="button"
      onClick={doCopy}
      aria-live="polite"
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition
                  border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-300 active:translate-y-[1px]
                  focus:outline-none focus:ring-2 focus:ring-blue-300/60 ${className}`}
    >
      {/* コピー前アイコン */}
      <svg
        viewBox="0 0 24 24"
        className={`h-3.5 w-3.5 ${copied ? 'hidden' : ''}`}
        aria-hidden="true"
      >
        <path fill="currentColor" d="M16 1H6a2 2 0 0 0-2 2v12h2V3h10V1zm3 4H10a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H10V7h9v14z"/>
      </svg>
      {/* 成功アイコン */}
      <svg
        viewBox="0 0 24 24"
        className={`h-3.5 w-3.5 text-blue-600 ${copied ? '' : 'hidden'}`}
        aria-hidden="true"
      >
        <path fill="currentColor" d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"/>
      </svg>

      <span>{copied ? 'コピーしました' : 'リンクをコピー'}</span>
    </button>
  );
}

