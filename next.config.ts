import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: process.cwd(),
  images: { formats: ["image/avif", "image/webp"] },
};

export default nextConfig;
