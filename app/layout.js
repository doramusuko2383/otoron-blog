export const metadata = {
  title: "オトロンブログ",
  description: "絶対音感トレーニング『オトロン』の公式ブログ"
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body style={{ fontFamily: "system-ui, sans-serif", maxWidth: 880, margin: "0 auto", padding: 16 }}>
        <header style={{ padding: "16px 0" }}>
          <a href="/" style={{ textDecoration: "none", fontWeight: 700 }}>オトロン</a>
          <span style={{ marginLeft: 12, opacity: .7 }}> / ブログ</span>
        </header>
        {children}
        <footer style={{ marginTop: 32, padding: "16px 0", fontSize: 12, opacity: .7 }}>
          © {new Date().getFullYear()} OTORON
        </footer>
      </body>
    </html>
  );
}
