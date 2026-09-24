import type { LucideIcon } from "lucide-react";
import Link from "next/link";

/** Angka ringkasan yang bisa diklik menuju daftar terkait. `sorot` = perlu perhatian (emas). */

type Props = { label: string; nilai: number; href: string; ikon: LucideIcon; sorot?: boolean };

export function KartuStatistik({ label, nilai, href, ikon: Ikon, sorot = false }: Props) {
  return (
    <Link
      href={href}
      className={`group flex items-center gap-4 rounded-xl border p-4 transition hover:shadow-sm focus-visible:outline-2 focus-visible:outline-brand ${
        sorot ? "border-aksen bg-aksen-muda" : "border-garis bg-permukaan hover:border-brand/40"
      }`}
    >
      <span
        className={`flex size-11 shrink-0 items-center justify-center rounded-full ${
          sorot ? "bg-aksen text-teks" : "bg-brand-muda text-brand"
        }`}
      >
        <Ikon aria-hidden className="size-5" />
      </span>
      <span className="min-w-0">
        <span className="block text-2xl font-bold tabular-nums">{nilai.toLocaleString("id-ID")}</span>
        <span className={`block text-sm ${sorot ? "text-aksen-tua" : "text-muted"} group-hover:underline`}>
          {label}
        </span>
      </span>
    </Link>
  );
}
