import type { ReactNode } from "react";

/** Tampilan penuh untuk halaman kosong/error/404: kode, judul, penjelasan, aksi. */

type Props = { kode?: string; judul: string; children?: ReactNode; aksi?: ReactNode };

export function StatusHalaman({ kode, judul, children, aksi }: Props) {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="max-w-md text-center">
        {kode && <p className="text-sm font-semibold tracking-wide text-brand">{kode}</p>}
        <h1 className="mt-2 text-2xl font-semibold">{judul}</h1>
        {children && <div className="mt-3 text-muted">{children}</div>}
        {aksi && <div className="mt-6 flex flex-wrap justify-center gap-3">{aksi}</div>}
      </div>
    </main>
  );
}
