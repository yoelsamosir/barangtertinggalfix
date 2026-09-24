import Link from "next/link";
import type { klaimLainAtasBarang } from "@/lib/queries/klaim";
import { ROUTES } from "@/lib/routes";
import { formatWaktu } from "@/lib/utils/tanggal";
import { BadgeStatusKlaim } from "./badge-status-klaim";

type KlaimLain = Awaited<ReturnType<typeof klaimLainAtasBarang>>[number];

/** Klaim lain atas barang yang sama. Yang masih menunggu akan ditolak otomatis saat serah terima. */
export function DaftarKlaimLain({ klaim }: { klaim: KlaimLain[] }) {
  if (klaim.length === 0) return null;
  const menunggu = klaim.filter((k) => k.status === "menunggu").length;

  return (
    <section aria-labelledby="judul-klaim-lain" className="rounded-xl border border-garis bg-permukaan p-5">
      <h2 id="judul-klaim-lain" className="font-semibold">
        Klaim lain atas barang ini <span className="font-normal text-muted">({klaim.length})</span>
      </h2>
      {menunggu > 0 && (
        <p className="mt-1 text-xs text-muted">
          {menunggu} klaim masih menunggu dan akan ditolak otomatis bila barang diserahkan ke pengklaim lain.
        </p>
      )}
      <ul className="mt-3 divide-y divide-garis">
        {klaim.map((k) => (
          <li key={k.id} className="relative flex items-center justify-between gap-2 py-2.5">
            <div className="min-w-0 text-sm">
              <Link
                href={ROUTES.klaimDetail(k.id)}
                className="font-mono font-semibold after:absolute after:inset-0 hover:text-brand hover:underline"
              >
                {k.nomor_klaim}
              </Link>
              <p className="truncate">{k.nama_pengklaim}</p>
              <p className="text-xs text-muted">{formatWaktu(k.created_at)}</p>
            </div>
            <BadgeStatusKlaim status={k.status} />
          </li>
        ))}
      </ul>
    </section>
  );
}
