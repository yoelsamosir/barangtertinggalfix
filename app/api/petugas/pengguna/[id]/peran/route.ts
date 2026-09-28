import { bacaBody, type KonteksId } from "@/lib/api/request";
import { respon, tangani } from "@/lib/api/respon";
import { aturPeranPetugas } from "@/lib/services/petugas";

/** ADMIN — POST /api/petugas/pengguna/:id/peran { peran: 'petugas'|'admin' } */
export async function POST(request: Request, { params }: KonteksId) {
  return tangani(async () => {
    const { id } = await params;
    const body = await bacaBody(request);
    if (!body.ok) return respon(body);
    return respon(await aturPeranPetugas({ ...body.data.isian, id }));
  });
}
