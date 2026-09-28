import { bacaBody } from "@/lib/api/request";
import { respon, responData, tangani } from "@/lib/api/respon";
import { daftarPetugas } from "@/lib/queries/petugas";
import { tambahPetugas } from "@/lib/services/petugas";

/** ADMIN — GET /api/petugas/pengguna -> semua akun petugas (nama, email, peran, status, login terakhir) */
export async function GET() {
  return tangani(async () => responData(await daftarPetugas()));
}

/** ADMIN — POST /api/petugas/pengguna { nama, email, password, peran? } -> 201 { id } */
export async function POST(request: Request) {
  return tangani(async () => {
    const body = await bacaBody(request);
    if (!body.ok) return respon(body);
    return respon(await tambahPetugas(body.data.isian), 201);
  });
}
