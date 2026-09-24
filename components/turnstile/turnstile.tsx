import { headers } from "next/headers";
import { TurnstileWidget } from "./turnstile-widget";

/**
 * Captcha Cloudflare Turnstile untuk form (klaim publik & login).
 * Komponen server: membaca nonce CSP dari header `x-nonce` (dipasang proxy.ts)
 * agar script Turnstile diizinkan CSP. Token masuk ke field `cf-turnstile-response`.
 */
export async function Turnstile() {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  if (!siteKey) throw new Error("NEXT_PUBLIC_TURNSTILE_SITE_KEY belum diisi. Salin .env.example ke .env.local.");

  const nonce = (await headers()).get("x-nonce") ?? undefined;
  return <TurnstileWidget siteKey={siteKey} nonce={nonce} />;
}
