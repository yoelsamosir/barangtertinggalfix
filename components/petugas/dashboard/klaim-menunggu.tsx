import { CircleCheck } from "lucide-react";
import Link from "next/link";
import type { klaimMenungguTerbaru } from "@/lib/queries/dashboard";
import { denganQuery, ROUTES } from "@/lib/routes";
import { formatWaktu } from "@/lib/utils/tanggal";

type Klaim = Awaited<ReturnType<typeof klaimMenungguTerbaru>>[number];

/** Klaim terbaru yang belum diverifikasi — pekerjaan utama petugas. */
export function KlaimMenunggu({ klaim }: { klaim: Klaim[] }) {
  return (
    <section aria-labelledby="judul-klaim-menunggu" className="rounded-xl border border-garis bg-permukaan">
      <div className="flex items-center justify-between gap-3 border-b border-garis px-5 py-4">
        <h2 id="judul-klaim-menunggu" className="font-semibold">
          Klaim terbaru menunggu verifikasi
        </h2>
        <Link
          href={denganQuery(ROUTES.klaim, { status: "menunggu" })}
          className="shrink-0 text-sm font-medium text-brand hover:underline"
        >
          Lihat semua
        </Link>
      </div>

      {klaim.length === 0 ? (
        <p className="flex items-center gap-2 px-5 py-6 text-sm text-muted">
          <CircleCheck aria-hidden className="size-5 text-sukses" />
          Tidak ada klaim yang menunggu. Semua sudah ditangani.
        </p>
      ) : (
        <ul className="divide-y divide-garis">
          {klaim.map((k) => (
            <li key={k.id} className="relative px-5 py-3 hover:bg-latar/60">
              <Link
                href={ROUTES.klaimDetail(k.id)}
                className="font-mono text-sm font-semibold after:absolute after:inset-0 hover:text-brand"
              >
                {k.nomor_klaim}
              </Link>
              <p className="text-sm">
                {k.nama_pengklaim}
                {k.barang && <span className="text-muted"> — {k.barang.nama_barang}</span>}
              </p>
              <p className="text-xs text-muted">{formatWaktu(k.created_at)}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
