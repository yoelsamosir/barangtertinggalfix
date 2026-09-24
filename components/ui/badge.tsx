import type { ReactNode } from "react";

/** Label status kecil berbentuk pil. */

export type WarnaBadge = "netral" | "sukses" | "aksen" | "bahaya" | "brand";

const GAYA: Record<WarnaBadge, string> = {
  netral: "bg-latar text-muted ring-garis",
  sukses: "bg-sukses-muda text-sukses ring-sukses/20",
  // Emas: teks harus gelap (putih di atas emas tidak terbaca).
  aksen: "bg-aksen-muda text-aksen-tua ring-aksen/40",
  bahaya: "bg-bahaya-muda text-bahaya ring-bahaya/20",
  brand: "bg-brand-muda text-brand-tua ring-brand/20",
};

export function Badge({ warna = "netral", children }: { warna?: WarnaBadge; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${GAYA[warna]}`}
    >
      {children}
    </span>
  );
}
