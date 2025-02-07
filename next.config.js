/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true
  },
  // Ensure we can deploy to Vercel
  experimental: {
    appDir: true
  }
}

module.exports = nextConfig 