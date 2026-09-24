"use client";

import { ImagePlus } from "lucide-react";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { kecilkanFoto } from "@/lib/browser/kecilkan-foto";
import { Input } from "./field";

/**
 * Pilih foto (kamera atau galeri di HP) + pratinjau. Foto dikecilkan di
 * browser lalu menggantikan file asli di <input>, sehingga yang terkirim
 * bersama form adalah versi kecil. Letakkan di dalam <Field name="...">.
 *
 * `fotoAwal` = URL foto yang sudah tersimpan (form ubah), tampil sampai diganti.
 */
export function InputFoto({ fotoAwal, onPilih }: { fotoAwal?: string | null; onPilih?: (adaFoto: boolean) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pratinjau, setPratinjau] = useState<string | null>(null);
  const [memproses, setMemproses] = useState(false);

  // Bebaskan memori URL pratinjau sebelumnya.
  useEffect(() => {
    if (!pratinjau) return;
    return () => URL.revokeObjectURL(pratinjau);
  }, [pratinjau]);

  async function pilih(event: ChangeEvent<HTMLInputElement>) {
    const asli = event.target.files?.[0];
    if (!asli) {
      setPratinjau(null);
      onPilih?.(false);
      return;
    }

    setMemproses(true);
    const kecil = await kecilkanFoto(asli);
    setMemproses(false);

    if (kecil !== asli && inputRef.current) {
      const ganti = new DataTransfer();
      ganti.items.add(kecil);
      inputRef.current.files = ganti.files;
    }
    setPratinjau(URL.createObjectURL(kecil));
    onPilih?.(true);
  }

  const gambar = pratinjau ?? fotoAwal;

  return (
    <div className="space-y-3">
      {gambar ? (
        // eslint-disable-next-line @next/next/no-img-element -- pratinjau lokal (blob:)
        <img
          src={gambar}
          alt="Pratinjau foto"
          className="aspect-[4/3] w-full max-w-sm rounded-lg border border-garis object-cover"
        />
      ) : (
        <div className="flex aspect-[4/3] w-full max-w-sm flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-garis bg-latar text-muted">
          <ImagePlus aria-hidden className="size-8" />
          <span className="text-sm">Belum ada foto</span>
        </div>
      )}
      <Input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={pilih}
        className="file:mr-3 file:rounded-md file:border-0 file:bg-brand-muda file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-brand-tua"
      />
      {memproses && <p className="text-xs text-muted">Menyiapkan foto…</p>}
    </div>
  );
}
