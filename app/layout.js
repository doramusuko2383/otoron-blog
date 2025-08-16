import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://otoron-blog.vercel.app"),
  title: "オトロン公式ブログ",
  description: "絶対音感トレーニング『オトロン』の公式ブログ。",
  openGraph: {
    title: "オトロン公式ブログ",
    description: "絶対音感トレーニング『オトロン』の公式ブログ。",
    url: "https://playotoron.com/blog",
    siteName: "OTORON",
    images: [{ url: "/ogp.png", width: 1200, height: 630 }],
    locale: "ja_JP",
    type: "website"
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "https://playotoron.com/blog" },
  other: {
    "link:alternate:rss": [
      {
        rel: "alternate",
        type: "application/rss+xml",
        title: "オトロン公式ブログ",
        href: "https://playotoron.com/blog/rss"
      }
    ]
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>
        <header className="container" style={{display:"flex",gap:12,alignItems:"center"}}>
          <a href="/blog" style={{fontWeight:900,fontSize:18,color:"var(--brand)"}}>オトロン</a>
          <span className="sub">/ ブログ</span>
          <nav style={{marginLeft:"auto",display:"flex",gap:16}}>
            <a href="/blog">記事一覧</a>
            <a href="https://playotoron.com" target="_blank" rel="noreferrer">公式サイト</a>
          </nav>
        </header>
        <main className="container">{children}</main>
        <footer className="container" style={{opacity:.7,fontSize:12,marginTop:24}}>
          © {new Date().getFullYear()} OTORON
        </footer>
      </body>
    </html>
  );
}
