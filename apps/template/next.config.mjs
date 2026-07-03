/** @type {import('next').NextConfig} */

// Baseline security headers. SAMEORIGIN / frame-ancestors 'self' because the
// embedded Sanity Studio at /studio frames itself.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Content-Security-Policy",
    value: "frame-ancestors 'self'; object-src 'none'; base-uri 'self';",
  },
];

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
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
