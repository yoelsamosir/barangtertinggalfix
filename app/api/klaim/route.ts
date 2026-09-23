import { bacaBody } from "@/lib/api/request";
import { respon, tangani } from "@/lib/api/respon";
import { ajukanKlaim } from "@/lib/services/klaim";

/** PUBLIK — POST /api/klaim (JSON, wajib captcha_token Turnstile) */
export async function POST(request: Request) {
  return tangani(async () => {
    const body = await bacaBody(request);
    if (!body.ok) return respon(body);
    return respon(await ajukanKlaim(body.data.isian), 201);
  });
}
