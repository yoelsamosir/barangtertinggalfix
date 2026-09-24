"use client";

import { ShieldCheck } from "lucide-react";
import { useState } from "react";
import { AmbilFotoKamera } from "@/components/form/ambil-foto-kamera";
import { Centang } from "@/components/form/centang";
import { Field } from "@/components/form/field";

/**
 * Persetujuan pengunjung + foto bukti. Kamera baru dipasang (menyala) setelah
 * persetujuan dicentang; bila centang dibatalkan, kamera dilepas sehingga
 * kamera mati dan foto yang sempat diambil ikut terhapus.
 */
export function BagianFotoBukti() {
  const [setuju, setSetuju] = useState(false);

  return (
    <div className="space-y-5">
      <div className="rounded-lg bg-latar p-4 text-sm">
        <p className="flex items-center gap-2 font-semibold">
          <ShieldCheck aria-hidden className="size-4 text-sukses" /> Sampaikan kepada pengunjung
        </p>
        <p className="mt-1 text-muted">
          Foto diambil hanya sebagai bukti pengembalian barang, disimpan secara privat, dan hanya dapat dilihat oleh
          petugas. Foto tidak ditampilkan ke publik dan tidak dipakai untuk keperluan lain.
        </p>
      </div>

      <Centang
        name="persetujuan_foto"
        label="Pengunjung menyetujui pengambilan foto"
        checked={setuju}
        onChange={(e) => setSetuju(e.target.checked)}
        required
      />

      <Field name="foto" label="Foto bukti serah terima" wajib petunjuk="Foto pengunjung bersama barang yang diterima.">
        {setuju ? (
          <AmbilFotoKamera />
        ) : (
          <p className="flex aspect-[4/3] w-full max-w-md items-center justify-center rounded-lg border border-dashed border-garis bg-latar p-4 text-center text-sm text-muted">
            Kamera akan menyala setelah persetujuan pengunjung dicentang.
          </p>
        )}
      </Field>
    </div>
  );
}
