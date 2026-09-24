import { PackageSearch } from "lucide-react";
import { FotoBarang } from "@/components/barang/foto-barang";
import { TabelData, type Kolom } from "@/components/ui/tabel-data";
import { KATEGORI_LABEL } from "@/lib/domain";
import type { daftarBarang } from "@/lib/queries/barang";
import { ROUTES } from "@/lib/routes";
import { formatTanggal } from "@/lib/utils/tanggal";
import { BadgeStatusBarang } from "./badge-status-barang";

export type BarisBarang = Awaited<ReturnType<typeof daftarBarang>>["barang"][number];

const KOLOM: Kolom<BarisBarang>[] = [
  {
    judul: "Foto",
    sembunyiDiHp: true,
    kelas: "w-16",
    isi: (b) => (
      <FotoBarang url={b.foto_url} nama={b.nama_barang} kategori={b.kategori} className="size-12 rounded-md" />
    ),
  },
  {
    judul: "Barang",
    utama: true,
    isi: (b) => (
      <>
        {b.nama_barang}
        <span className="block font-mono text-xs font-normal text-muted">{b.kode_barang}</span>
      </>
    ),
  },
  { judul: "Kategori", isi: (b) => KATEGORI_LABEL[b.kategori] },
  { judul: "Lokasi", isi: (b) => b.lokasi_ditemukan },
  { judul: "Ditemukan", isi: (b) => formatTanggal(b.tanggal_ditemukan), kelas: "whitespace-nowrap" },
  { judul: "Status", isi: (b) => <BadgeStatusBarang status={b.status} /> },
];

export function TabelBarang({ barang, adaFilter }: { barang: BarisBarang[]; adaFilter: boolean }) {
  return (
    <TabelData
      label="Daftar barang"
      kolom={KOLOM}
      data={barang}
      kunci={(b) => b.id}
      href={(b) => ROUTES.barangDetail(b.id)}
      kosong={
        <>
          <PackageSearch aria-hidden className="mx-auto size-10 text-muted" />
          <p className="mt-3 font-semibold">{adaFilter ? "Tidak ada barang yang cocok" : "Belum ada barang"}</p>
          <p className="mt-1 text-sm text-muted">
            {adaFilter ? "Ubah kata kunci atau filter." : "Barang yang dicatat akan tampil di sini."}
          </p>
        </>
      }
    />
  );
}
