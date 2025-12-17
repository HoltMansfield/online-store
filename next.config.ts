import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverSourceMaps: true,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "img-src * data:",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.sanity.io https://*.sanity.io https://core.sanity-cdn.com",
              "style-src 'self' 'unsafe-inline' https://cdn.sanity.io",
              "font-src 'self' data: https://fonts.gstatic.com",
              "connect-src * https://cdn.sanity.io https://*.sanity.io https://*.apicdn.sanity.io",
              "worker-src 'self' blob: data:",
              "frame-src 'self' https://cdn.sanity.io",
            ].join("; "),
          },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
