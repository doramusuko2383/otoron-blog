import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  metadataBase: new URL("https://playotoron.com"),
  themeColor: "#6c46ff",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <header className="mast">
          <div className="container">
            <a className="brand" href="/">オトロン</a>
            <nav>
              <a href="/blog">記事一覧</a>
              <a href="https://playotoron.com">公式サイト</a>
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
