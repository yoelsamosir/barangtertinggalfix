import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Daftar data generik. Desktop (md+): tabel. HP: setiap baris menjadi kartu,
 * kolom `utama` jadi judul kartu dan kolom lain tampil sebagai "label: isi".
 * Bila `href` diisi, seluruh baris/kartu bisa diklik.
 */

export type Kolom<T> = {
  judul: string;
  isi: (baris: T) => ReactNode;
  /** Kolom judul baris (biasanya nama); berisi tautan bila `href` diisi. */
  utama?: boolean;
  /** Sembunyikan kolom ini di tampilan kartu HP. */
  sembunyiDiHp?: boolean;
  kelas?: string;
};

type Props<T> = {
  kolom: Kolom<T>[];
  data: T[];
  kunci: (baris: T) => string;
  href?: (baris: T) => string;
  kosong: ReactNode;
  label: string;
};

export function TabelData<T>({ kolom, data, kunci, href, kosong, label }: Props<T>) {
  if (data.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-garis bg-permukaan px-6 py-12 text-center">{kosong}</div>
    );
  }

  const utama = kolom.find((k) => k.utama) ?? kolom[0];
  const isiUtama = (baris: T) => {
    const isi = utama.isi(baris);
    if (!href) return isi;
    // after:inset-0 membuat seluruh baris/kartu (yang `relative`) ikut bisa diklik.
    return (
      <Link href={href(baris)} className="font-semibold after:absolute after:inset-0 hover:text-brand hover:underline">
        {isi}
      </Link>
    );
  };

  return (
    <>
      <div className="hidden overflow-x-auto rounded-xl border border-garis bg-permukaan md:block">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">{label}</caption>
          <thead className="border-b border-garis bg-latar text-xs tracking-wide text-muted uppercase">
            <tr>
              {kolom.map((k) => (
                <th key={k.judul} scope="col" className={`px-4 py-3 font-medium ${k.kelas ?? ""}`}>
                  {k.judul}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-garis">
            {data.map((baris) => (
              <tr key={kunci(baris)} className="relative hover:bg-latar/60">
                {kolom.map((k) => (
                  <td key={k.judul} className={`px-4 py-3 align-middle ${k.kelas ?? ""}`}>
                    {k === utama ? isiUtama(baris) : k.isi(baris)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul aria-label={label} className="space-y-3 md:hidden">
        {data.map((baris) => (
          <li key={kunci(baris)} className="relative rounded-xl border border-garis bg-permukaan p-4">
            <div className="text-base">{isiUtama(baris)}</div>
            <dl className="mt-2 space-y-1 text-sm">
              {kolom
                .filter((k) => k !== utama && !k.sembunyiDiHp)
                .map((k) => (
                  <div key={k.judul} className="flex gap-2">
                    <dt className="w-28 shrink-0 text-muted">{k.judul}</dt>
                    <dd className="min-w-0">{k.isi(baris)}</dd>
                  </div>
                ))}
            </dl>
          </li>
        ))}
      </ul>
    </>
  );
}
