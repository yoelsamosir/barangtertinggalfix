import type { NextConfig } from "next";

/** Header keamanan yang sama untuk semua response. CSP (ber-nonce) dipasang di proxy.ts. */
const HEADER_KEAMANAN = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Kamera hanya untuk situs ini (foto serah terima); fitur lain dimatikan.
  { key: "Permissions-Policy", value: "camera=(self), microphone=(), geolocation=(), payment=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: HEADER_KEAMANAN }];
  },
  experimental: {
    serverActions: {
      // Foto maks 4 MB + field form lain. Sama dengan MAKS_BODY_REQUEST
      // di lib/config.ts (batas body request fungsi Vercel adalah 4,5 MB).
      bodySizeLimit: "4.5mb",
    },
  },
};

export default nextConfig;
