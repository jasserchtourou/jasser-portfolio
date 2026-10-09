/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: '/universe', destination: '/', permanent: true },
      { source: '/landing', destination: '/', permanent: true },
      { source: '/about', destination: '/#about', permanent: true },
      { source: '/skills', destination: '/#skills', permanent: true },
    ];
  },
};

module.exports = nextConfig;
