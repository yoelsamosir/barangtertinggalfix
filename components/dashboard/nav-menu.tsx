"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MENU_DASHBOARD, menuAktif } from "./menu";

/**
 * Daftar menu petugas; menu halaman yang sedang dibuka ditandai.
 * `lencana` = angka kecil di samping menu (kunci: href menu), mis. jumlah klaim menunggu.
 */
export function NavMenu({ lencana = {} }: { lencana?: Record<string, number> }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Menu petugas">
      <ul className="space-y-1">
        {MENU_DASHBOARD.map(({ label, href, ikon: Ikon }) => {
          const aktif = menuAktif(href, pathname);
          const angka = lencana[href] ?? 0;
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={aktif ? "page" : undefined}
                className={`flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors ${
                  aktif ? "bg-brand text-white" : "text-teks hover:bg-brand-muda hover:text-brand-tua"
                }`}
              >
                <Ikon aria-hidden className="size-5 shrink-0" />
                <span className="flex-1">{label}</span>
                {angka > 0 && (
                  <span className="min-w-6 rounded-full bg-aksen px-1.5 text-center text-xs leading-6 font-semibold text-teks">
                    {angka > 99 ? "99+" : angka}
                    <span className="sr-only"> menunggu</span>
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
