/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@research-homepage/ui",
    "@research-homepage/components",
    "@research-homepage/cms",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

export default nextConfig;
