/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    experimental: {
      appDir: true,
    },
    // Ensure that Next.js can resolve URLs for images from the Google authentication provider
    images: {
      domains: ['lh3.googleusercontent.com'],
    },
  }
  
  export default nextConfig;