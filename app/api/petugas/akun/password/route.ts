import { bacaBody } from "@/lib/api/request";
import { respon, tangani } from "@/lib/api/respon";
import { gantiPassword } from "@/lib/services/akun";

/** PETUGAS — POST /api/petugas/akun/password { password_lama, password_baru, konfirmasi_password } */
export async function POST(request: Request) {
  return tangani(async () => {
    const body = await bacaBody(request);
    if (!body.ok) return respon(body);
    return respon(await gantiPassword(body.data.isian));
  });
}
