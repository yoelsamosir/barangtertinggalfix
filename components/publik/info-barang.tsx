import { FotoBarang } from "@/components/barang/foto-barang";
import { KATEGORI_LABEL } from "@/lib/domain";
import type { BarangPublik } from "@/lib/queries/publik";
import { formatTanggal } from "@/lib/utils/tanggal";
import { BadgeStatusPublik } from "./badge-status-publik";

/** Informasi lengkap barang untuk halaman detail — hanya kolom AMAN untuk publik (tanpa deskripsi internal). */
export function InfoBarang({ barang }: { barang: BarangPublik }) {
  const info = [
    ["Kategori", KATEGORI_LABEL[barang.kategori]],
    ["Warna", barang.warna ?? "—"],
    ["Lokasi ditemukan", barang.lokasi_ditemukan],
    ["Tanggal ditemukan", formatTanggal(barang.tanggal_ditemukan)],
  ] as const;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <FotoBarang
        url={barang.foto_url}
        nama={barang.nama_barang}
        kategori={barang.kategori}
        className="aspect-[4/3] w-full rounded-xl border border-garis"
      />
      <div>
        <BadgeStatusPublik status={barang.status_publik} />
        <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">{barang.nama_barang}</h1>
        <dl className="mt-6 divide-y divide-garis border-y border-garis">
          {info.map(([label, nilai]) => (
            <div key={label} className="grid grid-cols-[10rem_1fr] gap-3 py-3 text-sm">
              <dt className="text-muted">{label}</dt>
              <dd className="font-medium">{nilai}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
