import { bacaBody } from "@/lib/api/request";
import { respon, tangani } from "@/lib/api/respon";
import { ubahProfil } from "@/lib/services/akun";

/** PETUGAS — PATCH /api/petugas/akun/profil { nama } */
export async function PATCH(request: Request) {
  return tangani(async () => {
    const body = await bacaBody(request);
    if (!body.ok) return respon(body);
    return respon(await ubahProfil(body.data.isian));
  });
}
