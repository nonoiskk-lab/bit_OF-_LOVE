import type { NextConfig } from "next";

/**
 * Baseline security headers for every response. A strict Content-Security-Policy
 * is intentionally not set yet — Framer Motion inline styles, the Google Maps
 * embed and Next's inline bootstrap scripts would need a nonce-based policy,
 * which should be added and tested on a preview deployment first.
 */
const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    // AVIF first (smallest), WebP fallback; the original file is kept untouched in /public.
    formats: ["image/avif", "image/webp"],
    // Next 16 requires an allowlist; 85 is used for menu photography (SmartImage).
    qualities: [75, 85],
    // Menu photos only change on deploy, so cache optimized variants for 30 days.
    minimumCacheTTL: 2592000,
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        // Customer contact details must never be cached by browsers or CDNs.
        source: "/api/:path*",
        headers: [{ key: "Cache-Control", value: "no-store" }],
      },
    ];
  },
};

export default nextConfig;
