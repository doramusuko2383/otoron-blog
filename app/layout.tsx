import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  metadataBase: new URL("https://playotoron.com"),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <header className="site-header">
          <a className="brand" href="/">オトロン</a>
          <nav className="topnav">
            <a href="/blog">記事一覧</a>
            <a href="https://playotoron.com">公式サイト</a>
          </nav>
        </header>

        {children}

        <footer className="site-footer">© {new Date().getFullYear()} OTORON</footer>
      </body>
    </html>
  );
}
