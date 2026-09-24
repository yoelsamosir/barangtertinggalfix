"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MENU_DASHBOARD, menuAktif } from "./menu";

/** Daftar menu petugas; menu halaman yang sedang dibuka ditandai. */
export function NavMenu() {
  const pathname = usePathname();

  return (
    <nav aria-label="Menu petugas">
      <ul className="space-y-1">
        {MENU_DASHBOARD.map(({ label, href, ikon: Ikon }) => {
          const aktif = menuAktif(href, pathname);
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
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
