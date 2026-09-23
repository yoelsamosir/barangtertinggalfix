import type { NextRequest } from "next/server";
import { queryParams } from "@/lib/api/request";
import { responData, tangani } from "@/lib/api/respon";
import { parseHalaman } from "@/lib/pagination";
import { cariBarangPublik } from "@/lib/queries/publik";
import { filterBarangPublikSchema } from "@/lib/validation/barang";

/** PUBLIK — GET /api/barang?cari=&kategori=&halaman= */
export async function GET(request: NextRequest) {
  return tangani(async () => {
    const q = queryParams(request);
    return responData(await cariBarangPublik(filterBarangPublikSchema.parse(q), parseHalaman(q.halaman)));
  });
}
