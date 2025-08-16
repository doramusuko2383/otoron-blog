export default function robots() {
  const BASE = "https://playotoron.com";
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${BASE}/sitemap.xml`,
  };
}
