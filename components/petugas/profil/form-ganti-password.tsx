import { Field } from "@/components/form/field";
import { FormHasil } from "@/components/form/form-hasil";
import { InputPassword } from "@/components/form/input-password";
import { PesanForm } from "@/components/form/pesan-form";
import { TombolKirim } from "@/components/form/tombol-kirim";
import { gantiPassword } from "@/lib/actions/akun";

/**
 * Ganti password (wajib password lama). Isian dikosongkan setelah berhasil.
 * Sesi di perangkat lain dicabut; keluar paling lambat 1 jam kemudian (lihat services/akun).
 */
export function FormGantiPassword() {
  return (
    <FormHasil action={gantiPassword} resetSaatBerhasil className="space-y-5">
      <PesanForm />
      <Field name="password_lama" label="Password lama" wajib>
        <InputPassword autoComplete="current-password" maxLength={72} required />
      </Field>
      <Field
        name="password_baru"
        label="Password baru"
        wajib
        petunjuk="Minimal 8 karakter, mengandung huruf dan angka."
      >
        <InputPassword autoComplete="new-password" minLength={8} maxLength={72} required />
      </Field>
      <Field name="konfirmasi_password" label="Ulangi password baru" wajib>
        <InputPassword autoComplete="new-password" maxLength={72} required />
      </Field>
      <p className="text-xs text-muted">
        Setelah password diganti, perangkat lain yang sedang login dengan akun ini akan keluar otomatis paling lambat 1
        jam kemudian.
      </p>
      <div className="flex justify-end">
        <TombolKirim teksProses="Menyimpan…">Ganti password</TombolKirim>
      </div>
    </FormHasil>
  );
}
