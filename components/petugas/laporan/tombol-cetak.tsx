"use client";

import { Printer } from "lucide-react";
import { Tombol } from "@/components/ui/tombol";

/** Buka dialog cetak browser (bisa juga "Simpan sebagai PDF"). */
export function TombolCetak() {
  return (
    <Tombol varian="kedua" onClick={() => window.print()}>
      <Printer aria-hidden className="size-4" /> Cetak / PDF
    </Tombol>
  );
}
