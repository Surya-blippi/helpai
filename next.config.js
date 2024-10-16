/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  api: {
    bodyParser: {
      sizeLimit: '4mb',
    },
    responseLimit: false,
  },
  experimental: {
    serverComponentsExternalPackages: ['openai'],
  },
};

module.exports = nextConfig;