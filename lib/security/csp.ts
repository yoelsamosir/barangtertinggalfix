import { SUPABASE_URL } from "@/lib/supabase/env";

/**
 * Content-Security-Policy berbasis nonce (dibuat baru setiap request di proxy).
 * Hanya script ber-nonce yang boleh jalan -> membatasi dampak XSS.
 */

const TURNSTILE = "https://challenges.cloudflare.com";

export function buatNonce(): string {
  return btoa(crypto.randomUUID());
}

export function buatCsp(nonce: string): string {
  const dev = process.env.NODE_ENV === "development";

  return [
    `default-src 'self'`,
    // 'unsafe-eval' hanya untuk debugging React saat development
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' ${TURNSTILE}${dev ? " 'unsafe-eval'" : ""}`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' blob: data: ${SUPABASE_URL}`,
    `font-src 'self'`,
    `connect-src 'self' ${SUPABASE_URL}`,
    `frame-src ${TURNSTILE}`,
    `media-src 'self' blob:`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `frame-ancestors 'none'`,
    ...(dev ? [] : ["upgrade-insecure-requests"]),
  ].join("; ");
}
