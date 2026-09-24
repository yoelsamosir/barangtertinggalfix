import { ImageOff, LockKeyhole } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import type { getPengembalian } from "@/lib/queries/pengembalian";
import { ROUTES } from "@/lib/routes";
import { formatWaktu } from "@/lib/utils/tanggal";

type DetailPengembalian = NonNullable<Awaited<ReturnType<typeof getPengembalian>>>;

/**
 * Bukti pengembalian. Foto berasal dari bucket PRIVAT lewat tautan sementara
 * (5 menit), jadi bisa gagal tampil bila halaman dibiarkan terbuka lama.
 */
export function InfoPengembalian({ data }: { data: DetailPengembalian }) {
  const info: [string, ReactNode][] = [
    ["Waktu serah terima", formatWaktu(data.tanggal_pengembalian)],
    ["Penerima", data.klaim?.nama_pengklaim ?? "—"],
    [
      "Nomor HP penerima",
      <span key="hp" className="font-mono">
        {data.klaim?.no_hp ?? "—"}
      </span>,
    ],
    [
      "Nomor klaim",
      data.klaim ? (
        <Link key="klaim" href={ROUTES.klaimDetail(data.klaim.id)} className="font-mono text-brand hover:underline">
          {data.klaim.nomor_klaim}
        </Link>
      ) : (
        "—"
      ),
    ],
    [
      "Barang",
      data.barang ? (
        <Link key="barang" href={ROUTES.barangDetail(data.barang.id)} className="text-brand hover:underline">
          {data.barang.nama_barang} ({data.barang.kode_barang})
        </Link>
      ) : (
        "—"
      ),
    ],
    ["Diserahkan oleh", data.petugas?.nama ?? "—"],
    ["Persetujuan foto", data.persetujuan_foto ? "Pengunjung menyetujui" : "—"],
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
      <figure className="space-y-2">
        {data.foto_url ? (
          // eslint-disable-next-line @next/next/no-img-element -- tautan sementara dari bucket privat
          <img
            src={data.foto_url}
            alt="Foto bukti serah terima"
            className="aspect-[4/3] w-full rounded-xl border border-garis bg-latar object-cover"
          />
        ) : (
          <div className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-garis bg-latar text-sm text-muted">
            <ImageOff aria-hidden className="size-8" /> Foto tidak dapat dimuat
          </div>
        )}
        <figcaption className="flex gap-1.5 text-xs text-muted">
          <LockKeyhole aria-hidden className="size-4 shrink-0" />
          Foto privat, hanya untuk petugas. Tidak tampil? Muat ulang halaman (tautan foto berlaku 5 menit).
        </figcaption>
      </figure>

      <div className="space-y-6">
        <dl className="divide-y divide-garis rounded-xl border border-garis bg-permukaan px-5 text-sm">
          {info.map(([label, nilai]) => (
            <div key={label} className="grid grid-cols-[10rem_1fr] gap-3 py-2.5">
              <dt className="text-muted">{label}</dt>
              <dd className="font-medium">{nilai}</dd>
            </div>
          ))}
        </dl>
        {data.catatan && (
          <div className="rounded-xl border border-garis bg-permukaan p-5 text-sm">
            <h2 className="font-semibold">Catatan</h2>
            <p className="mt-1 whitespace-pre-line">{data.catatan}</p>
          </div>
        )}
      </div>
    </div>
  );
}
