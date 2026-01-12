/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
      },
    ],
  },
  // Silence warnings about Sanity dependencies
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  transpilePackages: [
    "@research-homepage/ui",
    "@research-homepage/cms",
    "@research-homepage/components",
  ],
};

export default nextConfig;
