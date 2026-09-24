import { ClipboardList } from "lucide-react";
import { TabelData, type Kolom } from "@/components/ui/tabel-data";
import type { daftarKlaim } from "@/lib/queries/klaim";
import { ROUTES } from "@/lib/routes";
import { formatWaktu } from "@/lib/utils/tanggal";
import { BadgeStatusKlaim } from "./badge-status-klaim";

type BarisKlaim = Awaited<ReturnType<typeof daftarKlaim>>["klaim"][number];

const KOLOM: Kolom<BarisKlaim>[] = [
  {
    judul: "Nomor klaim",
    utama: true,
    isi: (k) => <span className="font-mono">{k.nomor_klaim}</span>,
  },
  { judul: "Pengklaim", isi: (k) => k.nama_pengklaim },
  {
    judul: "Barang",
    isi: (k) =>
      k.barang ? (
        <>
          {k.barang.nama_barang}
          <span className="block font-mono text-xs text-muted">{k.barang.kode_barang}</span>
        </>
      ) : (
        "—"
      ),
  },
  { judul: "Diajukan", isi: (k) => formatWaktu(k.created_at), kelas: "whitespace-nowrap" },
  { judul: "Status", isi: (k) => <BadgeStatusKlaim status={k.status} /> },
];

export function TabelKlaim({ klaim, adaFilter }: { klaim: BarisKlaim[]; adaFilter: boolean }) {
  return (
    <TabelData
      label="Daftar klaim"
      kolom={KOLOM}
      data={klaim}
      kunci={(k) => k.id}
      href={(k) => ROUTES.klaimDetail(k.id)}
      kosong={
        <>
          <ClipboardList aria-hidden className="mx-auto size-10 text-muted" />
          <p className="mt-3 font-semibold">{adaFilter ? "Tidak ada klaim yang cocok" : "Belum ada klaim"}</p>
          <p className="mt-1 text-sm text-muted">
            {adaFilter ? "Ubah kata kunci atau filter." : "Klaim yang diajukan pengunjung akan tampil di sini."}
          </p>
        </>
      }
    />
  );
}
