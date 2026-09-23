import { bacaBody, type KonteksId } from "@/lib/api/request";
import { respon, responDataAtau404, tangani } from "@/lib/api/respon";
import { getBarang } from "@/lib/queries/barang";
import { hapusBarang, ubahBarang } from "@/lib/services/barang";

/** PETUGAS — GET /api/petugas/barang/:id (lengkap + riwayat klaim) */
export async function GET(_request: Request, { params }: KonteksId) {
  return tangani(async () => {
    const { id } = await params;
    return responDataAtau404(await getBarang(id), "Barang");
  });
}

/** PETUGAS — PATCH /api/petugas/barang/:id (multipart: field barang, foto opsional, hapus_foto) */
export async function PATCH(request: Request, { params }: KonteksId) {
  return tangani(async () => {
    const { id } = await params;
    const body = await bacaBody(request);
    if (!body.ok) return respon(body);
    return respon(await ubahBarang({ ...body.data.isian, id }, body.data.file("foto")));
  });
}

/** PETUGAS — DELETE /api/petugas/barang/:id (hanya 'tersimpan' & belum diklaim) */
export async function DELETE(_request: Request, { params }: KonteksId) {
  return tangani(async () => {
    const { id } = await params;
    return respon(await hapusBarang({ id }));
  });
}
