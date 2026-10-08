import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // The admin page editor shows the site in a same-origin preview frame.
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [70, 75, 85],
    // Uploaded files never change (their names carry a random suffix), so
    // optimized variants can be kept for a month.
    minimumCacheTTL: 2678400,
    // YouTube thumbnails for the video sections.
    remotePatterns: [{ protocol: "https", hostname: "i.ytimg.com", pathname: "/vi/**" }],
  },
  experimental: {
    serverActions: {
      // Page-editor saves send JSON; photos go through /api/admin/upload.
      bodySizeLimit: "4mb",
    },
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    return [{ source: "/admin/teks", destination: "/admin/halaman", permanent: false }];
  },
};

export default nextConfig;
