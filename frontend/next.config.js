/** @type {import('next').NextConfig} */
const nextConfig = {
  // App directory is now stable in Next.js 14
  // experimental: {
  //   appDir: true,
  // },
  async rewrites() {
    return [
      {
        // Only forward non-chat API routes to Flask backend
        source: '/api/((?!chat).*)',
        destination: 'http://localhost:5000/api/:path*',
      },
    ]
  },
}

module.exports = nextConfig