import { IdCard } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Centang } from "@/components/form/centang";
import { Field, Textarea } from "@/components/form/field";
import { FormHasil } from "@/components/form/form-hasil";
import { PesanForm } from "@/components/form/pesan-form";
import { TombolKirim } from "@/components/form/tombol-kirim";
import { kelasTombol } from "@/components/ui/tombol";
import { serahTerima } from "@/lib/actions/pengembalian";
import { ROUTES } from "@/lib/routes";
import { BagianFotoBukti } from "./bagian-foto-bukti";

/**
 * Tiga langkah serah terima: cocokkan identitas -> persetujuan & foto -> catatan.
 * Field = pengembalianSchema (claim_id, persetujuan_foto, catatan) + foto.
 * Centang "identitas" hanya pengaman di layar (tidak disimpan).
 */
export function FormSerahTerima({ claimId, namaPengklaim }: { claimId: string; namaPengklaim: string }) {
  return (
    <FormHasil action={serahTerima} className="space-y-6">
      <PesanForm />
      <input type="hidden" name="claim_id" value={claimId} />

      <Langkah nomor={1} judul="Cocokkan identitas">
        <p className="flex gap-2 text-sm text-muted">
          <IdCard aria-hidden className="size-5 shrink-0" />
          Minta kartu identitas (KTP, KTM, atau identitas lain) dan nomor klaim, lalu pastikan namanya sesuai.
        </p>
        <Centang
          name="identitas_dicocokkan"
          label={`Kartu identitas sudah dicocokkan dengan nama “${namaPengklaim}”`}
          required
        />
      </Langkah>

      <Langkah nomor={2} judul="Persetujuan & foto bukti">
        <BagianFotoBukti />
      </Langkah>

      <Langkah nomor={3} judul="Catatan">
        <Field name="catatan" label="Catatan (opsional)" petunjuk="Mis. barang diambil oleh keluarga pemilik.">
          <Textarea rows={3} maxLength={1000} />
        </Field>
      </Langkah>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Link href={ROUTES.klaimDetail(claimId)} className={kelasTombol("kedua")}>
          Batal
        </Link>
        <TombolKirim teksProses="Menyimpan…">Selesaikan serah terima</TombolKirim>
      </div>
    </FormHasil>
  );
}

function Langkah({ nomor, judul, children }: { nomor: number; judul: string; children: ReactNode }) {
  return (
    <section className="space-y-4 rounded-xl border border-garis bg-permukaan p-5 sm:p-6">
      <h2 className="flex items-center gap-3 font-semibold">
        <span className="flex size-7 items-center justify-center rounded-full bg-aksen text-sm text-teks">{nomor}</span>
        {judul}
      </h2>
      {children}
    </section>
  );
}
