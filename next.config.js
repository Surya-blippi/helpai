/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['react-webcam'],
  images: {
    domains: ['localhost'],  // Add any other domains you need for Image component
  },
}

module.exports = nextConfig