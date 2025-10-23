/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['www.bbc.com', 'reuters.com', 'techcrunch.com', 'images.unsplash.com'],
    unoptimized: true
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/:path*'
      }
    ]
  }
}

module.exports = nextConfig