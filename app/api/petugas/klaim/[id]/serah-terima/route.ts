import { bacaBody, type KonteksId } from "@/lib/api/request";
import { respon, tangani } from "@/lib/api/respon";
import { serahTerima } from "@/lib/services/pengembalian";

/** PETUGAS — POST /api/petugas/klaim/:id/serah-terima (multipart: foto, persetujuan_foto, catatan) */
export async function POST(request: Request, { params }: KonteksId) {
  return tangani(async () => {
    const { id } = await params;
    const body = await bacaBody(request);
    if (!body.ok) return respon(body);
    return respon(await serahTerima({ ...body.data.isian, claim_id: id }, body.data.file("foto")), 201);
  });
}
