/** @type {import('next').NextConfig} */

// Marketing page — no Studio, nothing needs to frame it, so deny framing outright.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Content-Security-Policy",
    value: "frame-ancestors 'none'; object-src 'none'; base-uri 'self';",
  },
];

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
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
