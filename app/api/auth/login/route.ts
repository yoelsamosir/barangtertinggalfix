import { bacaBody } from "@/lib/api/request";
import { respon, tangani } from "@/lib/api/respon";
import { login } from "@/lib/services/auth";

/** POST /api/auth/login { email, password, captcha_token } -> set cookie sesi */
export async function POST(request: Request) {
  return tangani(async () => {
    const body = await bacaBody(request);
    if (!body.ok) return respon(body);
    return respon(await login(body.data.isian));
  });
}
