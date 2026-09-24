import type { ReactNode } from "react";

/** Judul halaman + keterangan singkat + tombol aksi di kanan (turun ke bawah di HP). */
export function KepalaHalaman({ judul, children, aksi }: { judul: string; children?: ReactNode; aksi?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold">{judul}</h1>
        {children && <div className="mt-1 text-sm text-muted">{children}</div>}
      </div>
      {aksi && <div className="flex shrink-0 flex-wrap gap-2">{aksi}</div>}
    </div>
  );
}
