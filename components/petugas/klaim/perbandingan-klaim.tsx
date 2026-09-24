import { LockKeyhole, TriangleAlert } from "lucide-react";
import type { ReactNode } from "react";
import type { getKlaim } from "@/lib/queries/klaim";
import { formatTanggal } from "@/lib/utils/tanggal";

export type DetailKlaim = NonNullable<Awaited<ReturnType<typeof getKlaim>>>;

/**
 * Keterangan pengklaim berdampingan dengan data barang (termasuk deskripsi
 * internal) agar petugas mudah mencocokkan. Di HP kedua sisi ditumpuk per baris.
 */
export function PerbandinganKlaim({ klaim }: { klaim: DetailKlaim }) {
  const { barang } = klaim;
  // Tanggal "YYYY-MM-DD" bisa dibandingkan sebagai teks.
  const hilangSetelahDitemukan = klaim.waktu_kehilangan > barang.tanggal_ditemukan;

  return (
    <section aria-labelledby="judul-perbandingan" className="rounded-xl border border-garis bg-permukaan">
      <h2 id="judul-perbandingan" className="border-b border-garis px-5 py-4 font-semibold">
        Cocokkan keterangan
      </h2>

      {hilangSetelahDitemukan && (
        <p role="note" className="flex gap-2 border-b border-aksen bg-aksen-muda px-5 py-3 text-sm text-aksen-tua">
          <TriangleAlert aria-hidden className="size-5 shrink-0" />
          Tanggal hilang ({formatTanggal(klaim.waktu_kehilangan)}) setelah barang ditemukan (
          {formatTanggal(barang.tanggal_ditemukan)}) — periksa kembali.
        </p>
      )}

      <div className="hidden grid-cols-[8rem_1fr_1fr] gap-4 border-b border-garis bg-latar px-5 py-2 text-xs font-medium tracking-wide text-muted uppercase md:grid">
        <span />
        <span>Keterangan pengklaim</span>
        <span>Data barang (petugas)</span>
      </div>

      <dl className="divide-y divide-garis">
        <Baris
          label="Lokasi"
          pengklaim={klaim.lokasi_kehilangan}
          barang={barang.lokasi_ditemukan}
          keteranganPengklaim="terakhir digunakan"
          keteranganBarang="ditemukan"
        />
        <Baris
          label="Tanggal"
          pengklaim={formatTanggal(klaim.waktu_kehilangan)}
          barang={formatTanggal(barang.tanggal_ditemukan)}
          keteranganPengklaim="perkiraan hilang"
          keteranganBarang="ditemukan"
        />
        <Baris
          label="Ciri-ciri"
          pengklaim={klaim.ciri_barang}
          barang={
            <span className="block rounded-lg bg-aksen-muda/60 p-2">
              <span className="mb-1 flex items-center gap-1 text-xs font-medium text-aksen-tua">
                <LockKeyhole aria-hidden className="size-3.5" /> Deskripsi internal
              </span>
              {barang.deskripsi ?? <span className="text-muted">Belum diisi.</span>}
            </span>
          }
          keteranganPengklaim="menurut pengklaim"
          keteranganBarang={`${barang.nama_barang}${barang.warna ? `, ${barang.warna}` : ""}`}
        />
      </dl>
    </section>
  );
}

type BarisProps = {
  label: string;
  pengklaim: ReactNode;
  barang: ReactNode;
  keteranganPengklaim: string;
  keteranganBarang: string;
};

function Baris({ label, pengklaim, barang, keteranganPengklaim, keteranganBarang }: BarisProps) {
  return (
    <div className="grid gap-3 px-5 py-4 text-sm md:grid-cols-[8rem_1fr_1fr] md:gap-4">
      <dt className="font-semibold">{label}</dt>
      <dd className="whitespace-pre-line">
        <span className="mb-0.5 block text-xs text-muted">Pengklaim — {keteranganPengklaim}</span>
        {pengklaim}
      </dd>
      <dd className="whitespace-pre-line">
        <span className="mb-0.5 block text-xs text-muted">Barang — {keteranganBarang}</span>
        {barang}
      </dd>
    </div>
  );
}
