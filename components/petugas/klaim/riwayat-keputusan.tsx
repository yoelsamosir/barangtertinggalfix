import Link from "next/link";
import { ROUTES } from "@/lib/routes";
import { formatWaktu } from "@/lib/utils/tanggal";
import type { DetailKlaim } from "./perbandingan-klaim";

/** Siapa yang memutuskan, kapan, dan catatannya. Kosong selama klaim masih menunggu. */
export function RiwayatKeputusan({ klaim }: { klaim: DetailKlaim }) {
  if (klaim.status === "menunggu" || !klaim.diverifikasi_pada) return null;

  return (
    <section aria-labelledby="judul-keputusan" className="rounded-xl border border-garis bg-permukaan p-5">
      <h2 id="judul-keputusan" className="font-semibold">
        Keputusan petugas
      </h2>
      <dl className="mt-3 space-y-2 text-sm">
        <div>
          <dt className="text-xs text-muted">Diputuskan oleh</dt>
          <dd className="font-medium">{klaim.verifikator?.nama ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted">Pada</dt>
          <dd>{formatWaktu(klaim.diverifikasi_pada)}</dd>
        </div>
        {klaim.catatan_petugas && (
          <div>
            <dt className="text-xs text-muted">Catatan</dt>
            <dd className="whitespace-pre-line">{klaim.catatan_petugas}</dd>
          </div>
        )}
      </dl>
      {klaim.pengembalian && (
        <Link
          href={ROUTES.pengembalianDetail(klaim.pengembalian.id)}
          className="mt-3 inline-block text-sm font-medium text-brand hover:underline"
        >
          Lihat bukti pengembalian
        </Link>
      )}
    </section>
  );
}
