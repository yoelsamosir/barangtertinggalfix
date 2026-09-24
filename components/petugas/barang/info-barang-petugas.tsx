import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import { FotoBarang } from "@/components/barang/foto-barang";
import { KATEGORI_LABEL } from "@/lib/domain";
import type { getBarang } from "@/lib/queries/barang";
import { formatTanggal, formatWaktu } from "@/lib/utils/tanggal";
import { BadgeStatusBarang } from "./badge-status-barang";

export type DetailBarang = NonNullable<Awaited<ReturnType<typeof getBarang>>>;

/** Info lengkap barang untuk petugas, termasuk deskripsi internal & pencatat. */
export function InfoBarangPetugas({ barang }: { barang: DetailBarang }) {
  const info = [
    [
      "Kode",
      <span key="kode" className="font-mono">
        {barang.kode_barang}
      </span>,
    ],
    ["Kategori", KATEGORI_LABEL[barang.kategori]],
    ["Warna", barang.warna ?? "—"],
    ["Lokasi ditemukan", barang.lokasi_ditemukan],
    ["Tanggal ditemukan", formatTanggal(barang.tanggal_ditemukan)],
    ["Dicatat oleh", barang.pencatat?.nama ?? "—"],
    ["Dicatat pada", formatWaktu(barang.created_at)],
  ] as const;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
      <div className="space-y-2">
        <FotoBarang
          url={barang.foto_url}
          nama={barang.nama_barang}
          kategori={barang.kategori}
          className="aspect-[4/3] w-full rounded-xl border border-garis"
        />
        {barang.foto_url && (
          <p className="flex items-center gap-1.5 text-xs text-muted">
            {barang.tampilkan_foto ? (
              <>
                <Eye aria-hidden className="size-4" /> Foto tampil di halaman publik
              </>
            ) : (
              <>
                <EyeOff aria-hidden className="size-4" /> Foto hanya terlihat oleh petugas
              </>
            )}
          </p>
        )}
      </div>

      <div className="space-y-6">
        <div className="rounded-xl border border-garis bg-permukaan p-5">
          <BadgeStatusBarang status={barang.status} />
          <dl className="mt-4 divide-y divide-garis text-sm">
            {info.map(([label, nilai]) => (
              <div key={label} className="grid grid-cols-[9rem_1fr] gap-3 py-2.5">
                <dt className="text-muted">{label}</dt>
                <dd className="font-medium">{nilai}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="rounded-xl border border-aksen bg-aksen-muda/40 p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <LockKeyhole aria-hidden className="size-4 text-aksen-tua" />
            Deskripsi internal (tidak tampil ke publik)
          </h2>
          <p className="mt-2 text-sm whitespace-pre-line">
            {barang.deskripsi ?? <span className="text-muted">Belum diisi.</span>}
          </p>
        </div>
      </div>
    </div>
  );
}
