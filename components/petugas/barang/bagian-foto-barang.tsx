"use client";

import { useState } from "react";
import { Centang } from "@/components/form/centang";
import { Field } from "@/components/form/field";
import { InputFoto } from "@/components/form/input-foto";

/**
 * Bagian foto di form barang: pilih foto, opsi hapus foto lama (form ubah),
 * dan izin tampil ke publik. Opsi "hapus foto" disembunyikan begitu foto baru
 * dipilih, karena foto baru otomatis menggantikan yang lama.
 */

type Props = { fotoAwal?: string | null; tampilkanFoto?: boolean };

export function BagianFotoBarang({ fotoAwal, tampilkanFoto = false }: Props) {
  const [adaFotoBaru, setAdaFotoBaru] = useState(false);

  return (
    <div className="space-y-4">
      <Field
        name="foto"
        label="Foto barang"
        petunjuk="Opsional. JPG, PNG, atau WEBP. Foto dari HP otomatis dikecilkan sebelum diunggah."
      >
        <InputFoto fotoAwal={fotoAwal} onPilih={setAdaFotoBaru} />
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
