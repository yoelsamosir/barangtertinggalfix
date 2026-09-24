"use client";

import { CircleCheck } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { useFormHasil } from "@/components/form/form-hasil";
import { kelasTombol } from "@/components/ui/tombol";
import { TombolSalin } from "@/components/ui/tombol-salin";
import { INSTANSI } from "@/lib/aplikasi";
import { ROUTES } from "@/lib/routes";

/**
 * Di dalam form klaim: menampilkan isian form (children) sampai klaim
 * berhasil, lalu menggantinya dengan nomor klaim & langkah selanjutnya.
 */
export function KlaimTerkirim({ children }: { children: ReactNode }) {
  const state = useFormHasil<{ nomor_klaim: string }>()?.state;
  if (!state?.ok) return children;

  return (
    <div role="status" className="rounded-xl border border-sukses/30 bg-permukaan p-6 text-center">
      <CircleCheck aria-hidden className="mx-auto size-12 text-sukses" />
      <h2 className="mt-3 text-xl font-semibold">Klaim berhasil diajukan</h2>
      <p className="mt-4 text-sm text-muted">Nomor klaim Anda</p>
      <p className="mt-1 font-mono text-3xl font-bold tracking-wider text-brand">{state.data.nomor_klaim}</p>
      <div className="mt-3 flex justify-center">
        <TombolSalin teks={state.data.nomor_klaim} label="Salin nomor klaim" />
      </div>
      <p className="mt-4 rounded-lg bg-aksen-muda px-4 py-3 text-sm text-aksen-tua">
        <strong>Simpan nomor ini</strong> (catat atau tangkap layar). Nomor klaim diperlukan saat mengambil barang.
      </p>

      <div className="mt-6 text-left text-sm">
        <p className="font-semibold">Langkah selanjutnya</p>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-muted">
          <li>Petugas akan memverifikasi klaim Anda dan menghubungi nomor HP yang Anda isi.</li>
          <li>
            Bila klaim disetujui, datang ke {INSTANSI.gedung} pada jam layanan ({INSTANSI.jamLayanan}) dengan membawa
            nomor klaim dan kartu identitas (KTP, KTM, atau identitas lain).
          </li>
        </ol>
      </div>

      <Link href={ROUTES.beranda} className={kelasTombol("kedua", "mt-6")}>
        Kembali ke daftar barang
      </Link>
    </div>
  );
}
