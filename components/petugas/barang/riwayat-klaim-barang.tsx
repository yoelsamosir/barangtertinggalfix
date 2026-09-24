import Link from "next/link";
import { ROUTES } from "@/lib/routes";
import { formatWaktu } from "@/lib/utils/tanggal";
import { BadgeStatusKlaim } from "../klaim/badge-status-klaim";
import type { DetailBarang } from "./info-barang-petugas";

/** Semua klaim yang pernah diajukan atas satu barang, terbaru di atas. */
export function RiwayatKlaimBarang({ klaim }: { klaim: DetailBarang["klaim"] }) {
  return (
    <section aria-labelledby="judul-riwayat-klaim" className="rounded-xl border border-garis bg-permukaan p-5">
      <h2 id="judul-riwayat-klaim" className="font-semibold">
        Riwayat klaim <span className="font-normal text-muted">({klaim.length})</span>
      </h2>
      {klaim.length === 0 ? (
        <p className="mt-2 text-sm text-muted">Belum ada yang mengajukan klaim atas barang ini.</p>
      ) : (
        <ul className="mt-3 divide-y divide-garis">
          {klaim.map((k) => (
            <li key={k.id} className="relative flex flex-wrap items-center justify-between gap-2 py-3">
              <div className="min-w-0">
                <Link
                  href={ROUTES.klaimDetail(k.id)}
                  className="font-mono text-sm font-semibold after:absolute after:inset-0 hover:text-brand hover:underline"
                >
                  {k.nomor_klaim}
                </Link>
                <p className="text-sm">{k.nama_pengklaim}</p>
                <p className="text-xs text-muted">{formatWaktu(k.created_at)}</p>
              </div>
              <BadgeStatusKlaim status={k.status} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
