import { bacaBody, type KonteksId } from "@/lib/api/request";
import { respon, tangani } from "@/lib/api/respon";
import { ubahStatusPetugas } from "@/lib/services/petugas";

/** ADMIN — POST /api/petugas/pengguna/:id/status { status: 'aktif'|'nonaktif' } */
export async function POST(request: Request, { params }: KonteksId) {
  return tangani(async () => {
    const { id } = await params;
    const body = await bacaBody(request);
    if (!body.ok) return respon(body);
    return respon(await ubahStatusPetugas({ ...body.data.isian, id }));
  });
}
