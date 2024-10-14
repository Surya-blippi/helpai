/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'vercel.app'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig