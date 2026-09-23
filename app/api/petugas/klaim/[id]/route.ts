import type { KonteksId } from "@/lib/api/request";
import { responDataAtau404, tangani } from "@/lib/api/respon";
import { getKlaim } from "@/lib/queries/klaim";

/** PETUGAS — GET /api/petugas/klaim/:id (klaim + data barang lengkap untuk verifikasi) */
export async function GET(_request: Request, { params }: KonteksId) {
  return tangani(async () => {
    const { id } = await params;
    return responDataAtau404(await getKlaim(id), "Klaim");
  });
}
