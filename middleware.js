import { NextResponse } from "next/server";
import redirects from "./posts/_redirects.json" assert { type: "json" };
import deleted from "./posts/_deleted.json" assert { type: "json" };

export function middleware(req) {
  const url = req.nextUrl.clone();
  if (!url.pathname.startsWith("/blog/posts/")) return NextResponse.next();
  const slug = url.pathname.replace("/blog/posts/", "").replace(/\/$/, "");
  const r = redirects.find(r => r.from === slug);
  if (r) {
    url.pathname = `/blog/posts/${r.to}`;
    return NextResponse.redirect(url, 301);
  }
  if (deleted.includes(slug)) {
    return new NextResponse("Gone", { status: 410 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/blog/posts/:path*"
};
