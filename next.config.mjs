/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // Remove the experimental section if it only contained appDir
    images: {
      domains: ['lh3.googleusercontent.com'],
    },
  }
  
  export default nextConfig;