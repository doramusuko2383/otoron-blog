'use client';
import { useState } from 'react';

export default function CopyLink({ url }: { url: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(url);
          setOk(true);
          setTimeout(() => setOk(false), 1500);
        } catch {}
      }}
      className="rounded-full border px-3 py-1 text-xs text-gray-600 hover:bg-gray-50"
      aria-label="記事URLをコピー"
    >
      {ok ? 'コピーしました' : 'リンクをコピー'}
    </button>
  );
}
