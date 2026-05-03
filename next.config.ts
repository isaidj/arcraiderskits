import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbopackUseSystemTlsCerts: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.arctracker.io",
        pathname: "/**",
      },
    ],
    formats: ["image/webp", "image/avif"],
  },
};

export default nextConfig;
