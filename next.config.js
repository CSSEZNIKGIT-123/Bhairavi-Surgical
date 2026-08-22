/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'cdn.quicksell.co',
      },
      {
        protocol: 'https',
        hostname: 'd1h96izmtdkx5o.cloudfront.net',
      },
    ],
  },
};

module.exports = nextConfig;
