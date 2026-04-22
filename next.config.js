/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.sharkninja.com',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig

