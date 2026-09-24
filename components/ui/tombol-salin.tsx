"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Tombol } from "./tombol";

/** Menyalin teks ke clipboard dan menampilkan tanda "Tersalin" sesaat. */
export function TombolSalin({ teks, label = "Salin" }: { teks: string; label?: string }) {
  const [tersalin, setTersalin] = useState(false);

  async function salin() {
    try {
      await navigator.clipboard.writeText(teks);
      setTersalin(true);
      setTimeout(() => setTersalin(false), 2000);
    } catch {
      // Clipboard tidak tersedia (mis. izin ditolak); pengguna masih bisa menyalin manual.
    }
  }

  return (
    <Tombol varian="kedua" onClick={salin} aria-live="polite">
      {tersalin ? <Check aria-hidden className="size-4 text-sukses" /> : <Copy aria-hidden className="size-4" />}
      {tersalin ? "Tersalin" : label}
    </Tombol>
  );
}
