import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@hackerland/ui', '@hackerland/core', '@hackerland/db'],
};

export default nextConfig;
