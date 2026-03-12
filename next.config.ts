import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow fetching from localhost (e.g. Storage emulator at :9199). Only use with emulators in dev.
    dangerouslyAllowLocalIP: process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === "true",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "9199",
        pathname: "/v0/b/**",
      },
    ],
  },
};

export default nextConfig;
