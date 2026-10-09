/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: '/universe', destination: '/', permanent: true },
      { source: '/landing', destination: '/', permanent: true },
    ];
  },
};

module.exports = nextConfig;
