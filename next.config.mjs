/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ hostname: "cdn.sanity.io" }],
  },
  transpilePackages: ['@sanity/ui', '@sanity/icons'],
};

export default nextConfig;
