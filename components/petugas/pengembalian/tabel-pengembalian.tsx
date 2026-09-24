import { PackageCheck } from "lucide-react";
import { TabelData, type Kolom } from "@/components/ui/tabel-data";
import type { daftarPengembalian } from "@/lib/queries/pengembalian";
import { ROUTES } from "@/lib/routes";
import { formatWaktu } from "@/lib/utils/tanggal";

type BarisPengembalian = Awaited<ReturnType<typeof daftarPengembalian>>["pengembalian"][number];

const KOLOM: Kolom<BarisPengembalian>[] = [
  { judul: "Waktu", utama: true, isi: (p) => formatWaktu(p.tanggal_pengembalian) },
  { judul: "Nomor klaim", isi: (p) => <span className="font-mono">{p.klaim?.nomor_klaim ?? "—"}</span> },
  { judul: "Penerima", isi: (p) => p.klaim?.nama_pengklaim ?? "—" },
  {
    judul: "Barang",
    isi: (p) =>
      p.barang ? (
        <>
          {p.barang.nama_barang}
          <span className="block font-mono text-xs text-muted">{p.barang.kode_barang}</span>
        </>
      ) : (
        "—"
      ),
  },
  { judul: "Petugas", isi: (p) => p.petugas?.nama ?? "—" },
];

export function TabelPengembalian({
  pengembalian,
  adaFilter,
}: {
  pengembalian: BarisPengembalian[];
  adaFilter: boolean;
}) {
  return (
    <TabelData
      label="Riwayat pengembalian"
      kolom={KOLOM}
      data={pengembalian}
      kunci={(p) => p.id}
      href={(p) => ROUTES.pengembalianDetail(p.id)}
      kosong={
        <>
          <PackageCheck aria-hidden className="mx-auto size-10 text-muted" />
          <p className="mt-3 font-semibold">
            {adaFilter ? "Tidak ada pengembalian pada rentang ini" : "Belum ada pengembalian"}
          </p>
          <p className="mt-1 text-sm text-muted">
            Barang yang sudah diserahkan kepada pemiliknya akan tercatat di sini.
          </p>
        </>
      }
    />
  );
}
