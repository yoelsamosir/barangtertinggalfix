import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { kelasTombol } from "./tombol";

/** Navigasi halaman sebelumnya/berikutnya. `href` membentuk URL untuk nomor halaman. */

type Props = { halaman: number; jumlahHalaman: number; href: (halaman: number) => string };

export function Paginasi({ halaman, jumlahHalaman, href }: Props) {
  if (jumlahHalaman <= 1) return null;

  const adaSebelumnya = halaman > 1;
  const adaBerikutnya = halaman < jumlahHalaman;

  return (
    <nav aria-label="Halaman" className="flex items-center justify-between gap-3">
      <TautanHalaman aktif={adaSebelumnya} href={href(halaman - 1)}>
        <ChevronLeft aria-hidden className="size-4" /> Sebelumnya
      </TautanHalaman>
      <p className="text-sm text-muted">
        Halaman {halaman} dari {jumlahHalaman}
      </p>
      <TautanHalaman aktif={adaBerikutnya} href={href(halaman + 1)}>
        Berikutnya <ChevronRight aria-hidden className="size-4" />
      </TautanHalaman>
    </nav>
  );
}

function TautanHalaman({ aktif, href, children }: { aktif: boolean; href: string; children: ReactNode }) {
  if (!aktif) {
    return (
      <span aria-disabled className={kelasTombol("kedua", "pointer-events-none opacity-40")}>
        {children}
      </span>
    );
  }
  return (
    <Link href={href} className={kelasTombol("kedua")}>
      {children}
    </Link>
  );
}
