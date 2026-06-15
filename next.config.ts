import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/ai-exploration",
  images: { unoptimized: true },
};

export default nextConfig;
