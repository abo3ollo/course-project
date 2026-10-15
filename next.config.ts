import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },

  // ✅ الـ rewrites في مكانها الصح
  async rewrites() {
    return [
      {
        source: "/api/backend/:path*",
        destination: "https://course-project-ten-gules.vercel.app/api/:path*",
      },
    ];
  },
};

export default nextConfig;