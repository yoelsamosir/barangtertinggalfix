"use client";

import { Camera, ImagePlus } from "lucide-react";
import { useState } from "react";
import { AmbilFotoKamera } from "@/components/form/ambil-foto-kamera";
import { Centang } from "@/components/form/centang";
import { Field } from "@/components/form/field";
import { InputFoto } from "@/components/form/input-foto";
import { Tombol } from "@/components/ui/tombol";

/**
 * Bagian foto di form barang: pilih foto dari file/galeri atau jepret langsung
 * dengan kamera, opsi hapus foto lama (form ubah), dan izin tampil ke publik.
 * Opsi "hapus foto" disembunyikan begitu foto baru dipilih, karena foto baru
 * otomatis menggantikan yang lama.
 *
 * Kamera hanya dipasang (menyala) saat mode "kamera" dipilih; berganti mode
 * melepas input sebelumnya sehingga foto yang belum dikirim ikut terbuang.
 */

type Props = { fotoAwal?: string | null; tampilkanFoto?: boolean };
type Sumber = "file" | "kamera";

export function BagianFotoBarang({ fotoAwal, tampilkanFoto = false }: Props) {
  const [adaFotoBaru, setAdaFotoBaru] = useState(false);
  const [sumber, setSumber] = useState<Sumber>("file");

  function gantiSumber(baru: Sumber) {
    setSumber(baru);
    setAdaFotoBaru(false);
  }

  return (
    <div className="space-y-4">
      <div role="group" aria-label="Sumber foto" className="flex flex-wrap gap-2">
        <Tombol
          varian={sumber === "file" ? "utama" : "kedua"}
          aria-pressed={sumber === "file"}
          onClick={() => gantiSumber("file")}
        >
          <ImagePlus aria-hidden className="size-4" /> Pilih file
        </Tombol>
        <Tombol
          varian={sumber === "kamera" ? "utama" : "kedua"}
          aria-pressed={sumber === "kamera"}
          onClick={() => gantiSumber("kamera")}
        >
          <Camera aria-hidden className="size-4" /> Ambil dengan kamera
        </Tombol>
      </div>

      <Field
        name="foto"
        label="Foto barang"
        petunjuk="Opsional. JPG, PNG, atau WEBP. Foto dari HP otomatis dikecilkan sebelum diunggah."
      >
        {sumber === "kamera" ? (
          <AmbilFotoKamera namaFile="foto-barang.jpg" onPilih={setAdaFotoBaru} />
        ) : (
          <InputFoto fotoAwal={fotoAwal} onPilih={setAdaFotoBaru} />
        )}
      </Field>

      {fotoAwal && !adaFotoBaru && (
        <Centang name="hapus_foto" label="Hapus foto yang tersimpan" keterangan="Barang akan tampil tanpa foto." />
      )}

      <Centang
        name="tampilkan_foto"
        label="Tampilkan foto ke publik"
        defaultChecked={tampilkanFoto}
        keterangan="Biarkan tidak dicentang bila foto memperlihatkan detail yang bisa dipakai untuk klaim palsu (isi dompet, nomor kartu, dan sebagainya)."
      />
    </div>
  );
}
