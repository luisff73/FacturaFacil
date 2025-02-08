import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    turbo: {},
  },
  redirects: async () => {
    return [
      {
        source: '/dashboard/users',
        destination: '/dashboard',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;