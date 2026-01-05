import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow images from any external source since users can paste arbitrary URLs
    // Note: In production, consider using a proxy service or restricting to specific domains
    // for better security and control over image sources
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
