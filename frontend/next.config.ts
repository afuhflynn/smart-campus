import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  devIndicators: false, // @todo: Remove this after the presentation
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.dicebear.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
