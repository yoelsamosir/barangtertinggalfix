import { Download } from "lucide-react";
import type { Metadata } from "next";
import { FilterLaporanPetugas } from "@/components/petugas/laporan/filter-laporan";
import { GrafikBulanan } from "@/components/petugas/laporan/grafik-bulanan";
import { KopCetak } from "@/components/petugas/laporan/kop-cetak";
import { RingkasanLaporanPetugas } from "@/components/petugas/laporan/ringkasan-laporan";
import { TombolCetak } from "@/components/petugas/laporan/tombol-cetak";
import { KepalaHalaman } from "@/components/ui/kepala-halaman";
import { kelasTombol } from "@/components/ui/tombol";
import { KATEGORI_LABEL } from "@/lib/domain";
import { teksPeriode } from "@/lib/laporan";
import { laporanPerBulan, laporanRingkasan } from "@/lib/queries/laporan";
import { API, denganQuery, ROUTES } from "@/lib/routes";
import { tahunIniWIB } from "@/lib/utils/tanggal";
import { filterLaporanSchema, filterPerBulanSchema } from "@/lib/validation/laporan";

export const metadata: Metadata = { title: "Laporan" };

/** Pilihan tahun grafik: tahun ini dan 4 tahun sebelumnya. */
const JUMLAH_TAHUN = 5;

export default async function Laporan({ searchParams }: PageProps<"/dashboard/laporan">) {
  const params = await searchParams;
  const filter = filterLaporanSchema.parse(params);
  const { tahun } = filterPerBulanSchema.parse(params);

  const [ringkasan, perBulan] = await Promise.all([laporanRingkasan(filter), laporanPerBulan(tahun, filter.kategori)]);

  const semuaParam = { ...filter, tahun };
  const tahunIni = tahunIniWIB();
  const opsiTahun = Array.from({ length: JUMLAH_TAHUN }, (_, i) => String(tahunIni - i)).map((t) => ({
    nilai: t,
    label: t,
    href: denganQuery(ROUTES.laporan, { ...semuaParam, tahun: t }),
  }));

  const keterangan = [
    `Periode ditemukan: ${teksPeriode(filter)}`,
    `Kategori: ${filter.kategori ? KATEGORI_LABEL[filter.kategori] : "Semua kategori"}`,
    `Lokasi: ${filter.lokasi ?? "Semua lokasi"}`,
  ];

  return (
    <>
      <KopCetak keterangan={keterangan} />
      <KepalaHalaman
        judul="Laporan"
        aksi={
          <>
            <a href={denganQuery(API.unduhLaporan, semuaParam)} className={kelasTombol("kedua")} download>
              <Download aria-hidden className="size-4" /> Unduh CSV
            </a>
            <TombolCetak />
          </>
        }
      >
        <span className="print:hidden">{keterangan.join(" · ")}</span>
      </KepalaHalaman>

      <FilterLaporanPetugas filter={filter} tahun={tahun} />

      <div className="space-y-6">
        <RingkasanLaporanPetugas ringkasan={ringkasan} />
        <GrafikBulanan data={perBulan} tahun={tahun} opsiTahun={opsiTahun} />
      </div>
    </>
  );
}
