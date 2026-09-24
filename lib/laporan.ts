import type { laporanRingkasan } from "@/lib/queries/laporan";
import type { SelCsv } from "@/lib/utils/csv";
import { formatTanggal, namaBulan } from "@/lib/utils/tanggal";
import type { FilterLaporan } from "@/lib/validation/laporan";

/**
 * Istilah laporan yang dipakai bersama oleh halaman, versi cetak, dan unduhan CSV,
 * agar label & angka selalu sama di semua keluaran.
 */

export type RingkasanLaporan = Awaited<ReturnType<typeof laporanRingkasan>>;
type KunciRingkasan = keyof RingkasanLaporan;

export const BARIS_BARANG: [KunciRingkasan, string][] = [
  ["barang_ditemukan", "Barang ditemukan"],
  ["barang_tersimpan", "Masih tersimpan"],
  ["barang_diklaim", "Menunggu diambil pemilik"],
  ["barang_dikembalikan", "Sudah dikembalikan"],
];

export const BARIS_KLAIM: [KunciRingkasan, string][] = [
  ["klaim_masuk", "Klaim masuk"],
  ["klaim_menunggu", "Menunggu verifikasi"],
  ["klaim_disetujui", "Disetujui"],
  ["klaim_ditolak", "Ditolak"],
  ["klaim_selesai", "Selesai"],
];

/** Persentase barang yang sudah dikembalikan; null bila belum ada barang. */
export function persenDikembalikan(r: RingkasanLaporan): number | null {
  const ditemukan = Number(r.barang_ditemukan);
  return ditemukan > 0 ? Math.round((Number(r.barang_dikembalikan) / ditemukan) * 100) : null;
}

/** "1 Januari 2026 – 30 September 2026", "sejak …", "sampai …", atau "Semua waktu". */
export function teksPeriode({ dari, sampai }: Pick<FilterLaporan, "dari" | "sampai">): string {
  if (dari && sampai) return `${formatTanggal(dari)} – ${formatTanggal(sampai)}`;
  if (dari) return `Sejak ${formatTanggal(dari)}`;
  if (sampai) return `Sampai ${formatTanggal(sampai)}`;
  return "Semua waktu";
}

type BarisBulan = { bulan: number; ditemukan: number; dikembalikan: number };

/** Isi CSV laporan: identitas & filter, ringkasan, lalu rincian per bulan. */
export function barisCsvLaporan(
  ringkasan: RingkasanLaporan,
  perBulan: BarisBulan[],
  keterangan: { instansi: string; periode: string; kategori: string; lokasi: string; tahun: number },
): SelCsv[][] {
  const persen = persenDikembalikan(ringkasan);
  return [
    ["Laporan Barang Tertinggal", keterangan.instansi],
    ["Periode ditemukan", keterangan.periode],
    ["Kategori", keterangan.kategori],
    ["Lokasi", keterangan.lokasi],
    [],
    ["Ringkasan", "Jumlah"],
    ...[...BARIS_BARANG, ...BARIS_KLAIM].map(([kunci, label]): SelCsv[] => [label, Number(ringkasan[kunci])]),
    ["Berhasil dikembalikan (%)", persen],
    [],
    [
      `Per bulan tahun ${keterangan.tahun} (hanya filter kategori; periode & lokasi tidak berlaku)`,
      "Ditemukan",
      "Dikembalikan",
    ],
    ...perBulan.map((b): SelCsv[] => [namaBulan(b.bulan), Number(b.ditemukan), Number(b.dikembalikan)]),
  ];
}
