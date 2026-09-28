import { bacaBody, type KonteksId } from "@/lib/api/request";
import { respon, tangani } from "@/lib/api/respon";
import { resetPasswordPetugas } from "@/lib/services/petugas";

/** ADMIN — POST /api/petugas/pengguna/:id/password { password_baru, konfirmasi_password } */
export async function POST(request: Request, { params }: KonteksId) {
  return tangani(async () => {
    const { id } = await params;
    const body = await bacaBody(request);
    if (!body.ok) return respon(body);
    return respon(await resetPasswordPetugas({ ...body.data.isian, id }));
  });
}
