/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ['openai'],
  },
  serverRuntimeConfig: {
    timeoutSeconds: 60, // Increase this value as needed
  },
};

module.exports = nextConfig;