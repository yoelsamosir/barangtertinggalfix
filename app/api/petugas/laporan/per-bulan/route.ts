import type { NextRequest } from "next/server";
import { queryParams } from "@/lib/api/request";
import { responData, tangani } from "@/lib/api/respon";
import { laporanPerBulan } from "@/lib/queries/laporan";
import { filterPerBulanSchema } from "@/lib/validation/laporan";

/** PETUGAS — GET /api/petugas/laporan/per-bulan?tahun=&kategori= (12 baris, untuk grafik) */
export async function GET(request: NextRequest) {
  return tangani(async () => {
    const { tahun, kategori } = filterPerBulanSchema.parse(queryParams(request));
    return responData(await laporanPerBulan(tahun, kategori));
  });
}
