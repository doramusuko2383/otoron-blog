import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://otoron-blog.vercel.app"
  ),
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#60A5FA" },
    { media: "(prefers-color-scheme: dark)", color: "#111827" },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body className="bg-page">
        <header className="site-header sticky top-0 z-50 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b">
          <div className="container">
            <a className="brand link-plain" href="/">オトロン</a>
            <nav>
              <a href="/blog" className="link-plain">記事一覧</a>
              <a href="https://playotoron.com" className="link-plain">公式サイト</a>
            </nav>
          </div>
        </header>
        {children}

        <footer className="foot">
          <div className="container">© {new Date().getFullYear()} OTORON</div>
        </footer>
      </body>
    </html>
  );
}
