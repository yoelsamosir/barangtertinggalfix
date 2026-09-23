import type { NextRequest } from "next/server";
import { queryParams } from "@/lib/api/request";
import { responData, tangani } from "@/lib/api/respon";
import { parseHalaman } from "@/lib/pagination";
import { daftarKlaim } from "@/lib/queries/klaim";
import { filterKlaimSchema } from "@/lib/validation/klaim";

/** PETUGAS — GET /api/petugas/klaim?status=&cari=&halaman= */
export async function GET(request: NextRequest) {
  return tangani(async () => {
    const q = queryParams(request);
    return responData(await daftarKlaim(filterKlaimSchema.parse(q), parseHalaman(q.halaman)));
  });
}
