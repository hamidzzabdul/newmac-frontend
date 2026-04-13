import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000", // specify the port of your backend
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
