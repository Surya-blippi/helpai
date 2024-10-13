/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['react-webcam'],
  images: {
    domains: ['localhost', 'vercel.app'],
  },
}

module.exports = nextConfig