import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "31.97.223.209",
        port: "5000", // specify the port of your backend
        pathname: "/api/v1/uploads/**",
      },
    ],
  },
};

export default nextConfig;
