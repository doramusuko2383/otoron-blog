/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      { source: "/blog/posts/:path*", destination: "/posts/:path*" },
    ];
  },
};

module.exports = nextConfig;
