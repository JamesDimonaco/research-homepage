/** @type {import('next').NextConfig} */

// Baseline security headers. X-Frame-Options is SAMEORIGIN (not DENY) because
// the embedded Sanity Studio at /studio frames itself; frame-ancestors 'self'
// gives the modern equivalent. No full CSP script-src here — a broken CSP would
// silently break Studio/Next inline scripts; clickjacking + sniffing are the
// concrete wins.
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
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
  transpilePackages: ['@sanity/ui', '@sanity/icons'],
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
