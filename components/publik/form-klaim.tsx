import { ShieldCheck } from "lucide-react";
import { Field, Input, Textarea } from "@/components/form/field";
import { FormHasil } from "@/components/form/form-hasil";
import { PesanForm } from "@/components/form/pesan-form";
import { TombolKirim } from "@/components/form/tombol-kirim";
import { Turnstile } from "@/components/turnstile/turnstile";
import { ajukanKlaim } from "@/lib/actions/klaim";
import { hariIniWIB } from "@/lib/utils/tanggal";
import { KlaimTerkirim } from "./klaim-terkirim";

/** Form pengajuan klaim publik. Nama field = skema ajukanKlaimSchema. */
export function FormKlaim({ itemId }: { itemId: string }) {
  return (
    <FormHasil action={ajukanKlaim}>
      <KlaimTerkirim>
        <div className="space-y-5 rounded-xl border border-garis bg-permukaan p-5 sm:p-6">
          <PesanForm />
          <input type="hidden" name="item_id" value={itemId} />

          <Field name="nama_pengklaim" label="Nama lengkap" wajib>
            <Input autoComplete="name" maxLength={100} required />
          </Field>

          <Field
            name="no_hp"
            label="Nomor HP (WhatsApp)"
            wajib
            petunjuk="Petugas akan menghubungi nomor ini. Contoh: 081234567890"
          >
            <Input type="tel" inputMode="tel" autoComplete="tel" maxLength={20} required />
          </Field>

          <Field name="waktu_kehilangan" label="Perkiraan tanggal kehilangan" wajib>
            <Input type="date" max={hariIniWIB()} required />
          </Field>

          <Field
            name="lokasi_kehilangan"
            label="Lokasi terakhir barang digunakan"
            wajib
            petunjuk="Contoh: Ruang Baca Lantai 2, dekat jendela"
          >
            <Input maxLength={150} required />
          </Field>

          <Field
            name="ciri_barang"
            label="Ciri-ciri barang"
            wajib
            petunjuk="Sebutkan hal yang hanya diketahui pemilik: merek, isi, tanda khusus, goresan, gantungan, dll."
          >
            <Textarea maxLength={1000} rows={5} required />
          </Field>

          <Field name="keterangan" label="Keterangan tambahan">
            <Textarea maxLength={1000} rows={3} />
          </Field>

          <p className="flex gap-2 rounded-lg bg-latar p-3 text-xs text-muted">
            <ShieldCheck aria-hidden className="size-4 shrink-0 text-sukses" />
            Data Anda, termasuk nomor HP, hanya dipakai petugas untuk memverifikasi dan memproses klaim ini.
          </p>

          <Turnstile />
          <TombolKirim teksProses="Mengirim klaim…" className="w-full py-3 text-base">
            Ajukan klaim
          </TombolKirim>
        </div>
      </KlaimTerkirim>
    </FormHasil>
  );
}
