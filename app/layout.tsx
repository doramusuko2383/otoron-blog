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
      <body>
        <header className="site-header">
          <div className="container">
            <a className="brand link-plain" href="/">オトロン</a>
            <nav>
              <a href="/blog" className="link-plain">記事一覧</a>
              <a href="https://playotoron.com" className="link-plain">公式サイト</a>
            </nav>
          </div>
        </header>

        <main className="container">{children}</main>

        <footer className="foot">
          <div className="container">© {new Date().getFullYear()} OTORON</div>
        </footer>
      </body>
    </html>
  );
}
