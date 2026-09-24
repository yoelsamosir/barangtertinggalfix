import type { NextRequest } from "next/server";
import { queryParams } from "@/lib/api/request";
import { tangani } from "@/lib/api/respon";
import { INSTANSI } from "@/lib/aplikasi";
import { KATEGORI_LABEL } from "@/lib/domain";
import { barisCsvLaporan, teksPeriode } from "@/lib/laporan";
import { laporanPerBulan, laporanRingkasan } from "@/lib/queries/laporan";
import { keCsv } from "@/lib/utils/csv";
import { filterLaporanSchema, filterPerBulanSchema } from "@/lib/validation/laporan";

/** PETUGAS — GET /api/petugas/laporan/unduh?dari=&sampai=&kategori=&lokasi=&tahun= (file CSV, bisa dibuka di Excel) */
export async function GET(request: NextRequest) {
  return tangani(async () => {
    const q = queryParams(request);
    const filter = filterLaporanSchema.parse(q);
    const { tahun } = filterPerBulanSchema.parse(q);

    const [ringkasan, perBulan] = await Promise.all([
      laporanRingkasan(filter),
      laporanPerBulan(tahun, filter.kategori),
    ]);

    const csv = keCsv(
      barisCsvLaporan(ringkasan, perBulan, {
        instansi: INSTANSI.nama,
        periode: teksPeriode(filter),
        kategori: filter.kategori ? KATEGORI_LABEL[filter.kategori] : "Semua kategori",
        lokasi: filter.lokasi ?? "Semua lokasi",
        tahun,
      }),
    );

    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="laporan-barang-tertinggal-${tahun}.csv"`,
        "Cache-Control": "private, no-store",
      },
    });
  });
}
