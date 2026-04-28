import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Exclude canvas (optional pdfjs-dist dependency) from server/client bundling
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
  experimental: {
    turbopack: {},
  },
};

export default nextConfig;
