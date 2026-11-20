import type { NextConfig } from "next";

// Static export (D-11): `next build` writes the whole site to out/. No server code.
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
