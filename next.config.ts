import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

// Next injects inline bootstrap scripts and Tailwind emits inline styles, so
// 'unsafe-inline' is required for those two directives. Dev additionally needs
// 'unsafe-eval' and a websocket origin for react-refresh / HMR.
const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "img-src 'self' data: blob: https://*.supabase.co",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data:",
  `connect-src 'self' https://*.supabase.co${isDev ? " ws: http://localhost:*" : ""}`,
  // The contact page embeds a Google Maps iframe.
  "frame-src https://www.google.com https://maps.google.com",
  "worker-src 'self' blob:",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  images: {
    // This dev machine is on a NAT64 network, so the image optimizer sees the
    // NAT64-mapped upstream IPs as "private" and refuses to fetch remote images.
    // Serve originals directly in dev; keep full optimization in production.
    unoptimized: isDev,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'paifcnthsfxutublwcja.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        // Keep the admin surface out of search indexes and shared caches.
        source: "/admin/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Cache-Control", value: "no-store" },
        ],
      },
    ];
  },
};

export default nextConfig;
