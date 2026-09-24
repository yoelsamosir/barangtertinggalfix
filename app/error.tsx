"use client";

import { useEffect } from "react";
import { StatusHalaman } from "@/components/ui/status-halaman";
import { Tombol } from "@/components/ui/tombol";

export default function ErrorPage({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <StatusHalaman
      kode="Terjadi kesalahan"
      judul="Halaman gagal dimuat"
      aksi={<Tombol onClick={() => retry()}>Coba lagi</Tombol>}
    >
      Silakan coba lagi beberapa saat. Bila masalah berlanjut, hubungi petugas.
      {error.digest && <p className="mt-2 font-mono text-xs">Kode: {error.digest}</p>}
    </StatusHalaman>
  );
}
