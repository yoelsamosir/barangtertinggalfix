import { FotoBarang } from "@/components/barang/foto-barang";
import { KATEGORI_LABEL } from "@/lib/domain";
import type { BarangPublik } from "@/lib/queries/publik";
import { formatTanggal } from "@/lib/utils/tanggal";

/** Ringkasan barang (foto kecil + info singkat) di atas form klaim. */
export function RingkasanBarang({ barang }: { barang: BarangPublik }) {
  return (
    <div className="flex gap-4 rounded-xl border border-garis bg-permukaan p-3">
      <FotoBarang
        url={barang.foto_url}
        nama={barang.nama_barang}
        kategori={barang.kategori}
        className="size-20 shrink-0 rounded-lg"
      />
      <div className="min-w-0 text-sm">
        <p className="font-semibold">{barang.nama_barang}</p>
        <p className="text-muted">
          {KATEGORI_LABEL[barang.kategori]} · {barang.lokasi_ditemukan}
        </p>
        <p className="text-muted">Ditemukan {formatTanggal(barang.tanggal_ditemukan)}</p>
      </div>
    </div>
  );
}
