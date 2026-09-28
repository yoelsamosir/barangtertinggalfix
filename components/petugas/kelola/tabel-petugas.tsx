import { Badge } from "@/components/ui/badge";
import { TabelData, type Kolom } from "@/components/ui/tabel-data";
import { PERAN_LABEL, STATUS_AKUN_LABEL, type PeranPetugas, type StatusAkun } from "@/lib/domain";
import type { BarisPetugas } from "@/lib/queries/petugas";
import { formatWaktu } from "@/lib/utils/tanggal";
import { AksiPetugas } from "./aksi-petugas";

/** Daftar akun petugas untuk admin. Baris milik admin yang sedang login ditandai "Anda" dan tanpa aksi. */
export function TabelPetugas({ petugas, idSaya }: { petugas: BarisPetugas[]; idSaya: string }) {
  const kolom: Kolom<BarisPetugas>[] = [
    {
      judul: "Nama",
      utama: true,
      isi: (p) => (
        <span className="inline-flex items-center gap-2 font-semibold">
          {p.nama}
          {p.id === idSaya && <Badge>Anda</Badge>}
        </span>
      ),
    },
    { judul: "Email", isi: (p) => <span className="break-all">{p.email}</span> },
    {
      judul: "Peran",
      isi: (p) => (
        <Badge warna={p.peran === "admin" ? "brand" : "netral"}>{PERAN_LABEL[p.peran as PeranPetugas]}</Badge>
      ),
    },
    {
      judul: "Status",
      isi: (p) => (
        <Badge warna={p.status === "aktif" ? "sukses" : "bahaya"}>{STATUS_AKUN_LABEL[p.status as StatusAkun]}</Badge>
      ),
    },
    {
      judul: "Login terakhir",
      isi: (p) => (p.terakhir_login ? formatWaktu(p.terakhir_login) : <span className="text-muted">Belum pernah</span>),
    },
    {
      judul: "Aksi",
      isi: (p) =>
        p.id === idSaya ? (
          <span className="text-xs text-muted">Kelola akun Anda di menu Profil</span>
        ) : (
          <AksiPetugas petugas={p} />
        ),
    },
  ];

  return (
    <TabelData
      label="Daftar petugas"
      kolom={kolom}
      data={petugas}
      kunci={(p) => p.id}
      kosong={<p className="text-sm text-muted">Belum ada petugas.</p>}
    />
  );
}
