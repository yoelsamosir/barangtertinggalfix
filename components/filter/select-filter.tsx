"use client";

import { useRouter } from "next/navigation";

/**
 * Dropdown filter yang langsung berpindah ke URL pilihan (tanpa tombol).
 * URL tiap opsi sudah dibentuk di server, jadi komponen ini tidak perlu
 * tahu parameter filter lain yang sedang aktif.
 */

type Opsi = { label: string; href: string; nilai: string };

type Props = { label: string; opsi: Opsi[]; aktif: string; labelSemua: string; hrefSemua: string };

export function SelectFilter({ label, opsi, aktif, labelSemua, hrefSemua }: Props) {
  const router = useRouter();

  function pindah(nilai: string) {
    router.push(opsi.find((o) => o.nilai === nilai)?.href ?? hrefSemua);
  }

  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="shrink-0 text-muted">{label}</span>
      <select
        value={aktif}
        onChange={(e) => pindah(e.target.value)}
        className="h-10 rounded-lg border border-garis bg-permukaan px-3 text-sm focus:border-brand focus:outline-2 focus:outline-brand/30"
      >
        <option value="">{labelSemua}</option>
        {opsi.map((o) => (
          <option key={o.nilai} value={o.nilai}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
