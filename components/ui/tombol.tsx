import type { ButtonHTMLAttributes } from "react";

/** Tombol dasar. Untuk <Link> bergaya tombol, pakai `kelasTombol()`. */

export type VarianTombol = "utama" | "kedua" | "bahaya" | "polos";

const DASAR =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium " +
  "transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand " +
  "disabled:cursor-not-allowed disabled:opacity-60";

const VARIAN: Record<VarianTombol, string> = {
  utama: "bg-brand text-white hover:bg-brand-tua",
  kedua: "border border-garis bg-permukaan text-teks hover:bg-latar",
  // Bergaya garis agar tidak tertukar dengan tombol utama yang juga merah.
  bahaya: "border border-bahaya bg-permukaan text-bahaya hover:bg-bahaya-muda",
  polos: "text-brand hover:bg-brand-muda",
};

export function kelasTombol(varian: VarianTombol = "utama", tambahan = ""): string {
  return `${DASAR} ${VARIAN[varian]} ${tambahan}`.trim();
}

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { varian?: VarianTombol };

export function Tombol({ varian = "utama", className = "", type = "button", ...props }: Props) {
  return <button type={type} className={kelasTombol(varian, className)} {...props} />;
}
