import type { KonteksId } from "@/lib/api/request";
import { responDataAtau404, tangani } from "@/lib/api/respon";
import { getPengembalian } from "@/lib/queries/pengembalian";

/** PETUGAS — GET /api/petugas/pengembalian/:id (+ URL foto bukti berlaku 5 menit) */
export async function GET(_request: Request, { params }: KonteksId) {
  return tangani(async () => {
    const { id } = await params;
    return responDataAtau404(await getPengembalian(id), "Data pengembalian");
  });
}
