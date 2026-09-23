import type { NextRequest } from "next/server";
import { queryParams } from "@/lib/api/request";
import { responData, tangani } from "@/lib/api/respon";
import { laporanRingkasan } from "@/lib/queries/laporan";
import { filterLaporanSchema } from "@/lib/validation/laporan";

/** PETUGAS — GET /api/petugas/laporan?dari=&sampai=&kategori=&lokasi= */
export async function GET(request: NextRequest) {
  return tangani(async () => responData(await laporanRingkasan(filterLaporanSchema.parse(queryParams(request)))));
}
