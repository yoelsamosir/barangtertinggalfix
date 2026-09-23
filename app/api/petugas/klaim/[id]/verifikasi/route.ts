import { bacaBody, type KonteksId } from "@/lib/api/request";
import { respon, tangani } from "@/lib/api/respon";
import { verifikasiKlaim } from "@/lib/services/klaim";

/** PETUGAS — POST /api/petugas/klaim/:id/verifikasi { keputusan: 'setujui'|'tolak', catatan } */
export async function POST(request: Request, { params }: KonteksId) {
  return tangani(async () => {
    const { id } = await params;
    const body = await bacaBody(request);
    if (!body.ok) return respon(body);
    return respon(await verifikasiKlaim({ ...body.data.isian, claim_id: id }));
  });
}
