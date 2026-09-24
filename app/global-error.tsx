"use client";

import { StatusHalaman } from "@/components/ui/status-halaman";
import { Tombol } from "@/components/ui/tombol";
import "./globals.css";

/** Menggantikan root layout bila layout itu sendiri gagal dirender. */
export default function GlobalError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <html lang="id">
      <body className="flex min-h-screen flex-col">
        <title>Terjadi kesalahan</title>
        <StatusHalaman
          kode="Terjadi kesalahan"
          judul="Aplikasi gagal dimuat"
          aksi={<Tombol onClick={() => retry()}>Coba lagi</Tombol>}
        >
          Silakan coba lagi beberapa saat.
          {error.digest && <p className="mt-2 font-mono text-xs">Kode: {error.digest}</p>}
        </StatusHalaman>
      </body>
    </html>
  );
}
