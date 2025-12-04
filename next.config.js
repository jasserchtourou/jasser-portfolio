/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['github.com', 'raw.githubusercontent.com', 'media.licdn.com', 'linkedin.com'],
    unoptimized: false,
  },
}

module.exports = nextConfig

