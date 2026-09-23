import "server-only";
import { headers } from "next/headers";

/**
 * IP pengunjung. Di Vercel, x-forwarded-for ditulis ulang oleh platform
 * sehingga bisa dipercaya; entri pertama adalah IP klien asli.
 */
export async function ipKlien(): Promise<string> {
  const h = await headers();
  const diteruskan = h.get("x-forwarded-for")?.split(",")[0]?.trim();
  return diteruskan || h.get("x-real-ip") || "tidak-diketahui";
}
