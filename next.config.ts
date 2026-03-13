import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    turbo: {},
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: '*.private.blob.vercel-storage.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
        port: '',
      },
    ],
  },
  redirects: async () => {
    return [
    ];
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "bcrypt": false,
      "fs": false,
      "net": false,
      "tls": false,
    };
    return config;
  },
};

export default nextConfig;