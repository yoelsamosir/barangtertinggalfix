import type { NextRequest } from "next/server";
import { queryParams } from "@/lib/api/request";
import { responData, tangani } from "@/lib/api/respon";
import { parseHalaman } from "@/lib/pagination";
import { daftarPengembalian } from "@/lib/queries/pengembalian";
import { filterPengembalianSchema } from "@/lib/validation/pengembalian";

/** PETUGAS — GET /api/petugas/pengembalian?dari=&sampai=&halaman= */
export async function GET(request: NextRequest) {
  return tangani(async () => {
    const q = queryParams(request);
    return responData(await daftarPengembalian(filterPengembalianSchema.parse(q), parseHalaman(q.halaman)));
  });
}
