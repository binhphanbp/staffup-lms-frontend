import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: 'https://api.staffup.site/api/v1/:path*',
      },
    ];
  },
};

export default nextConfig;
