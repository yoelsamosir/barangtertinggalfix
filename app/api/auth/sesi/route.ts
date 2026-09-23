import { respon, responData, tangani } from "@/lib/api/respon";
import { getPetugas } from "@/lib/auth";
import { gagal } from "@/lib/result";

/** GET /api/auth/sesi -> petugas yang sedang login, atau 401 */
export async function GET() {
  return tangani(async () => {
    const petugas = await getPetugas();
    return petugas ? responData(petugas) : respon(gagal("tidak_login", "Belum login."));
  });
}
