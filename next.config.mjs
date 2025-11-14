/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },
  eslint: {
    dirs: ['app', 'components', 'lib', 'tests'],
  },
};

export default nextConfig;
