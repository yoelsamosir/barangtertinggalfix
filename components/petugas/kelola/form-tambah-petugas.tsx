import { UserPlus } from "lucide-react";
import { Field, Input, Select } from "@/components/form/field";
import { FormHasil } from "@/components/form/form-hasil";
import { InputPassword } from "@/components/form/input-password";
import { PesanForm } from "@/components/form/pesan-form";
import { TombolKirim } from "@/components/form/tombol-kirim";
import { DialogKonfirmasi, TombolTutupDialog } from "@/components/ui/dialog-konfirmasi";
import { tambahPetugas } from "@/lib/actions/petugas";
import { OPSI_PERAN } from "@/lib/domain";

/** Tombol "Tambah petugas" + dialog formulir. Isian dikosongkan setelah berhasil agar bisa menambah lagi. */
export function FormTambahPetugas() {
  return (
    <DialogKonfirmasi
      varianPemicu="utama"
      labelPemicu={
        <>
          <UserPlus aria-hidden className="size-4" /> Tambah petugas
        </>
      }
      judul="Tambah petugas"
      pesan="Akun langsung aktif dan bisa dipakai login. Sampaikan email dan password awal kepada petugas; password bisa diganti sendiri di menu Profil."
    >
      <FormHasil action={tambahPetugas} resetSaatBerhasil className="space-y-4">
        <PesanForm />
        <Field name="nama" label="Nama" wajib>
          <Input autoComplete="off" maxLength={100} required />
        </Field>
        <Field name="email" label="Email" wajib>
          <Input type="email" autoComplete="off" maxLength={254} required />
        </Field>
        <Field name="password" label="Password awal" wajib petunjuk="Minimal 8 karakter, mengandung huruf dan angka.">
          <InputPassword autoComplete="new-password" minLength={8} maxLength={72} required />
        </Field>
        <Field name="peran" label="Peran" petunjuk="Admin dapat mengelola akun petugas lain.">
          <Select defaultValue="petugas">
            {OPSI_PERAN.map((o) => (
              <option key={o.nilai} value={o.nilai}>
                {o.label}
              </option>
            ))}
          </Select>
        </Field>
        <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
          <TombolTutupDialog>Tutup</TombolTutupDialog>
          <TombolKirim teksProses="Menambahkan…">Tambah</TombolKirim>
        </div>
      </FormHasil>
    </DialogKonfirmasi>
  );
}
