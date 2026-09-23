import type { KonteksId } from "@/lib/api/request";
import { responDataAtau404, tangani } from "@/lib/api/respon";
import { getBarangPublik } from "@/lib/queries/publik";

/** PUBLIK — GET /api/barang/:id (kolom aman saja) */
export async function GET(_request: Request, { params }: KonteksId) {
  return tangani(async () => {
    const { id } = await params;
    return responDataAtau404(await getBarangPublik(id), "Barang");
  });
}
