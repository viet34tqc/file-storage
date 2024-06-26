/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        hostname: 'sleek-deer-96.convex.cloud',
      },
    ],
  },
}

export default nextConfig;
