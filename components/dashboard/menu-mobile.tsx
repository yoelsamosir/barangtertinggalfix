"use client";

import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

/**
 * Bilah atas di HP + laci navigasi yang bisa dibuka/tutup.
 * Isi laci (children) sama dengan sidebar desktop. Laci tertutup sendiri
 * setelah berpindah halaman atau menekan Escape.
 */
export function MenuMobile({ judul, children }: { judul: string; children: ReactNode }) {
  const [terbuka, setTerbuka] = useState(false);
  const pathname = usePathname();

  // Tutup laci setiap kali halaman berganti.
  const [pathTerakhir, setPathTerakhir] = useState(pathname);
  if (pathTerakhir !== pathname) {
    setPathTerakhir(pathname);
    setTerbuka(false);
  }

  useEffect(() => {
    if (!terbuka) return;
    const tutupDenganEscape = (e: KeyboardEvent) => e.key === "Escape" && setTerbuka(false);
    document.addEventListener("keydown", tutupDenganEscape);
    return () => document.removeEventListener("keydown", tutupDenganEscape);
  }, [terbuka]);

  return (
    <div className="lg:hidden">
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b-4 border-aksen bg-permukaan px-4 py-2">
        <button
          type="button"
          onClick={() => setTerbuka(true)}
          aria-label="Buka menu"
          aria-expanded={terbuka}
          aria-controls="laci-menu"
          className="-ml-2 flex size-11 items-center justify-center rounded-lg hover:bg-latar"
        >
          <Menu aria-hidden className="size-6" />
        </button>
        <span className="font-semibold">{judul}</span>
      </header>

      {terbuka && (
        <div className="fixed inset-0 z-40">
          <div aria-hidden className="absolute inset-0 bg-teks/40" onClick={() => setTerbuka(false)} />
          <div
            id="laci-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu petugas"
            className="absolute inset-y-0 left-0 w-72 max-w-[85%] overflow-y-auto bg-permukaan shadow-xl"
          >
            <button
              type="button"
              onClick={() => setTerbuka(false)}
              aria-label="Tutup menu"
              className="absolute top-3 right-3 flex size-10 items-center justify-center rounded-lg hover:bg-latar"
            >
              <X aria-hidden className="size-5" />
            </button>
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
