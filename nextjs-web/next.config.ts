import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co', // Allow all Supabase projects
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // Allow Unsplash placeholders
      },
      {
        protocol: 'https',
        hostname: '**.kiriengine.app', // Allow Kiri Engine direct links
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com', // Allow Google Storage (Kiri/Blender)
      }
    ],
  },
};

export default nextConfig;
