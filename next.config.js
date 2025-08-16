/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
     { source: "/blog", destination: "/" },
     { source: "/blog/:path*", destination: "/:path*" },
    ];
  },
};

module.exports = nextConfig;
