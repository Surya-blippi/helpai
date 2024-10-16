/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ['openai'],
  },
  serverRuntimeConfig: {
    // Will only be available on the server side
    timeoutSeconds: 60, // Increase this value as needed
  },
};

module.exports = nextConfig;